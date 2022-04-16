/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const { getJwtToken } = require("../../utils/helpers");

const ServiceRequestModel = require("../../models/service-request.model");
const UserModel = require("../../models/users.model");
const { reversedNum } = require("../../utils/helpers");
const { default: faker } = require("@faker-js/faker");
const { GmailTransport } = require("../../config/mail");
const { myCache, loadCache, setCache } = require("../../utils/cache");

exports.postServiceRequest = async (req, res, next) => {
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
    status = 1,
    job_reference_id = null,
    assigned_to = "none",
  } = req.body;
  const userName = req.decodedAccessToken.name;
  const userId = req.decodedAccessToken.id;

  try {
    // for(var i=0;i<100;i++){

    const time = new Date().getTime();

    const id = reversedNum(time);
    const service_ref_number =
      "SR" + reversedNum(parseInt(id + Math.random() * 100));
    console.log(service_ref_number);
    console.log("JRID", job_reference_id);
    const sr = new ServiceRequestModel({
      title: title,
      type: type,
      description: description,
      attachments: attachments,
      priority: priority,
      status: status,
      creator_name: userName,
      creator_id: userId,
      job_reference_id: job_reference_id,
      service_ref_number: service_ref_number,
      assigned_to: assigned_to,
    });
    /*
    const ary=[];
    for(var j=0;j<20;j++){
      ary.push(faker.system.directoryPath())
    }
     const sr = new ServiceRequestModel({
      title: faker.lorem.words(),
      type: Math.floor(Math.random()*100)%3 +1,
      description: faker.lorem.paragraph(10),
      attachments: ary,
      priority: Math.floor(Math.random()*100)%3 +1,
      status: Math.ceil(Math.random()*100)%4+1,
      creator_name: userName,
      creator_id: userId,
      job_reference_id: "6241f541201738deabdd9eac",
      service_ref_number: service_ref_number,
      type: Math.ceil(Math.random()*100)%3 +1
    });
    
    */

    const response = await sr.save();
   
    const objectId = response._id.toString();

    let usr = await UserModel.findById(userId);
    let srArray = usr.service_requests;
    srArray.push(objectId);

    const resp = await usr.save();

    // }

    // process.exit(1);

    const msg = {
      to: usr.email, // Change to your recipient
      from: '"Heat-Pump Support" siddharthsk1234@gmail.com', // Change to your verified sender
      subject: `Acknowledgment: ${response.service_ref_number} - ${response.title} `,
      html: `Hello ${usr.name} <br/>
    Thank you for taking time to contact Luths Services, Glasgow today.
Your request has been received and is being reviewed. The reference number for your service request is <strong>${response.service_ref_number}</strong>. <br/><br/>
Regards,<br/>
Luths Services Support Staff <br/>
    
    `,
    };

    GmailTransport.sendMail(msg)
      .then((rr) => {
        console.log("SENT");
      })
      .catch((er) => {
        console.log("FAILED TO SEND");
      });

    res.json({
      success: true,
      data: response,
    });
  } catch (e) {
    res.json({
      success: false,
      data: {
        message: e.toString(),
      },
    });
  }
};

exports.getAllServiceRequests = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const userId = req.decodedAccessToken.id;
  const email = req.decodedAccessToken.email;
  var {
    page,
    perPage,
    status,
    f_srid = "SR",
    f_priority,
    f_title = "",
  } = req.query;
  const statuses = status.split(",");
  // console.log(statuses);



  /*  ------------ CACHE LOGIC-------------- */
if(loadCache("SR",req,res,next)!==-1){
 return next();
}
  /*  ------------ CACHE LOGIC-------------- */


  var mp = new Map();
  const searchArray = [];

  for (let status of statuses) {
    searchArray.push({ status: status });
    mp.set(parseInt(status), true);
  }

  if (mp.size == 0) {
    searchArray.push({ status: 1 });
    searchArray.push({ status: 2 });
  }

  if (!page) {
    page = 1;
  }
  if (!perPage) {
    perPage = 10;
  }

  const response = await UserModel.findById(userId).populate([
    {
      path: "service_requests",
      model: "ServiceRequest",
      populate: [
        {
          path: "job_reference_id",
          model: "Job",
        },
        {
          path: "notes",
          model: "ServiceRequestNote",
        },
      ],

      match: {
        $and: [
          { service_ref_number: new RegExp(f_srid) },
          { priority: f_priority ? f_priority : { $exists: true } },
          { title: new RegExp(f_title) },
          { $or: searchArray },
        ],
      },
      options: {
        sort: {},
        skip: perPage * (page - 1),
        limit: perPage,
      },
    },
  ]);

  const response2 = await UserModel.findById(userId).populate({
    path: "service_requests",
    model: "ServiceRequest",
    match: {
      $and: [
        { service_ref_number: new RegExp(f_srid) },
        { priority: f_priority ? f_priority : { $exists: true } },
        { title: new RegExp(f_title) },
        { $or: searchArray },
      ],
    },
  });
  console.log(response2.service_requests.length);

  const foundServiceRequests = [...response.service_requests];
  // console.log(foundServiceRequests);
  const total_records = response2.service_requests.length;

  const respArray = [];

  for (let i = 0; i < foundServiceRequests.length; i++) {
    if (mp.get(foundServiceRequests[i].status) === true) {
      respArray.push(foundServiceRequests[i]);
    }
  }

  const total_pages = Math.ceil(total_records / perPage);
 
  /*  ------------ CACHE LOGIC-------------- */
  setCache("SR",req,{
    success: true,
    data: {
      total_records: total_records,
      total_pages: total_pages,
      current_page: page,
      data: respArray,
    },
  });
  /*  ------------ CACHE LOGIC-------------- */


 
  res.json({
    success: true,
    data: {
      total_records: total_records,
      total_pages: total_pages,
      current_page: page,
      data: respArray,
    },
  });
};

exports.getServiceRequestsStatus = async (req, res, next) => {
  const userId = req.decodedAccessToken.id;



  if(loadCache("SR",req,res,next)!==-1){
    return next();
   }
  const response = await UserModel.findById(userId).populate([
    {
      path: "service_requests",
      model: "ServiceRequest",
      populate: [
        {
          path: "job_reference_id",
          model: "Job",
        },
        {
          path: "notes",
          model: "ServiceRequestNote",
        },
      ],
    },
  ]);

  const sArray = response.service_requests;

  let closed = 0,
    neww = 0,
    working = 0,
    need_attention = 0;

  for (let i = 0; i < sArray.length; i++) {
    switch (sArray[i].status) {
      case 1:
        neww += 1;
        break;
      case 2:
        working += 1;
        break;
      case 3:
        need_attention += 1;
        break;
      case 4:
        closed += 1;
        break;
    }
  }

  const RESPONSE={
    success: true,
    data: {
      total: sArray.length,
      new: neww,
      working: working,
      need_attention: need_attention,
      closed: closed,
    },
  };


  setCache("SR",req,RESPONSE)

  res.json(RESPONSE);
};

exports.getServiceRequestById = async (req, res, next) => {
  const { id } = req.params;
  console.log("ID", id);


  if(loadCache("SR",req,res,next)!==-1){
    return next();
   }



  try {
    const foundRecord = await ServiceRequestModel.findById(id).populate([
      {
        path: "job_reference_id",
        model: "Job",
      },
      {
        path: "notes",
        model: "ServiceRequestNote",
      },
    ]);

    if (foundRecord) {
      const RESPONSE={
        success: true,
        data: foundRecord,
      };



      setCache("SR",req,RESPONSE)
      res.json(RESPONSE);



    } else {
      res.json({
        success: false,
        data: {
          message: "Not found",
        },
      });
    }
  } catch (e) {
    res.json({
      success: false,
      data: {
        message: e.toString(),
      },
    });
  }
};

exports.patchServiceRequest = async (req, res, next) => {
  console.log("OK");
  const { id } = req.params;
  console.log(id);

  const updateObj = req.body;
  try {
    const response = await ServiceRequestModel.findByIdAndUpdate(
      id.toString(),
      updateObj
    );
    let newObj = Object.assign(response);

    if (updateObj.status === 2) {
      // trigger mail
      // create a new note for internal
    }

    const keys=myCache.keys();
    keys.forEach((e)=>{
      if(e[0]=='S' && e[1]=='R'){
        myCache.del(e);
      }
    })
 
    if (response) {
      res.json({
        success: true,
        data: {
          message: "updated",
          //    data:newObj
        },
      });
    } else
      res.json({
        success: false,
        data: {
          message: "Invalid ID",
        },
      });
  } catch (err) {
    console.log(err);

    res.json({
      success: false,
      data: {
        message: err.toString(),
      },
    });
  }
};
