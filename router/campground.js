const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const Campground = require(path.join(__dirname, "../models/campground"));
const router = express.Router();

// get the add camp form
router.get("/addCamp", (req, res) => {
  res.render("campground/addCamp");
});
router.get("/edit/:id", async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campground/editCamp", { camp });
});
router.get("/delete/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campground/");
});
// get all camps
router.get("/", async (req, res) => {
  const camps = await Campground.find();
  res.render("campground/index", { camps });
});
router.post("/update", async (req, res) => {
  const { title, price, description, location, campId } = req.body;
  await Campground.findByIdAndUpdate(campId, {
    title,
    price,
    description,
    location,
  });
  res.redirect("/campground/");
});
// add a new camp and save in the db
router.post("/", async (req, res) => {
  const { title, price, description, location } = req.body;
  new Campground({ title, price, description, location })
    .save()
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("campground/addCampOk");
});
// get an specific camp
router.get("/:id", async (req, res) => {
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
});

module.exports = router;
