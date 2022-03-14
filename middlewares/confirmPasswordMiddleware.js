
 var express = require('express');
 var router = express.Router();

router.use((req,res,next)=>{
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

})

module.exports=router;