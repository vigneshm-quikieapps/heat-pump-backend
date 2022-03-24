const { check, body } = require("express-validator");

const REGISTER = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Enter valid Email"),
  body("name").isLength({ min: 2 }).withMessage("Please Enter valid Name"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Please Enter password of lenght atleast 5"),
  body("mobile").isLength({ min: 10 }).withMessage("Please Enter Phone Number"),
];
const LOGIN = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please Enter valid Email"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Please Enter password of length atleast 5"),
];

module.exports = {
  REGISTER,
  LOGIN,
};
