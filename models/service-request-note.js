

const mongoose = require("mongoose"),
Schema = mongoose.Schema;


const ServiceRequestNoteSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:"Please enter the title"
    },
    description:{
        type:String,
        required:"Please enter the description"
    }
},
{ timestamps: true }
);



module.exports = mongoose.model("ServiceRequestNote", ServiceRequestNoteSchema);
