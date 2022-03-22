const jwt = require("jsonwebtoken");
const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const shared=require('../controllers/shared');

function getJwtToken(payload = {},expiresIn="12hr") {
  const token = jwt.sign(payload, "secret_key", {
    expiresIn: expiresIn
  });
  return token;
}


const fileFilter = (req,file, cb) => {
  console.log(file);
  if (file.mimetype === "application/pdf" || file.mimetype==="image/png" || file.mimetype==="image/jpeg") {
    cb(null, true);
  } else {
    return cb("Please enter valid PDF/PNG/JPEG Files ",false);
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const extension=file.mimetype.split('/')[1];
    cb(null, file.fieldname + "-" + Date.now() +'.'+extension);
  },
});


const uploadUtil = multer({ storage: storage, fileFilter: fileFilter });
// --------------------------


function reversedNum(num) {
  return (
    parseFloat(
      num
        .toString()
        .split('')
        .reverse()
        .join('')
    ) * Math.sign(num)
  )                 
}



module.exports = { getJwtToken ,uploadUtil,reversedNum};

