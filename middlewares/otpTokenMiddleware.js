/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var constants = require("../utils/constants");

router.use((req, res, next) => {
  var token =
    req.body.otp_token || req.query.otp_token || req.headers["x-otp-token"];
  if (token) {
    jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          data: { message: constants.IV_OTP_TOKEN },
        });
      } else {
        req.decodedOTPToken = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      data: {
        message: constants.NOT_FOUND_OTP_TOKEN,
      },
    });
  }
});

module.exports = router;
