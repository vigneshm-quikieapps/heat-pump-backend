/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
const { getJwtToken, reversedNum } = require("../../utils/helpers");
const { constants } = require("../../utils");
const quoteModels = require("../../models/quote.models");
const { default: mongoose } = require("mongoose");
const UserSchema = require("../../models/users.model");
const { GmailTransport } = require("../../config/mail");

exports.getQuote = async (req, res, next) => {
  var { qid } = req.query;

  try {
    console.log(qid);
    const response = await quoteModels.findById(qid);
    res.json({
      success: true,
      data: response,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.getAllQuote = async (req, res, next) => {
  var {
    page,
    perPage,
    status,
    cst = false,
    creatorId,
    siteDetails,
    customerName,
  } = req.query;

  const userId = req.decodedAccessToken.id;

  if (!page) {
    page = 1;
  }
  if (!perPage) {
    perPage = 10;
  }

  var customerSide = undefined;
  if (cst) {
    customerSide = mongoose.Types.ObjectId(userId);
  }

  var filter = {
    // status: status || !null,
  };

  if (cst) {
    filter.creator_customer_id = customerSide;
  }

  try {
    let response = await quoteModels
      .find({
        ...filter,
        ...(status && { status: status }),
        ...(creatorId && { creator_customer_id: creatorId }),
        $or: [
          { "site_details.address_1": new RegExp(siteDetails, "i") || !null },
          { "site_details.address_2": new RegExp(siteDetails, "i") || !null },
          { "site_details.city": new RegExp(siteDetails, "i") || !null },
          { "site_details.postcode": new RegExp(siteDetails, "i") || !null },
        ],
      })
      .sort({ createdAt: -1, updatedAT: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator_customer_id", "", UserSchema);

    if (customerName) {
      response = response.filter((item) => {
        return item.creator_customer_id.name
          .toLowerCase()
          .includes(customerName.toLowerCase());
      });
    }

    const total_records = await quoteModels
      .find({
        ...filter,
        ...(status && { status: status }),
        ...(creatorId && { creator_customer_id: creatorId }),
        $or: [
          { status: status || !null },
          { "site_details.address_1": new RegExp(siteDetails, "i") || !null },
          { "site_details.address_2": new RegExp(siteDetails, "i") || !null },
          { "site_details.city": new RegExp(siteDetails, "i") || !null },
          { "site_details.postcode": new RegExp(siteDetails, "i") || !null },
        ],
      })
      .sort({ createdAt: -1, updatedAT: -1 })
      .countDocuments();
    const total_pages = Math.ceil(total_records / perPage);

    res.json({
      success: true,
      message: "OK",
      current_page: page,
      total_records: total_records,
      currentRecords: response.length,
      total_pages: total_pages,
      data: response,
    });
  } catch (err) {
    res.json({
      success: false,
      current_page: page,
      total_records: total_records,
      total_pages: total_pages,
      message: err.toString(),
    });
  }
};

exports.createQuote = async (req, res, next) => {
  // create a Quote

  const userId = req.decodedAccessToken.id;
  console.log("ID", userId);
  const usr = await UserSchema.findById(userId);
  console.log(usr);
  // var obj = ({
  //   site_details,
  //   occupancuy,
  //   equipments,
  //   high_energy_equipments,
  //   questions,
  //   drawings,
  //   photos,
  //   raditator_size,
  //   window_size,
  //   heating_system,
  //   amount_of_electricity,
  //   amount_of_gas,
  //   cost_of_electricity,
  //   cost_of_gas,
  //   other_details,
  // } = req.body);
  const obj = req.body;

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  const time = new Date().getTime();
  const id = reversedNum(time);
  const quote_reference_number = "JR" + parseInt(id + Math.random() * 100);
  obj.quote_reference_number = quote_reference_number;

  try {
    obj.creator_customer_id = userId;
    console.log("OBJ", obj);
    const newQuote = new quoteModels(obj);
    const response = await newQuote.save();

    const msg = {
      to: usr.email, // Change to your recipient  "nizam.mogal@ismartapps.co.uk"
      from: '"Heat-Pump Support" hello@ismartapps.co.uk', // Change to your verified sender
      subject: `Acknowledgment: Job Request  `,
      html: `Hello ${usr.name}, <br/><br/>
       Thank you for taking time to submit a job with Luths Services, Glasgow. <br/> <br/>
       We have received your job request and is being reviewed.
      The reference number for your job request is<strong>${response.quote_reference_number}</strong>.
      We’ll contact you shortly if we need any additional information <br/><br/>
      Regards,<br/>
      Luths Services Support Staff <br/>
   
   `,
    };
      // Thank you for taking time to contact Luths Services, Glasgow today. <br/>
      // We have received your job request and is being reviewed.
      // The reference number for your job request is <strong>${response.quote_reference_number}</strong>. <br/>
    GmailTransport.sendMail(msg)
      .then((rr) => {
        console.log("SENT");
        console.log(rr);
      })
      .catch((er) => {
        console.log("ERROR", er);
        console.log("FAILED TO SEND");
      });

    res.json({
      success: true,
      message: "OK",
      data: response,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }
};

exports.patchQuote = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.decodedAccessToken.id;

  var obj = ({
    site_details,
    occupancuy,
    equipments,
    high_energy_equipments,
    questions,
    drawings,
    photos,
    status,
    radiator_and_window_sizes,
    heating_system,
    amount_of_electricity,
    amount_of_gas,
    cost_of_electricity,
    cost_of_gas,
    other_details,
  } = req.body);

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  try {
    const response = await quoteModels.findByIdAndUpdate(id, obj);
    const usr = await UserSchema.findById(userId);

    const msg = {
      to: usr.email, // Change to your recipient  "nizam.mogal@ismartapps.co.uk"
      from: '"Heat-Pump Support" hello@ismartapps.co.uk', // Change to your verified sender
      subject: `Update: ${response.quote_reference_number}`,
      html: `Hello ${usr.name}, <br/><br/>
      Please note that your job request <strong>${response.quote_reference_number}</strong>.
      status has been updated. To view updates,
     please access our job services portal at https://jsp-heatpumpdesigner.vercel.app/ and navigate to the My Jobs page.<br/><br/>
     Regards,<br/>
     Luths Services Support Staff <br/>
   
   `,
    };
    GmailTransport.sendMail(msg)
      .then((rr) => {
        console.log("SENT");
        console.log(rr);
      })
      .catch((er) => {
        console.log("ERROR", er);
        console.log("FAILED TO SEND");
      });

    res.json({
      success: true,
      message: "UPDATED",
      data: obj,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }
};

module.exports.getQuoteStatus = async (req, res, next) => {
  const id = req.params.id;
  try {
    const response = await quoteModels.find();

    //   const response = await UserModel.find({ admin: false });
    // const sArray = response;

    let newUnpaid = 0,
      newPaid = 0,
      inprogress = 0,
      complete = 0,
      snagging = 0;
    let total_records = response.length;
    for (let i = 0; i < response.length; i++) {
      switch (response[i].status) {
        case 1:
          newUnpaid += 1;
          break;
        case 2:
          newPaid += 1;
          break;
        case 3:
          inprogress += 1;
          break;
        case 4:
          complete += 1;
          break;
        case 5:
          snagging += 1;
          break;
        default:
          total_records -= 1;
      }
    }
    res.json({
      success: true,
      message: "OK",
      data: {
        newUnpaid: newUnpaid,
        newPaid: newPaid,
        inprogress: inprogress,
        complete: complete,
        snagging: snagging,
        total_records: total_records,
      },
    });
  } catch (err) {
    res.json({
      success: false,
      message: err.toString(),
    });
  }
};
