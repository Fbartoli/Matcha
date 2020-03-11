const nodemailer = require('nodemailer');
const CONFIG = require('../config/config');

const sendmail = async function (mailto, mailsubject, mailtext, mailhtml) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.email_user,
      pass: CONFIG.email_pass
    }
  });
  await transporter.sendMail({
    from: '"MATCHA <Matcha@ethereal.email>',
    to: mailto,
    subject: mailsubject,
    text: mailtext,
    html: mailhtml,
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = sendmail;
