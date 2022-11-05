const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Joi = require("joi");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { CampgroundJoiSchema, ReviewJoiSchema } = require("../schemas/schemas");

const router = express.Router();

const validateCampground = (req, res, next) => {
  console.log(req.body);
  const { error } = CampgroundJoiSchema.validate(req.body);
  if (error) {
    var msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = ReviewJoiSchema.validate(req.body);
  if (error) {
    var msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// get the add camp form
router.get("/addCamp", (req, res) => {
  res.render("campground/addCamp");
});
// get the camp´s edit form
router.get(
  "/edit/:id",
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campground/editCamp", { camp });
  })
);
// delete a camp
router.post(
  "/delete/:id",
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campground");
  })
);

// update a camp
router.post(
  "/:id/update",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect("/campground/");
  })
);
// add a review to a camp
router.post(
  "/:id/review",
  validateReview,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const { review } = req.body;
    const camp = await Campground.findById(id);
    const rev = new Review(review);
    camp.reviews.push(rev);
    await camp.save();
    await rev.save();
    res.redirect(`/campground/view/${camp._id}`);
  })
);
// add a review to a camp
router.post(
  "/:id/review/delete",
  catchAsync(async (req, res, next) => {
    const idCamp = req.params.id;
    const { id } = req.body.review;
    const idReview = mongoose.Types.ObjectId.createFromHexString(id);
    await Campground.findByIdAndUpdate(idCamp, {
      $pull: { reviews: idReview },
    });
    await Review.findOneAndDelete(idReview);
    res.redirect(`/campground/view/${idCamp}`);
  })
);
// add a new camp and save in the db
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    //const { title, price, description, location, image } = req.body;
    const { campground } = req.body;
    new Campground(campground)
      .save()
      .then((data) => {
        console.log(data);
        res.redirect(`campground/view/${data._id}`);
      })
      .catch((err) => {
        console.log(err);
        throw new ExpressError("camp data is wrong", 400);
      });
  })
);
// get an specific camp
router.get(
  "/view/:id",
  catchAsync(async (req, res) => {
    let camp;
    mongoose.isValidObjectId(req.params.id)
      ? Campground.findById(req.params.id)
          .populate("reviews")
          .then((data) => {
            camp = data;
            res.render("campground/viewCamp", { camp });
          })
          .catch((err) => {
            res.write("Error: " + err);
          })
      : res.redirect("/campground/");
  })
);
// get all camps
router.get(
  "/",
  catchAsync(async (req, res) => {
    const camps = await Campground.find();
    res.render("campground/index", { camps });
  })
);
// not found route handler
router.all("*", (req, res, next) => {
  next(new ExpressError("Not found", 404));
});
// error handler
router.use((err, req, res, next) => {
  const { statusCode = 500, message = "Unexpected error" } = err;
  res.render("error", { err });
});

module.exports = router;
