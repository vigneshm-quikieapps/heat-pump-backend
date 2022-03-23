/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require('express');
const {check, body } = require('express-validator');
const m = require('stream-meter');
const router = express.Router();
const auth = require('../controllers/auth/authController');
const {resetTokenMiddleware, otpTokenMiddleware,confirmPasswordMiddleware}=require('../middlewares');
const {authValidations}=require('../validations');

router.post('/register',authValidations.REGISTER , auth.postRegisterUser);
router.post('/login',authValidations.LOGIN,auth.postLoginUser);
router.post('/forgot-password',[check('email').isEmail().normalizeEmail().withMessage('Please enter valid Email Address')],auth.sendMail)
router.post('/verify-otp',otpTokenMiddleware,[check('email').isEmail().normalizeEmail().withMessage('Please enter valid Email Address'),check('otp').isLength({min:4,max:4}).withMessage('Please enter 4 digit OTP ')],auth.postVerifyOtp)
router.post('/change-password',resetTokenMiddleware,confirmPasswordMiddleware,auth.changePassword)

module.exports = router;