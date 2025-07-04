
const mongoose = require("mongoose");
const Post = require("../Schema/post");
const User = require("../Schema/user");
const passport = require("passport");
const userJoiSchema = require("../utils/joi");
const ExpressError = require("../utils/expressErr");
const wrapAsync = require("../utils/wrapAsync");

module.exports.renderSignupForm = (req, res) => {
  res.render("signUp.ejs");
}

module.exports.signUp = wrapAsync(async (req, res, next) => {
  const { error } = userJoiSchema.validate(req.body);
  if (error) throw new ExpressError(error.details[0].message, 400);

  const { username, email, password } = req.body;
  const user = new User({ username, email });

  try {
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `${username} logged in successfully`);
      return res.redirect("/posts");
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/signup");
  }
});


module.exports.renderLoginForm =  (req, res) => {
  res.render("login.ejs");
}

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome back, ${user.username}!`);
        return res.redirect("/posts");
      });
    })(req, res, next);
  }

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    console.log("Logged out"); 
    req.flash("success", "Logged out successfully!");
    console.log(req.session);

    res.redirect("/");
  });
}