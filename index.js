if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// package dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const session = require("express-session");
const helmet = require("helmet");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExpressError = require("./utilities/ExpressError");
const mongoSanitize = require("express-mongo-sanitize");

const User = require(path.join(__dirname, "models/user"));

// routes
const campgroundRouter = require(path.join(__dirname, "router/campground"));
const reviewRouter = require(path.join(__dirname, "router/review"));
const userRouter = require(path.join(__dirname, "router/user"));

//secure routes
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

const app = express();
const sessionConfig = {
  secret: "mySecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dzqaqrjiq/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
app.use(flash());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(mongoSanitize());

// passport initialize
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// route handler
app.use("/campground/:id/review", reviewRouter);
app.use("/campground", campgroundRouter);
app.use("/", userRouter);

app.get("/", (req, res, next) => {
  res.render("home");
});
//  not found route handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Not found", 404));
});
// error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Unexpected error" } = err;
  res.status(statusCode).render("error", { err });
});
app.listen(5000, () => {
  console.log("app listening");
});
