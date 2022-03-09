/** Siddharth Kumar Yadav
* © All rights reserved 
*/
const crypto=require('crypto');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User=require('../../models/users.model');
const { save } = require('pdfkit');

exports.postRegisterUser=async (req,res,next)=>{
    const {name,email,password,mobile}=req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: errors.array()
        })
    }


    
    let user = await User.findOne({email: req.body.email});   
    if (user) return res.status(400).send("Already exists");


    
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user=new User({
            name:name,
            email:email,
            password:hashedPassword,
            mobile:mobile
        });
       
        user.save();
    }
    )
    .then(resp=>{
        res.status(201).json({ name:name,email:email,password:null,mobile:mobile,access_token:"123"});   
    })
    .catch(err=>{
        res.status(503);
        return next(err);
    })
}


exports.postLoginUser=(req,res,next)=>{

    const {email,password}=req.body;

    let userTobeLogin;

    User.findOne({email:email})
    .then(user=>{
        if(user!==null){
            userTobeLogin=user;
            return bcrypt.compare(password,user.password)
        }else
       { errors.email = "User not found";
        res.status(404).json({ errors });}
      
    })
    .then(result=>{
        const jwtToken=jwt.sign({
            userId:userTobeLogin._id.toString(),
            email:userTobeLogin.email
        },'sky',{
            expiresIn:"720hr"
        })


        if(result){
            res.json({
                response:"Logged in",
                token:jwtToken,
                name:userTobeLogin.name,
                email:userTobeLogin.email
            })
        }else{
            res.json({response:"Invalid Credentials"})
        }
    })
    .catch(err=>{
        res.json({errorMessage:"User Not Found"})
    })

}



