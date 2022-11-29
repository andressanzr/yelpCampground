const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require(path.join(__dirname, "../models/campground"));
const Review = require(path.join(__dirname, "../models/review"));
const User = require(path.join(__dirname, "../models/user"));
const cities = require(path.join(__dirname, "./cities"));
const { descriptors, places } = require(path.join(__dirname, "./seedHelpers"));
require("dotenv").config();
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
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
  for (let index = 0; index < 350; index++) {
    const randomPlace = places[randomNum(places.length)];
    const randomDescriptor = descriptors[randomNum(descriptors.length)];
    const randomCity = cities[randomNum(1000)];
    const geoData = await geoCoder
      .forwardGeocode({
        query: `${randomCity.city}, ${randomCity.state}`,
        limit: 1,
      })
      .send();
    const campSave = new Campground({
      title: `${randomDescriptor} ${randomPlace}`,
      price: randomNum(100),
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id, quaerat ducimus quis nam debitis, sequi reiciendis fugiat recusandae sapiente sunt impedit voluptate officiis laborum reprehenderit eius corporis, accusamus at. Dignissimos.",
      location: `${randomCity.city}, ${randomCity.state}`,
      geometry: {
        type: "Point",
        coordinates: geoData.body.features[0].geometry.coordinates,
      },
      images: [
        {
          url: "https://res.cloudinary.com/dzqaqrjiq/image/upload/v1669622161/YelpCamp/xhxgrhczslop6tgfxnr3.jpg",
          filename: "camping",
        },
      ],
      author: "636a576dc2494bba7dcd6be5",
    });

    campSave.save();
    index == 349 ? console.log("finished inserting") : "";
  }
};

seedDb();
