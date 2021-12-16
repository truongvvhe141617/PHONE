var nodemailer = require("nodemailer");

exports.sendMailVerify = function (email, code) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "truongvvhe141617@gmail.com", // generated ethereal user
      pass: "vuongtruong2kk1", // generated ethereal password
    },
  });

  var mailOptions = {
    from: "truongvvhe141617@gmail.com",
    to: email,
    subject: "Shop Phone - Xác thực Email Của Bạn",
    text:
      code +
      " là mã xác nhận dùng để đăng nhập lịch sử mua hàng của bạn tại thegioididong.com !",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
