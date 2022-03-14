
 var express = require('express');
 var router = express.Router();
 var jwt = require('jsonwebtoken');


router.use((req,res,next)=>{
    if(req.isAuth===false){
      res.json({
        success:false,
        data:{
          message:"Unauthorized"
        }
      })
    }else
    next()
  })


  module.exports=router;