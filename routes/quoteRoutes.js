/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const quoteController = require("../controllers/quote/quoteController");

router.patch("/quote", quoteController.patchQuote);
router.post("/quote", quoteController.createQuote);
router.get('/quote',quoteController.getQuote);
router.get('/all-quote',quoteController.getAllQuote);


module.exports = router;
