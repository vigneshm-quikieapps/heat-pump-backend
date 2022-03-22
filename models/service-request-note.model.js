

const mongoose = require("mongoose"),
Schema = mongoose.Schema;


const ServiceRequestNoteSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:"Please enter the title"
    },
    type:{
        type:Number, // Internal , System , from Luth Staff
    },
    isInternal:{
        type:Boolean
    },
    description:
    {
        type:String,
        required:"Please enter the description"
    },
    // status:{
    //     type:Number,
    //     default:1
    // },
    attachments:[{
        type:String
    }],
    // updates:[{
    //         type:String
    // }],
    creator_srid:{
        type:Schema.Types.ObjectId,
        ref:"ServiceRequest"
    },
    collaborators:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},
{ timestamps: true }
);



module.exports = mongoose.model("ServiceRequestNote", ServiceRequestNoteSchema);
