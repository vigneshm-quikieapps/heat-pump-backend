/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const FabricSchema = new mongoose.Schema(
  {
    type: Number,
    wall_construction: String,
    details:String,
    description:String,
    image_url: String,
    fabric_type: Number,
    length_of_exposed_wall:String,
    shortness_of_suspended_floor:String,
    longness_of_suspended_floor:String
  },
  { timestamps: true }
);

FabricSchema.post("save", (doc, next) => {
  console.log("Saved in FabricSchema");
  next();
});

module.exports = mongoose.model("Fabric", FabricSchema);
