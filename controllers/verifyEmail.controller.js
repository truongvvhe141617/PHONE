const session = require("express-session");
const User = require("../moders/user.model");
const sendMail = require("../send_mail/sendMail");

exports.get = async function (req, res) {
  const email = req.query.email;
  let code = Math.floor(1000 + Math.random() * 9000);
  console.log(code);
  session.codeVerifyEmail = code;
  sendMail.sendMailVerify(email, code);
  res.render("verifyEmail", {
    layout: false,
    email: email,
  });
};

exports.post = async function (req, res) {
  let email = req.body.email;
  let dataRow = await User.getUserByEmail(email);
  let user = dataRow[0];
  let codeOTP = req.body.codeOTP;
  let codeVerifyEmail = session.codeVerifyEmail;
  if (codeOTP.toString() === codeVerifyEmail.toString()) {
    session.userSession = user;
    res.redirect("order");
  } else {
    res.render("verifyEmail", {
      layout: false,
      email: email,
      message: "* Mã xác nhận không đúng, vui lòng thử lại.",
    });
  }
};
