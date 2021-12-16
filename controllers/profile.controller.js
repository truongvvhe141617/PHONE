const session = require("express-session");
const User = require("../moders/user.model");

exports.profile = async function (req, res) {
  let userSession = session.userSession || null;
  res.render("profile", {
    layout: false,
    userSession: userSession,
  });
};

exports.update = async function (req, res) {
  let user = req.body;
  await User.update(user);
  session.userSession = user;
  res.redirect("profile");
};
