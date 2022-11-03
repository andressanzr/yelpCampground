const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
  location: { type: String, required: true },
  image: String,
});

module.exports = mongoose.model("Campground", CampgroundSchema);
