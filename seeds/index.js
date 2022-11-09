const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));
const User = require(path.join(__dirname, "../models/user"));
const cities = require(path.join(__dirname, "./cities"));
const { descriptors, places } = require(path.join(__dirname, "./seedHelpers"));
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const url = "mongodb://localhost:27017/yelpCamp";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
const randomNum = (max) => {
  return Math.floor(Math.random() * max);
};
const seedDb = async () => {
  await Review.deleteMany();
  await Campground.deleteMany();
  for (let index = 0; index < 50; index++) {
    const randomPlace = places[randomNum(places.length)];
    const randomDescriptor = descriptors[randomNum(descriptors.length)];
    const randomCity = cities[randomNum(1000)];
    const campSave = new Campground({
      title: `${randomDescriptor} ${randomPlace}`,
      price: randomNum(100),
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id, quaerat ducimus quis nam debitis, sequi reiciendis fugiat recusandae sapiente sunt impedit voluptate officiis laborum reprehenderit eius corporis, accusamus at. Dignissimos.",
      location: `${randomCity.city}, ${randomCity.state}`,
      images: [
        {
          url: "https://source.unsplash.com/random/300x300?camping",
          filename: "camping",
        },
      ],
      author: "636a576dc2494bba7dcd6be5",
    });
    campSave.save();
    index == 49 ? console.log("finished inserting") : "";
  }
};

seedDb();
