const nodemailer = require('nodemailer');
const jade = require('jade');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const generateHTML = (filename, options = {}) => {
  const html = jade.renderFile(`${__dirname}/../views/email/${filename}.jade`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async options => {
  const smtpConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  };
  const transport = nodemailer.createTransport(smtpConfig);
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: options.user.email,
    subject: options.subject,
    html,
    text,
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
