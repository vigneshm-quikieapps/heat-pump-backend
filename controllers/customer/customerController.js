const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { getJwtToken } = require("../../utils/helper");

const ServiceRequest= require("../../models/service-request.model");


exports.postServiceRequest =async(req,res,next)=>{
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }
    const {
        title,
        type,
        description,
        attachments,
        priority,
        job_reference_id=null
    }=req.body;

   const sr=new ServiceRequest({
    title:title,
        type:type,
        description:description,
        attachments:attachments,
        priority:priority,
        job_reference_id:job_reference_id
   });

  await sr.save();

  res.json({
      success:true,
      data:{  title:title,
            type:type,
            description:description,
            attachments:attachments,
            priority:priority,
            job_reference_id:job_reference_id}
  })

}