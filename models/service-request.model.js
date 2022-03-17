
const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


const ServiceRequestSchema = new mongoose.Schema(
  {
    service_ref_number:String,
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
    },
    creator_name:{
      type:String
    },
    creator_id:{
      type:Schema.Types.ObjectId
    },
    creator:{
      type:Schema.Types.ObjectId,
      ref:"Users"
    },
    notes:{
      type:Schema.Types.ObjectId,
      ref:"ServiceRequestNote"
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
