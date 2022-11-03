const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Joi = require("joi");
const Campground = require(path.join(__dirname, "../models/campground"));
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const CampgroundJoiSchema = require("../schemas/schemas");
const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = CampgroundJoiSchema.validate(req.body);
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
router.get(
  "/delete/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campground/");
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
// update a camp
router.post(
  "/update",
  validateCampground,
  catchAsync(async (req, res) => {
    const { title, price, description, location, image, campId } = req.body;
    await Campground.findByIdAndUpdate(campId, {
      title,
      price,
      description,
      location,
      image,
    });
    res.redirect("/campground/");
  })
);
// add a new camp and save in the db
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { title, price, description, location, image } = req.body;
    new Campground({ title, price, description, location, image })
      .save()
      .then((data) => {
        console.log(data);
        res.redirect(`campground/${data._id}`);
      })
      .catch((err) => {
        console.log(err);
        throw new ExpressError("camp data is wrong", 400);
      });
  })
);
// get an specific camp
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    let camp;
    mongoose.isValidObjectId(req.params.id)
      ? Campground.findById(req.params.id)
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
