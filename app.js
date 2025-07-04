require('dotenv').config();
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Post = require("./Schema/post");
const User = require("./Schema/user");

const postRouter = require("./routers/post");
const userRouter = require("./routers/user");

// ==============================================
//            DATABASE CONNECTION
// ==============================================

const DB_URL = process.env.DBUrl;

const store = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter: 24 * 3600,
});

async function connectDB() {
  try {
    await mongoose.connect(DB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (e) {
    console.log("❌ MongoDB connection error:", e);
  }
}

connectDB();

// ==============================================
//          APP & MIDDLEWARE CONFIG
// ==============================================

// Set up EJS and views
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Override methods for PUT/DELETE
app.use(methodOverride("_method"));

// Flash messaging
app.use(flash());

// ==============================================
//              SESSION SETUP
// ==============================================

app.use(session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ==============================================
//              PASSPORT CONFIG
// ==============================================

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
  usernameField: 'username'
}, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass common variables to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ==============================================
//              ROUTES
// ==============================================

// Auth middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "Login to access this feature");
  res.redirect("/login");
}

// Root redirect
app.get("/", (req, res) => {
  res.redirect("/posts");
});

// Main routers
app.use("/posts", postRouter);
app.use("/", userRouter);

// ==============================================
//              ERROR HANDLER
// ==============================================

app.use((err, req, res, next) => {
  const { statuscode = 500 } = err;
  res.status(statuscode).send(`${statuscode}.. ${err}`);
});

// ==============================================
//              SERVER START
// ==============================================

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
