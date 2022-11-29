const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  location: { type: String, required: true },
  images: [ImageSchema],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    Review.deleteMany({ _id: doc.reviews });
  }
});

const Campground = mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
