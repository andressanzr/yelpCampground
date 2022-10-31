const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");

const router = express.Router();

const campgroundRouter = require(path.join(__dirname, "./router/campground"));
const Campground = require("./models/campground");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const url = "mongodb://localhost:27017/yelpCamp";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/campground", campgroundRouter);

app.listen(5000, () => {
  console.log("app listened");
});
