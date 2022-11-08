module.exports = (req, type, msg) => {
  req.flash(type, msg);
};
