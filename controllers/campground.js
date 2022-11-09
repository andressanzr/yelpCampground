const path = require("path");
const mongoose = require("mongoose");

const Campground = require(path.join(__dirname, "../models/campground"));
module.exports = {
  index: async (req, res) => {
    const camps = await Campground.find();
    res.render("campground/index", { camps });
  },
  edit: async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("campground/editCamp", { camp });
  },
  delete: async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted successfully");
    res.redirect("/campground");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const updatedCamp = await Campground.findByIdAndUpdate(
      id,
      req.body.campground
    );
    const files = req.files.map((e) => ({ url: e.path, filename: e.filename }));
    updatedCamp.images.push(...files);
    await updatedCamp.save();
    req.flash("success", "Campground updated successfully");
    res.redirect("/campground/");
  },
  add: async (req, res, next) => {
    const { campground } = req.body;
    campground.author = req.user._id;
    const files = req.files.map((e) => ({ url: e.path, filename: e.filename }));
    campground.images = files;
    new Campground(campground)
      .save()
      .then((data) => {
        console.log(data);
        req.flash("success", "Campground added successfully");
        res.redirect(`campground/view/${data._id}`);
      })
      .catch((err) => {
        console.log(err);
        throw new ExpressError("camp data is wrong", 400);
      });
  },
  view: async (req, res) => {
    if (mongoose.isValidObjectId(req.params.id)) {
      Campground.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author")
        .then((camp) => {
          console.log(camp);
          res.render("campground/viewCamp", { camp });
        })
        .catch((err) => {
          res.write("Error: " + err);
        });
    } else {
      req.flash("error", "Campground doesn't exist");
      res.redirect("/campground/");
    }
  },
  removeImage: async (req, res) => {
    Campground.findByIdAndUpdate(req.params.campId, {
      $pull: { images: { _id: req.params.imgId } },
    })
      .then((data) => {
        req.flash("success", "Image removed successfully");
        res.redirect("/campground/edit/" + req.params.campId);
      })
      .catch((err) => console.log("err " + err));
  },
};
