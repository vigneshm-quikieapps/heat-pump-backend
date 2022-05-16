/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const { getJwtToken } = require("../../utils/helpers");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
const { constants } = require("../../utils");
const UserModel = require("../../models/users.model");
const { GmailTransport } = require("../../config/mail");
const fabricModels = require("../../models/fabric.models");

exports.getFabric=async (req,res,next)=>{

  var { fid } = req.query;

  try {
    const response = await fabricModels.findById(fid);
    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }



}

exports.deleteFabric=async(req,res,next)=>{
  var {fid}=req.query;
  
try{
  const response=await fabricModels.findByIdAndDelete(fid);
  res.json({
    success: true,
    message: "DELETED",
    data: [],
  });
}catch(err){
  res.json({
    success: false,
    message: err.toString(),
    data: [],
  });
}
}
exports.getAllFabricFromType = async (req, res, next) => {
  // paginatied data return
  var { page, perPage, type ,f_status,f_ftype,f_desc,f_wc} = req.query;


  if (!page) {
    page = 1;
  }
  if (!perPage) {
    perPage = 10;
  }

  try {
    const FabricData = await fabricModels
      .find({
        type: type || !null,
        status: f_status || { $exists: true },
        fabric_type:f_ftype || { $exists: true },
        description:new RegExp(f_desc) ||{ $exists: true },
        wall_construction:new RegExp(f_wc) ||{ $exists: true }
      })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const total_records = await fabricModels.find({
      type: type || !null,
      status: f_status || { $exists: true },
      fabric_type:f_ftype || { $exists: true },
      description:new RegExp(f_desc) ||{ $exists: true },
      wall_construction:new RegExp(f_wc) ||{ $exists: true }
    }).countDocuments();
    const total_pages = Math.ceil(total_records / perPage);

    res.json({
      success: true,
      message: "OK",
      total_records: total_records,
      total_pages: total_pages,
      current_page: page,
      data: FabricData,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
      data: [],
    });
  }
};

exports.createFabric = async (req, res, next) => {
  // create a fabric
  var { type, wall_construction,description, details, image_url, fabric_type,length_of_exposed_wall,longness_of_suspended_floor,shortness_of_suspended_floor ,status=1} = req.body;


  try {
    
    const newFabric = new fabricModels({
      type, 
      wall_construction,
      image_url, 
      fabric_type,
      length_of_exposed_wall,
      shortness_of_suspended_floor,
      longness_of_suspended_floor,
      description,
      details, 
      status 
    });

    const response = await newFabric.save();
    res.json({
      success: true,
      message: "New Fabric has been added",
      data: response,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
      data: [],
    });
  }
};

exports.patchFabric=async (req,res,next)=>{

  var { fid } = req.query;
  var obj = ({
    type,
    wall_construction,
    detail,
    description,
    image_url,
    fabric_type,
    length_of_exposed_wall,
    shortness,
    longness,
    status
  } = req.body);

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  try {

    const response = await fabricModels.findByIdAndUpdate(fid, obj);
    res.json({
      success: true,
      message: "The fabric has been updated",
      data: obj
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }



}

exports.deleteFabric=async(req,res,next)=>{
  var {fid}=req.query;
  
try{
  const response=await fabricModels.findByIdAndDelete(fid);
  res.json({
    success: true,
    message: "The fabric has been deleted",
    data: [],
  });
}catch(err){
  res.json({
    success: false,
    message: err.toString(),
    data: [],
  });
}

}