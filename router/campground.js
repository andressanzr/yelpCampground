const express = require("express");
const path = require("path");

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const campController = require(path.join(
  __dirname,
  "../controllers/campground"
));

const {
  catchAsync,
  isCampAuthor,
  checkLogin,
  checkCampgroundExists,
} = require(path.join(__dirname, "../utilities/middleware"));
const ExpressError = require(path.join(__dirname, "../utilities/ExpressError"));
const { CampgroundJoiSchema, ReviewJoiSchema } = require("../schemas/schemas");

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
router.get("/addCamp", checkLogin, (req, res) => {
  res.render("campground/addCamp");
});
// get the camp´s edit form
router.get(
  "/edit/:id",
  checkLogin,
  checkCampgroundExists,
  isCampAuthor,
  catchAsync(campController.edit)
);
// delete a camp
router.post(
  "/delete/:id",
  checkLogin,
  checkCampgroundExists,
  isCampAuthor,
  catchAsync(campController.delete)
);
// delete image from camp
router.post(
  "/removeImg/:campId/:imgId",
  catchAsync(campController.removeImage)
);
// update a camp
router.post(
  "/update/:id",
  checkLogin,
  checkCampgroundExists,
  isCampAuthor,
  upload.array("image"),
  validateCampground,
  catchAsync(campController.update)
);
// get an specific camp
router.get("/view/:id", checkCampgroundExists, catchAsync(campController.view));
// get all camps
router
  .route("/")
  .get(catchAsync(campController.index))
  // add a new camp and save in the db
  .post(
    checkLogin,
    upload.array("image"),
    validateCampground,

    catchAsync(campController.add)
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
