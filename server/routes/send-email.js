const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'Mailjet',
  auth: {
    user: '',
    pass: '',
  },
});
module.exports = function sendEmail(to, subject, message) {
  const mailOptions = {
    from: '',
    to,
    subject,
    html: message,
  };
  transport.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    }
  });
};
