/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

let nodemailer = require("nodemailer");
var sgTransport = require('nodemailer-sendgrid-transport');
require("dotenv").config();

// module.exports.GmailTransport = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "hsingh@quikieapps.com",
//     pass: "",
//   },
// });

var options = {
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  }
}
module.exports.GmailTransport = nodemailer.createTransport(sgTransport(options));