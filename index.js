const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");

const router = express.Router();

const campgroundRouter = require(path.join(__dirname, "./router/campground"));

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// db url
const url = "mongodb://localhost:27017/yelpCamp";

// connection to db
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
// route handler
app.use("/campground", campgroundRouter);

app.get("/", (req, res, next) => {
  res.redirect("/campground");
});
//  not found route handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Not found", 404));
});
// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Unexpected error" } = err;
  res.status(statusCode).send(message);
});
app.listen(5000, () => {
  console.log("app listened");
});
