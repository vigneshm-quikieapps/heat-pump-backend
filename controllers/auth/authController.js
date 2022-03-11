/** Siddharth Kumar Yadav
 * © All rights reserved
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { getJwtToken } = require("../../utils/helper");

const User = require("../../models/users.model");

exports.postRegisterUser = async (req, res, next) => {
  const {
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
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "User already exists with the provided email address",
    });

  console.log(req.body);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
        console.log(hashedPassword);
      const user = new User({
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
      });

      user.save();
    })
    .then((resp) => {
      res
        .status(201)
        .json({
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
        });
    })
    .catch((err) => {
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

  User.findOne({ email: email })
    .then((user) => {
      if (user !== null) {
        userTobeLogin = user;
        return bcrypt.compare(password, user.password);
      } else {
        errors.email = "User not found";
        res.status(404).json({ errors });
      }
    })
    .then((result) => {
    

      const token = getJwtToken({
        id: userTobeLogin._id.toString(),
        name: userTobeLogin.name,
        email: userTobeLogin.email,
      });

      if (result) {
        res.json({
          name: userTobeLogin.name,
          email: userTobeLogin.email,
          token: token,
        });
      } else {
        res.json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      res.json({ message: "User Not Found" });
    });
};


