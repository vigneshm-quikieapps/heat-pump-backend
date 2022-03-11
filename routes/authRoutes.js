const express = require('express');
const { check, body } = require('express-validator');
const m = require('stream-meter');
const router = express.Router();
const auth = require('../controllers/auth/authController');


router.post('/register', [check('email').isEmail().normalizeEmail().withMessage('Please Enter valid Email'),
check('name').isLength({ min: 2 }).withMessage("Please Enter valid Name"),
check('password').isLength({min:5}).withMessage("Please Enter password of lenght atleast 5"),
check('mobile').isLength({min:10}).withMessage("Please Enter Phone Number")
], auth.postRegisterUser);

router.post('/login',
[check('email').isEmail().normalizeEmail().withMessage('Please Enter valid Email'),
check('password').isLength({min:5}).withMessage("Please Enter password of length atleast 5")
],auth.postLoginUser);

module.exports = router;