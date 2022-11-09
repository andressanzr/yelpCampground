const express = require("express");
const path = require("path");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require(path.join(__dirname, "../models/user"));

const { catchAsync } = require(path.join(__dirname, "../utilities/middleware"));

router.get("/register", (req, res, next) => {
  res.render("user/register");
});
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body.user;
      const userNew = new User({ email, username });
      const registeredUser = await User.register(userNew, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp " + registeredUser.username);
        res.redirect("/campground");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);
router.get("/login", (req, res, next) => {
  res.render("user/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res, next) => {
    req.flash("success", "Welcome back to Yelp ");
    res.redirect("/");
  }
);
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    console.log(err);
    req.flash("success", "Loged out");
    res.redirect("/campground");
  });
});
module.exports = router;
