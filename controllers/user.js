const path = require("path");

const User = require(path.join(__dirname, "../models/user"));

module.exports = {
  register: async (req, res, next) => {
    try {
      console.log("user: " + User.toString());
      const { username, email, password } = req.body.user;
      console.log(username, email, password);
      const registeredUser = await User.register(
        new User({ email, username }),
        password
      );

      req.login(registeredUser, (err) => {
        if (err) return next(err);
        console.log("toll");
        req.flash("success", "Welcome to Yelp " + registeredUser.username);
        res.redirect("/campground");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  },
  login: (req, res, next) => {
    req.flash("success", "Welcome back to Yelp ");
    res.redirect("/");
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      console.log(err);
      req.flash("success", "Loged out");
      res.redirect("/campground");
    });
  },
};
