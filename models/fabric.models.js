/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const { count } = require("./users.model");

const mongoose = require("mongoose"),
  Schema = mongoose.Schema;


// var CounterSchema = Schema({
//     _id: {type: String, required: true},
//     seq: { type: Number, default: 0 }
// });

// var counter = mongoose.model('counter', CounterSchema);

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
    longness_of_suspended_floor:String,
    status:Number
  },
  { timestamps: true }
);


// FabricSchema.pre('save', function(next) {
//   var doc = this;
//   counter.find({},function (error,counter){
//     console.log(counter);
//   });
//   counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
//       if(error){
//         console.warn(error);
//           return next(error);
//   }
//       doc.fabric_type = counter.seq;
//       next();
//   });
// });

// FabricSchema.post("save", (doc, next) => {
//   console.log("Saved in FabricSchema");
//   next();
// });

module.exports = mongoose.model("Fabric", FabricSchema);
