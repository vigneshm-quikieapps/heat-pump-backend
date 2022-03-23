/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const mongoose = require("mongoose"),
Schema = mongoose.Schema;


const JobSchema = new mongoose.Schema(
  {
    title:{
      type:String,
      required:'Please enter the title'
    },
    description:{
      type:String,
      required:'Please enter the description'
    },
    attachments:[{
      type:String
    }],
    job_ref_number:String,
    status:String,
    site_details:String,
    creator:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("Job", JobSchema);
