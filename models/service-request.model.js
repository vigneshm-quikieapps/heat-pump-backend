const { stringAt } = require("pdfkit/js/data");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


const ServiceRequestSchema = new mongoose.Schema(
  {
    title:String,
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
        type:Number
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("ServiceRequests", ServiceRequestSchema);
