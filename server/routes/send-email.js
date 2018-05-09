const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
   service: '163',
  // host: 'smtp.p1.com',
  // port: 465,
  // secure: false, // use TLS
  auth: {
    user: '13261707672@163.com',
    pass: 'xiaoniao1125',
  },

});
module.exports = function sendEmail(subject, message) {
  const mailOptions = {
    from: '13261707672@163.com',
    to:'liyan@p1.com, wuzuxiang@p1.com',
    subject,
    html: message,
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
};
