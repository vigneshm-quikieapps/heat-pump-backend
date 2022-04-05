/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const ServiceRequestSchema = new mongoose.Schema(
  {
    service_ref_number: String,
    title: {
      type: String,
      required: "Please enter name of service request",
    },
    description: String,
    type: {
      type: String,
    },
    attachments: [
      {
        type: String,
      },
    ],
    priority: {
      type: Number,
    },
    job_reference_id: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    status: {
      type: Number,
    },
    creator_name: {
      type: String,
    },
    creator_id: {
      type: Schema.Types.ObjectId,
    },
    assigned_to: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    last_updated_by: {
      type: String,
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "ServiceRequestNote",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
