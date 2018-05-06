const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'zimbra',
  auth: {
    // user: 'muzihuohuohuo@126.com',
    // pass: '19931117',
    user: 'liyan@p1.com',
    pass: '19931117Li',
  },
});
module.exports = function sendEmail(to, subject, message) {
  const mailOptions = {
    from: 'liyan@p1.com',
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
