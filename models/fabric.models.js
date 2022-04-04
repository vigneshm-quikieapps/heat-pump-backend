/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const mongoose = require("mongoose"),
 Schema = mongoose.Schema;

const FabricSchema = new mongoose.Schema(
 {
     type:Number,
     wall_construction:String,
     image:String,
     fabric_type:Number
 },
 { timestamps: true }
);

module.exports = mongoose.model("Fabric", FabricSchema);
