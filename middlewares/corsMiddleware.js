/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 var express = require('express');
 var router = express.Router();
 var jwt = require('jsonwebtoken');


router.use((req,res,next)=>{ //cors browser security mechansim unlinke postman
    res.header("Access-Control-Allow-Origin","*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==='OPTIONS'){ //you can't avoid to check 
      res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
      return res.status(200).json({});
    }
    next();
  })

module.exports=router;