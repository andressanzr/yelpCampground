const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  image: String,
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
