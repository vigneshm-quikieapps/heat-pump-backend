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

exports.createQuote = async (req, res, next) => {
  // create a Quote
  var obj = ({
    site_details,
    occupancuy,
    equipments,
    high_energy_equipments,
    questions,
    drawings,
    photos,
    raditator_size,
    window_size,
    heating_system,
    amount_of_electricity,
    amount_of_gas,
    cost_of_electricity,
    cost_of_gas,
    other_details,
  } = req.body);

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  const time = new Date().getTime();
  const id = reversedNum(time);
  const quote_reference_number =
    "QE" + reversedNum(parseInt(id + Math.random() * 100));
  obj.quote_reference_number = quote_reference_number;

  try {
    const newQuote = new quoteModels(obj);
    const response = await newQuote.save();
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
  var { qid } = req.query;
  var obj = ({
    site_details,
    occupancuy,
    equipments,
    high_energy_equipments,
    questions,
    drawings,
    photos,
    raditator_size,
    window_size,
    heating_system,
    amount_of_electricity,
    amount_of_gas,
    cost_of_electricity,
    cost_of_gas,
    other_details,
  } = req.body);

  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);

  try {
    const response = await quoteModels.findByIdAndUpdate(qid, obj);
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
};
