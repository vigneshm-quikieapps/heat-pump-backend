const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const shared = require("../controllers/shared");
const { uploadUtil } = require("../utils/helpers");
/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const accessTokenMiddleware = require("../middlewares/accessTokenMiddleware");
const unauthorizedMiddleware = require("../middlewares/unauthorizedMiddleware");

router.post(
  "/uploads/documents",
  accessTokenMiddleware,
  unauthorizedMiddleware,
  check("attachments")
    .if(body("attachments").exists())
    .notEmpty()
    .withMessage("Please enter pdf files files"),
  uploadUtil.array("attachments"),
  shared.uploadsController.uploadDocController
);
router.get(
  "/uploads/documents",
  accessTokenMiddleware,
  unauthorizedMiddleware,
  shared.uploadsController.getDocController
);

module.exports = router;
