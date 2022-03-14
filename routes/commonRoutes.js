const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const shared=require('../controllers/shared');
const { uploadUtil } = require("../utils/helpers");
const {}=require('../middlewares/accessTokenMiddleware');
const accessTokenMiddleware = require("../middlewares/accessTokenMiddleware");
const unauthorizedMiddleware=require('../middlewares/unauthorizedMiddleware')

router.post('/uploads/pdf',accessTokenMiddleware,unauthorizedMiddleware,check('attachments').if(body('attachments').exists()).notEmpty().withMessage("Please enter pdf files files"),uploadUtil.array("attachments"),shared.uploadsController.uploadPdfController);
router.get('/uploads/pdf',accessTokenMiddleware,unauthorizedMiddleware,shared.uploadsController.getPdfController)

module.exports=router;