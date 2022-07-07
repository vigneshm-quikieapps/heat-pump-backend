/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const { getJwtToken } = require("../../utils/helpers");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const { constants } = require("../../utils");
const UserModel = require("../../models/users.model");
const { GmailTransport } = require("../../config/mail");

exports.postRegisterUser = async (req, res, next) => {
  var {
    name,
    email,
    password,
    mobile,
    admin = false,
    business_registered_name,
    business_trade_name,
    business_type,
    address_1,
    address_2,
    country,
    city,
    postcode,
    status = 1,
    business_admin = false,
  } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  let user = await UserModel.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      success: false,
      data: {
        message: constants.USER_ALREADY_EXISTS,
      },
    });

  console.log(business_admin);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      console.log(hashedPassword);
      const user = new UserModel({
        name: name,
        email: email,
        password: hashedPassword,
        mobile: mobile,
        business_registered_name: business_registered_name,
        business_trade_name: business_trade_name,
        business_type: business_type,
        address_1: address_1,
        address_2: address_2,
        country: country,
        city: city,
        postcode: postcode,
        admin: admin,
        business_admin: business_admin,
        status: status,
      });
      user.save();
    })
    .then((resp) => {
      res.status(201).json({
        sucess: true,
        data: {
          name: name,
          email: email,
          password: null,
          mobile: mobile,
          business_registered_name: business_registered_name,
          business_trade_name: business_trade_name,
          business_type: business_type,
          address_1: address_1,
          address_2: address_2,
          country: country,
          city: city,
          postcode: postcode,
          status: status,
          admin: admin,
          business_admin: business_admin,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(503);
      return next(err);
    });
};

exports.postLoginUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const { email, password } = req.body;

  let userTobeLogin;

  console.log(email, password);

  UserModel.findOne({ email: email })
    .select([
      "name",
      "email",
      "admin",
      "status",
      "password",
      "business_trade_name",
      "city",
      "business_admin",
    ])
    .then((user) => {
      if (user !== null && user.status === 3) {
        userTobeLogin = user;
        return bcrypt.compare(password, user.password);
      } else {
        console.log(user);
        throw new Error(constants.USER_NOT_FOUND);
      }
    })
    .then((result) => {
      console.log(userTobeLogin);
      const token = getJwtToken({
        id: userTobeLogin._id.toString(),
        name: userTobeLogin.name,
        email: userTobeLogin.email,
        admin: userTobeLogin.admin,
        business_admin: userTobeLogin.business_admin,
      });

      if (result) {
        res.json({
          sucess: true,
          data: {
            id: userTobeLogin._id.toString(),
            name: userTobeLogin.name,
            email: userTobeLogin.email,
            business_trade_name: userTobeLogin.business_trade_name,
            city: userTobeLogin.city,
            admin: userTobeLogin.admin,
            business_admin: userTobeLogin.business_admin,
            token: token,
          },
        });
      } else {
        res.json({
          success: false,
          data: {
            message: constants.INVALID_CREDENTIALS,
          },
        });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        data: {
          message: err.toString(),
        },
      });
    });
};

exports.sendMail = (req, res, next) => {
  const { email } = req.body;
  var otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const KEY = process.env.SENDGRID_API_KEY;
  var isEmailInDb = false;
  console.log(email);
  UserModel.findOne({ email: email })
    .then((us) => {
      console.log(us);
      if (us !== null) {
        isEmailInDb = true;
      }

      if (true) {
        UserModel.findOneAndUpdate({ email: email }, { reset_otp: otp }).catch(
          (err) => console.log(err)
        );

        // sgMail.setApiKey(KEY);

        const msg = {
          to: email, // Change to your recipient
          from: '"Heat-Pump Support" hello@ismartapps.co.uk', // Change to your verified sender //info@heatpumpdesigner.com
          subject: "Password Reset",
          html: `<strong>Your OTP is ${otp}</strong>`,
        };

        const otp_token = getJwtToken(
          {
            email: email,
          },
          "10m"
        );

        console.log(otp_token);

        GmailTransport.sendMail(msg)
          .then((r) => {
            console.log(r);
            res.json({
              success: true,
              data: {
                message: constants.EMAIL_SENT,
                otp_token: otp_token,
                // otp_not_to_display: otp,
              },
            });
          })
          .catch((err) => {
            res.json({
              success: false,
              data: {
                message: err.toString(),
              },
            });
          });

        /*
      
        sgMail
          .send(msg)
          .then((r) => {
            console.log(r);
            res.json({
              success: true,
              data: {
                message: constants.EMAIL_SENT,
                otp_token: otp_token,
                otp_not_to_display: otp,
              },
            });
          })
          .catch((err) => {
            res.json({
              success: false,
              data: {
                message: err.toString(),
              },
            });
          });
      } else {
        res.json({
          success: false,
          data: {
            messsage: constants.USER_NOT_FOUND,
          },
        });
      */
      } else {
        res.json({
          success: false,
          data: {
            message: constants.USER_NOT_FOUND,
          },
        });
      }
    })
    .catch((e) => {
      res.json({
        success: false,
        data: {
          message: e.toString(),
        },
      });
    });
};

exports.postVerifyOtp = (req, res, next) => {
  const { email, otp } = req.body;

  if (email !== req.decodedOTPToken.email) {
    throw new Error("OTP was not generated for supplied email address");
  }

  UserModel.findOne({ email: email })
    .then((user) => {
      if (user !== null) {
        if (user.reset_otp === otp) {
          const resetToken = getJwtToken({ email: email }, "10m");
          res.json({
            success: true,
            data: {
              message: "verified",
              reset_token: resetToken,
            },
          });
        } else
          res.json({
            success: false,
            data: {
              message: "Wrong OTP",
            },
          });
      } else {
        res.json({
          success: false,
          data: {
            message: constants.USER_NOT_FOUND,
          },
        });
      }
    })
    .catch((e) => {
      res.json({
        success: false,
        data: {
          message: e.toString(),
        },
      });
    });
};

exports.changePassword = (req, res, next) => {
  const { new_password, confirm_new_password } = req.body;

  var { email } = req.decodedResetToken;

  if (new_password !== confirm_new_password) {
    res.json({
      success: false,
      data: {
        message: "Please confirm the Password",
      },
    });
  }

  bcrypt
    .hash(new_password, 12)
    .then(async (hashedPassword) => {
      const ok = await UserModel.findOneAndUpdate(
        { email: email },
        { password: hashedPassword }
      );
    })
    .then((r) => {
      res.json({
        success: true,
        data: {
          message: constants.PASSWORD_CHANGED,
        },
      });
    })
    .catch((err) => {
      res.status(503);
      return next(err);
    });
};
