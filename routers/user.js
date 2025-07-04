const express = require('express');
const userController = require("../controller/user");
const router = express.Router({ mergeParams: true });
const {saveRedirectUrl} = require("../middlewares");
router 
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signUp);

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl , userController.login);

router
    .route("/logout")
    .get(userController.logout);

module.exports = router;