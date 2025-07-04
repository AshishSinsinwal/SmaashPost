const express = require('express');
const postController = require("../controller/post");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const Post = require('../Schema/post');
const {isOwner ,isLoggedIn} = require("../middlewares");


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