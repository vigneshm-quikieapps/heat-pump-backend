

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


const JobSchema = new mongoose.Schema(
  {
    reference_number:String,
    status:String,
    site_details:String
  },
  { timestamps: true }
);



module.exports = mongoose.model("Job", JobSchema);
