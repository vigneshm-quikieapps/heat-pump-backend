/** Siddharth Kumar Yadav
 * © All rights reserved
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { getJwtToken } = require("../../utils/helper");

const User = require("../../models/users.model");

exports.postRegisterUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
    mobile,
    admin = false,
    business_registered_name,
    business_trade_name,
    business_type,
    address_1,
    address_2,
    country,
    city,
    postcode,
  } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      message: "User already exists with the provided email address",
    });

  console.log(req.body);

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
        console.log(hashedPassword);
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        mobile: mobile,
        business_registered_name: business_registered_name,
        business_trade_name: business_trade_name,
        business_type: business_type,
        address_1: address_1,
        address_2: address_2,
        country: country,
        city: city,
        postcode: postcode,
        admin: admin,
      });

      user.save();
    })
    .then((resp) => {
      res
        .status(201)
        .json({
          name: name,
          email: email,
          password: null,
          mobile: mobile,
          business_registered_name: business_regxistered_name,
          business_trade_name: business_trade_name,
          business_type: business_type,
          address_1: address_1,
          address_2: address_2,
          country: country,
          city: city,
          postcode: postcode,
        });
    })
    .catch((err) => {
      res.status(503);
      return next(err);
    });
};

exports.postLoginUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const { email, password } = req.body;

  let userTobeLogin;

  User.findOne({ email: email })
    .then((user) => {
      if (user !== null) {
        userTobeLogin = user;
        return bcrypt.compare(password, user.password);
      } else {
        errors.email = "User not found";
        res.status.json({ errors });
      }
    })
    .then((result) => {
    

      const token = getJwtToken({
        id: userTobeLogin._id.toString(),
        name: userTobeLogin.name,
        email: userTobeLogin.email,
      });

      if (result) {
        res.json({
          name: userTobeLogin.name,
          email: userTobeLogin.email,
          token: token,
        });
      } else {
        res.json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      res.json({ message: "User Not Found" });
    });
};




exports.postVerifyOtp=(req,res,next)=>{

  const {email,otp}=req.body;
  
  if(email!==req.decodedOTPToken.email){
      throw new Error("OTP was not generated for supplied email address")
  }




  User.findOne({email:email})
  .then((user)=>{
   
    if(user!==null){
          if(user.reset_otp===otp){
              const resetToken=getJwtToken({email:email},"10m");
              res.json({
                  message:"verified",
                  reset_token:resetToken
              })
          }else
      res.json({
         message:"Wrong OTP"
      })
      
    }else{
      res.json({
          message:"User Not Found"
      })
    }

  })
  .catch(e=>{
      res.json({
          message:"Internal Servor Erorr"
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