module.exports = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body.user;
      const userNew = new User({ email, username });
      const registeredUser = await User.register(userNew, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
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
