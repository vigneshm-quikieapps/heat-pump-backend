const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();
const ServiceRequestsController=require('../controllers/service-requests/serviceRequestsController');
const ServiceRequestModel = require('../models/service-request.model');
// 
const usersModel = require('../models/users.model');
router.post('/service-requests',
[
    body('priority').isInt({min:1,max:3}).withMessage('Please enter valid priority in range [1-4]'),
    body('title').notEmpty().withMessage('Please Enter title of service request'),
    check('attachments').if(body('attachments').exists()).notEmpty().withMessage("Please enter pdf files files")
]
,ServiceRequestsController.postServiceRequest)

router.get('/service-requests',[  
      check(['perPage','page']).isInt().withMessage('Please enter valid Number')], 
      check(['status']).notEmpty().withMessage('Please enter valid status '),
      ServiceRequestsController.getAllServiceRequests)


router.patch('/service-requests/:id',

body('attachments').notEmpty().withMessage("Please don't pass attachaments here pass uattachments"),[

],async (req,res,next)=>{
    const {id}=req.params;
    console.log(id);
    const updateObj=req.body;
    try{
     const response=await ServiceRequestModel.findByIdAndUpdate(id,updateObj);
    let newObj=Object.assign(response);
    
        
       if(response){
           res.json({
               success:true,
               data:{
                   message:"updated",
                //    data:newObj
               }
           })
       }else 
       res.json({
           success:false,
           data:{
               message:"Invalid ID"
           }
       })
    }
    catch(err){
        res.json({
            success:false,
            data:{
                message:err.toString()
            }
        })
    }
    
})

router.get('/service-requests/:id',async (req,res,next)=>{
    const {id}=req.params;
    console.log("ID",id)
    try{

    
    const foundRecord=await ServiceRequestModel.findById(id);

    if(foundRecord){
        res.json({
            success:true,
            data:foundRecord
        })
    }else{
        res.json({
            success:false,
            data:{
                message:"Not found"
            }
        })
    }
}
catch(e){
    res.json({
        success:false,
        data:{
            message:"Invalid ID"
        }
    })
}

})


router.get('/service-requests-status',ServiceRequestsController.getServiceRequestsStatus)

// router.use()

module.exports=router;