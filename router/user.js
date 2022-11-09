const express = require("express");
const path = require("path");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const User = require(path.join(__dirname, "../models/user"));

const userController = require(path.join(__dirname, "../controllers/user"));

const { catchAsync } = require(path.join(__dirname, "../utilities/middleware"));

router
  .route("/register")
  .get((req, res, next) => {
    res.render("user/register");
  })
  .post(catchAsync(userController.register));

router
  .route("/login")
  .get((req, res, next) => {
    res.render("user/login");
  })
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );
router.get("/logout", userController.logout);
module.exports = router;
