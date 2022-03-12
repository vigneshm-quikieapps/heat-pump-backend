const multer = require("multer");
const fs = require("fs");
const express = require("express");
const { check, body } = require("express-validator");
const m = require("stream-meter");


const router = express.Router();

const shared=require('../controllers/shared');

var REPONSE="OK"
const fileFilter = (req,file, cb) => {
  console.log(file);
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    return cb("Please enter valid PDF Files ",false);
    cb(null, false);
  }
};
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".pdf");
  },
});
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/uploads",check('attachments').if(body('company').exists()).notEmpty().withMessage("Please enter pdf files files"),upload.array("attachments"),shared.uploadsController.uploadPdfController);

module.exports = router;
