const express = require('express');
const { check, body } = require('express-validator');
const sharedRoutes=require('../controllers/shared');
const {resetTokenMiddleware, otpTokenMiddleware}=require('../middlewares');


const router = express.Router();

router.post('/forgot-password',[check('email').isEmail().normalizeEmail().withMessage('Please enter valid Email Address')],sharedRoutes.mailController.sendMail)
router.post('/verify-otp',otpTokenMiddleware,[check('email').isEmail().normalizeEmail().withMessage('Please enter valid Email Address'),check('otp').isLength({min:4,max:4}).withMessage('Please enter 4 digit OTP ')],sharedRoutes.mailController.postVerifyOtp)
router.post('/change-password',resetTokenMiddleware,(req,res,next)=>{
    if(req.body.new_password!==req.body.confirm_new_password){
        res.json({
            errorMessage: [
                {
                        value:req.body.new_password,
                    msg:"Password and Confirmed Password are unequal",
                    param:"new_password",
                    location:"body"
                }
            ]
        })
    }else
    next();

},sharedRoutes.mailController.changePassword)



module.exports=router;