const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const Campground = require(path.join(__dirname, "../models/campground"));
const {
  catchAsync,
  isCampAuthor,

  checkLogin,
} = require(path.join(__dirname, "../utilities/middleware"));
const ExpressError = require(path.join(__dirname, "../utilities/ExpressError"));
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

// get the add camp form
router.get("/addCamp", checkLogin, (req, res) => {
  res.render("campground/addCamp");
});
// get the camp´s edit form
router.get(
  "/edit/:id",
  checkLogin,
  isCampAuthor,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campground/editCamp", { camp });
  })
);
// delete a camp
router.post(
  "/delete/:id",
  checkLogin,
  isCampAuthor,
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campground");
  })
);

// update a camp
router.post(
  "/update/:id",
  checkLogin,
  isCampAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect("/campground/");
  })
);

// add a new camp and save in the db
router.post(
  "/",
  checkLogin,
  validateCampground,
  catchAsync(async (req, res, next) => {
    //const { title, price, description, location, image } = req.body;
    const { campground } = req.body;
    campground.author = req.user._id;
    new Campground(campground)
      .save()
      .then((data) => {
        req.flash("success", "Campground added successfully");
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
    if (mongoose.isValidObjectId(req.params.id)) {
      Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author")
        .then((data) => {
          camp = data;
          res.render("campground/viewCamp", { camp });
        })
        .catch((err) => {
          res.write("Error: " + err);
        });
    } else {
      req.flash(req, "error", "Campground doesn't exist");
      res.redirect("/campground/");
    }
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
