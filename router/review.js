const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const flash = require("connect-flash");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));

const { ReviewJoiSchema } = require("../schemas/schemas");

const flashMsgWriter = require("../utilities/flashMsgWriter");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  const { error } = ReviewJoiSchema.validate(req.body);
  if (error) {
    var msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// add a review to a camp
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { review } = req.body;
    const camp = await Campground.findById(id);
    const rev = new Review(review);
    camp.reviews.push(rev);
    await camp.save();
    await rev.save();
    flashMsgWriter(req, "success", "Review added successfully");
    res.redirect(`/campground/view/${camp._id}`);
  })
);
// delete a review from a camp
router.post(
  "/delete",
  catchAsync(async (req, res, next) => {
    const idCamp = req.params.id;
    const { id } = req.body.review;
    const idReview = mongoose.Types.ObjectId.createFromHexString(id);
    await Campground.findByIdAndUpdate(idCamp, {
      $pull: { reviews: idReview },
    });
    await Review.findOneAndDelete(idReview);
    flashMsgWriter(req, "success", "Review deleted successfully");
    res.redirect(`/campground/view/${idCamp}`);
  })
);

module.exports = router;
