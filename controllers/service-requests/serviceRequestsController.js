const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { getJwtToken } = require("../../utils/helpers");

const ServiceRequest= require("../../models/service-request.model");
const UserModel = require("../../models/users.model");
const {reversedNum}=require('../../utils/helpers');


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
    const userName=req.decodedAccessToken.name

    const time=new Date().getTime();

    const id=reversedNum(time);
    const service_ref_number="SR"+reversedNum(parseInt(id+Math.random()*100));
    
   const sr=new ServiceRequest({
        service_ref_number:service_ref_number,
        title:title,
        type:type,
        description:description,
        attachments:attachments,
        priority:priority,
        status:1,
        creator_name:userName,
        job_reference_id:job_reference_id
   });

 const response= await sr.save();
 
  const userId=req.decodedAccessToken.id;
  
  const objectId=response._id.toString();
 
  try{
    let usr=await UserModel.findById(userId);
    let srArray= usr.service_requests;
    srArray.push(objectId);
    const resp=await usr.save();
  }
  catch(e){

  }

  res.json({
      success:true,
      data:{ 
            title:title,
            type:type,
            description:description,
            attachments:attachments,
            priority:priority,
            status:1,
            job_reference_id:job_reference_id,
            service_ref_number:service_ref_number,
            creator_name:userName
          }
  })

};

exports.getAllServiceRequests=async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const userId=req.decodedAccessToken.id;
  const email=req.decodedAccessToken.email;
  var {page,perPage}=req.query;

  if(!page){
    page=1;
  }
  if(!perPage){
    perPage=10
  }

  const rspp=  await UserModel.findById(userId);
  const total_records=(rspp.service_requests.length);

  const response =await UserModel.findById(userId)
  .populate([
    {
      path:"service_requests",
      model:"ServiceRequest",
      options:{
        sort:{},
        skip:perPage*(page-1),
        limit:perPage
      }
    }
  ])


  const foundServiceRequests=[...response.service_requests];
  const respArray=[];

  for(let i=0;i<foundServiceRequests.length;i++){
    respArray.push(foundServiceRequests[i])
  }

  const total_pages=Math.ceil(total_records/perPage);

  res.json({
    success:true,
    data:{
      message:"OK",
      total_records:total_records,
      total_pages:total_pages,
      current_page:page,
      data:respArray
    }
  })


};

exports.getServiceRequestsStatus=async(req,res,next)=>{
  const userId=req.decodedAccessToken.id;
  console.log(userId);
  const response =await UserModel.findById(userId).populate("service_requests")

 const sArray=response.service_requests;



  let closed=0,neww=0,working=0,need_attention=0;
  

  for(let i=0;i<sArray.length;i++){
   
    switch (sArray[i].status)
    {case 1:
      neww+=1;
      break;
      case 2:
        break;
      working+=1;
        case 3:
          break;
      need_attention+=1
          case 4:
            closed+=1
          break;
      default:
        break;
    }
  }


  res.json({
    success:true,
    data:{
      new:neww,
      working:working,
      need_attention:need_attention,
      closed:closed
    }
  })

};
