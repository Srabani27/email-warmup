const nodemailer = require('nodemailer');

function createTransporter(account, host) {
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user: account.email, pass: account.password },
  });
}

module.exports = { createTransporter };
