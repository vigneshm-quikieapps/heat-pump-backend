/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

let nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.GmailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "siddharth@quikieapps.com",
    pass: "Lk)G)c2S%FgrFU",
  },
});
