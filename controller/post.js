// controllers/post.js
const mongoose = require("mongoose");
const Post = require("../Schema/post");
const User = require("../Schema/user");
const postJoiSchema = require("../utils/joi");
const ExpressError = require("../utils/expressErr");
const wrapAsync = require("../utils/wrapAsync");
const { all } = require("../routers/post");

// Middleware to validate MongoDB ObjectId
function validateObjId(req, res, next) {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        return next();
    }
    throw new ExpressError("Invalid ID format", 400);
}

module.exports.index = wrapAsync(async (req, res) => {
    let allPosts = await Post.find({}).populate("owner");
    allPosts.sort((a, b) => b.updatedAt - a.updatedAt);
    res.render("index.ejs", { allPosts });
});

module.exports.renderNewPostForm = (req, res) => {
    let username = req.user.username;
    console.log("username is " , username);
    res.render("new.ejs", { username });
};

module.exports.newPost = wrapAsync(async (req, res) => {
    const { error } = postJoiSchema.validate(req.body);
    if (error) throw new ExpressError(error.details[0].message, 400);

    const { username, content, title } = req.body;
    let owner = await User.findOne({ username });

    if (!owner) {
        req.flash("error", "User not found");
        return res.redirect("/posts");
    }

    let newPost = new Post({ username, title, content, owner: owner._id });
    await newPost.save();
    req.flash("success", "New post created!");
    res.redirect(`/posts/${newPost._id}`);
});

module.exports.getPost = [
    validateObjId,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).render("error.ejs", { message: "Post not found" });
        }
        res.render("show.ejs", { post });
    })
];

module.exports.renderEditForm = [
    validateObjId,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).render("error.ejs", { message: "Post not found" });
        }
        res.render("edit.ejs", { post });
    })
];

module.exports.editPost = [
    validateObjId,
    wrapAsync(async (req, res) => {
        const { error } = postJoiSchema.validate(req.body);
        if (error) throw new ExpressError(error.details[0].message, 400);

        const { id } = req.params;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(id, { content }, { new: true });
        if (!post) {
            return res.status(404).render("error.ejs", { message: "Post not found" });
        }

        req.flash("success", "Post updated!");
        res.redirect("/posts");
    })
];

module.exports.userPosts = async (req , res)=>{
    let {username} = req.user;
    let allPosts = await Post.find({username}).populate("owner");
    console.log(allPosts);
    res.render("index.ejs" , {allPosts});
}

module.exports.destroyPost = [
    validateObjId,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        req.flash("success", "Post deleted!");
        res.redirect("/posts");
    })
];
