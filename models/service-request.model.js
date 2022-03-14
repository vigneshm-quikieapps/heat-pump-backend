
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


const ServiceRequestSchema = new mongoose.Schema(
  {
    sr_number:String,
    title:{
      type:String,
      required:'Please enter name of service request'
    },
    description:String,
    type:{
        type:String
    },
    attachments:[{
        type: String
    }],
    priority:{
       type:Number,
    },
    job_reference_id:{
        type:String
    },
    status:{
        type:Number,
        default:1
    },
    creator_name:{
      type:String
    },
    creator:{
      type:Schema.Types.ObjectId,
      ref:"Users"
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
