const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
   service: '126',
  // host: 'smtp.abc.cu',
  // port: 25,
  // secure: false, // use TLS
  auth: {
    user: '',
    pass: '',
  },
});
module.exports = function sendEmail(subject, message) {
  const mailOptions = {
    from: 'liyan@p1.com',
    to:'liyan@p1.com',
    subject,
    html: message,
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
};
