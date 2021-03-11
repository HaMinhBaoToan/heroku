var nodemailer = require("nodemailer");

const sendMail = (to, OTP) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thcskhtn16ck4@gmail.com",
      pass: "123456789ta",
    },
  });

  var mailOptions = {
    from: "thcskhtn16ck4@gmail.com",
    to: to,
    // 'hmbt9933@gmail.com',
    subject: "Sending Email using Node.js",
    html: `<h1>Welcome</h1><p>This is your OTP!</p><strong>${OTP}</strong>`,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
