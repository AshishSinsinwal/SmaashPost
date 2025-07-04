const express = require('express');
const userController = require("../controller/user");
const router = express.Router({ mergeParams: true });
router 
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signUp);

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(userController.login);

router
    .route("/logout")
    .get(userController.logout);

module.exports = router;