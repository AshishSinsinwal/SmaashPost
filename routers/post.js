const express = require('express');
const postController = require("../controller/post");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const Post = require('../Schema/post');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error" , "Login to access this feature");
  res.redirect("/login");
}


async function isOwner(req, res, next) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      req.flash("error", "Post not found.");
      return res.redirect("/posts");
    }
    if (!post.owner.equals(req.user._id)) {
      req.flash("error", "You do not have permission!");
      return res.redirect(`/posts/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
}

router 
    .route("/")
    .get(postController.index)
    .post(isLoggedIn , postController.newPost)

router
    .route("/user")
    .get(isLoggedIn , postController.userPosts);
    
router
    .route("/new")
    .get(isLoggedIn , postController.renderNewPostForm);

router
    .route("/:id")
    .get(postController.getPost)
    .patch(isLoggedIn , isOwner ,postController.editPost)
    .delete(isLoggedIn , isOwner ,postController.destroyPost)

router
    .route("/:id/edit")
    .get(isLoggedIn ,isOwner, postController.renderEditForm);





module.exports = router;