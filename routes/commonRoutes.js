const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const shared=require('../controllers/shared');
const { uploadUtil } = require("../utils/helpers");

router.post('/uploads/pdf',check('attachments').if(body('attachments').exists()).notEmpty().withMessage("Please enter pdf files files"),uploadUtil.array("attachments"),shared.uploadsController.uploadPdfController);
router.get('/uploads/pdf',shared.uploadsController.getPdfController)

module.exports=router;