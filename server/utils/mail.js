const nodemailer = require('nodemailer');

const sendmail = async function(mailto, mailsubject, mailtext, mailhtml) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'naomie36@ethereal.email',
        pass: 'AdzdUpGZQMhMEqJAhF'
    }
  });
  const info = await transporter.sendMail({
  from: '"MATCHA <naomie36@ethereal.email>',
  to: mailto,
  subject: mailsubject,
  text: mailtext,
  html: mailhtml,
  });
};

module.exports = sendmail;
