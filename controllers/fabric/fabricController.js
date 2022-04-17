/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */
const crypto = require("crypto");
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

exports.getAllFabricFromType = async (req, res, next) => {
  // paginatied data return
  var { page, perPage, type } = req.query;
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
      })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const total_records = await fabricModels.find({}).countDocuments();
    const total_pages = Math.floor(total_records / perPage);

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
  var { type, wall_construction,description, details, image_url, fabric_type,length_of_exposed_wall,longness_of_suspended_floor,shortness_of_suspended_floor } = req.body;

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
      details
    });

    const response = await newFabric.save();
    res.json({
      success: true,
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
    longness
  } = req.body);

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  try {``
    const response = await fabricModels.findByIdAndUpdate(fid, obj);
    res.json({
      success: true,
      message: "UPDATED",
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
  var {fid}=req.params;
try{
  const response=fabricModels.findByIdAndDelete(fid);
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