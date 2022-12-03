const path = require("path");
const mongoose = require("mongoose");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));
module.exports = {
  add: async (req, res, next) => {
    const id = req.params.id;
    const { review } = req.body;
    const camp = await Campground.findById(id);
    review.body = encodeURI(review.body.trim());
    const rev = new Review(review);
    rev.author = req.user._id;
    camp.reviews.push(rev);
    await camp.save();
    await rev.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/campground/view/${camp._id}`);
  },
  delete: async (req, res, next) => {
    const idCamp = req.params.id;
    const { id } = req.body.review;
    const idReview = mongoose.Types.ObjectId.createFromHexString(id);
    await Campground.findByIdAndUpdate(idCamp, {
      $pull: { reviews: idReview },
    });
    await Review.findOneAndDelete(idReview);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/campground/view/${idCamp}`);
  },
};
