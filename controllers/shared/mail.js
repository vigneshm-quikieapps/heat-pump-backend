const express=require('express');
const app=express();
const sgMail = require('@sendgrid/mail')
const otpGenerator = require('otp-generator')
const bcrypt = require("bcrypt");
const User = require("../../models/users.model");
const constants=require('../../utils/constants')
const { getJwtToken } = require("../../utils/helper");




exports.sendMail=(req,res,next)=>{
    
    const {email}=req.body;
    var otp=otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false ,lowerCaseAlphabets:false});
    
    console.log("OTP=>",otp);
    const KEY="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";
    let isEmailInDb=false;

    const usr=User.findOne({email:email})
    .then(us=>{
        console.log(us);
        if(us!==null){
            isEmailInDb=true;
        }
    //     console.log(us);
    //    if(!us){
    //          res.json({
    //             success:false,
    //             data:{
    //                 message:"User Not Found"
    //             }
    //         })
    //     }
        
    })
    .catch(e=>{
        res.json({
            success:false,
            data:{
                message:"Internal server Error"
            }
        })
    })



    console.log("ENTERING",isEmailInDb);
if(isEmailInDb)
{
    User.findOneAndUpdate({email:email},{reset_otp:otp})
    .catch(err=>console.log(err));




    sgMail.setApiKey(KEY)
    const msg = {
        to: email, // Change to your recipient
        from: 'siddharthsk101@gmail.com', // Change to your verified sender
        subject: 'Password Reset',
        html: `<strong>Your OTP is ${otp}</strong>`,
      }

      const otp_token=getJwtToken({
            email:email
      },"10m");

      console.log(otp_token);
     
      sgMail
      .send(msg)
        .then(r=>{
            console.log(r)
            res.json({
                success:true,
                data:{message:"Email has been successfully sent ",
                otp_token:otp_token}
            })
        })
        .catch(err=>{
           console.log(err)
            res.json({
                sucess:false,
                data:{
                    message:`Internal server Error`
                }
            })
            
        })
    }else{
        res.json({
            sucess:false,
            data:{
                messsage:"User Not found"
            }
        })
    }
       

    }


    exports.postVerifyOtp=(req,res,next)=>{

        const {email,otp}=req.body;
        
        if(email!==req.decodedOTPToken.email)
        {
            throw new Error("OTP was not generated for supplied email address")
        }




        User.findOne({email:email})
        .then((user)=>{
         
          if(user!==null){
                if(user.reset_otp===otp){
                    const resetToken=getJwtToken({email:email},"10m");
                    res.json({
                        success:true,
                        data:{message:"verified",
                        reset_token:resetToken}
                    })
                }else
            res.json({
                success:false,
                data:{

                    message:"Wrong OTP"
                }
            })
            
          }else{
            res.json({
                success:false,
                data:{

                    message:"User Not Found"
                }
            })
          }

        })
        .catch(e=>{
            res.json({
                success:false,
                data:{

                    message:"Internal Servor Erorr"
                }
            })
        })
    
    
    
    
    }

    exports.changePassword=(req,res,next)=>{
        const {new_password,confirm_new_password}=req.body;
        // console.log(req.decodedResetToken);

        const email=req.decodedResetToken;

        if(new_password!==confirm_new_password){
            throw Error("Failed")
        }


        bcrypt
            .hash(new_password,12)
            .then((hashedPassword)=>{
                User.findByIdAndUpdate({email:email},{password:new_password})
            })
            .then(r=>{
                res.json({
                    message:constants.PASSWORD_CHANGED
                })
            })
            .catch((err) => {
                res.status(503);
                return next(err);
              });

    }
