const path = require("path");
const mongoose = require("mongoose");
const express = require("express");

const reviewController = require(path.join(__dirname, "../controllers/review"));

const { ReviewJoiSchema } = require("../schemas/schemas");

const { catchAsync, isReviewAuthor, checkLogin } = require(path.join(
  __dirname,
  "../utilities/middleware"
));

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
router.post("/", checkLogin, validateReview, catchAsync(reviewController.add));
// delete a review from a camp
router.post(
  "/delete",
  checkLogin,
  isReviewAuthor,
  catchAsync(reviewController.delete)
);
// error handler
router.use((err, req, res, next) => {
  const { statusCode = 500, message = "Unexpected error" } = err;
  res.status(statusCode).render("error", { err });
});

module.exports = router;
