const { default: mongoose } = require("mongoose");
const path = require("path");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));

module.exports = {
  // generic error handler for async functions
  catchAsync: (func) => {
    return (req, res, next) => {
      func(req, res, next).catch((e) => next(e));
    };
  },
  checkCampgroundExists: async (req, res, next) => {
    if (mongoose.isValidObjectId(req.params.id)) {
      const targetedCamp = await Campground.findById(req.params.id);
      if (targetedCamp == null) {
        req.flash("error", "Campground doesn't exist");
        res.redirect("/campground/");
      } else next();
    } else {
      req.flash("error", "Campground Id not valid");
      res.redirect("/campground/");
    }
  },
  isCampAuthor: async (req, res, next) => {
    const targetedCamp = await Campground.findById(req.params.id);
    if (targetedCamp.author.equals(req.user._id)) {
      next();
    } else {
      req.flash("error", "Unauthorized");
      res.redirect(`/campground/view/${req.params.id}`);
    }
  },
  isReviewAuthor: async (req, res, next) => {
    const { id } = req.body.review;
    const targetedReview = await Review.findById(id);
    if (req.user._id && req.user._id.equals(targetedReview.author)) {
      next();
    } else {
      req.flash("error", "Unauthorized");
      res.redirect(`/campground/view/${req.params.id}`);
    }
  },
  checkLogin: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "You must be signed in");
      res.redirect("/login");
    } else {
      next();
    }
  },
};
