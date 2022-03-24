/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const UserModel = require("../../models/users.model");
const ServiceRequestNoteModel = require("../../models/service-request-note.model");
const ServiceRequestModel=require('../../models/service-request.model')
exports.postServiceRequestNote = async (req, res, next) => {
  const { srid } = req.query;
  
  const { title, description, status, attachments,type=1 } = req.body;

  try {
    const note = new ServiceRequestNoteModel({
      title: title,
      description: description,
      attachments: attachments,
      creator_srid: srid,
      type:type
    });

    const rep = await note.save();

    // console.log(rep);
    const rp=await ServiceRequestModel.findById(srid).populate("notes")
    console.log(rp);
    if(rp.notes.length)
    {
        rp.notes.push(rep._id.toString());
        rp.save();
    }else{
      console.log("CALLED");
        const rspp=await ServiceRequestModel.findByIdAndUpdate(srid,{
            notes:[rep._id.toString()]
        })

    }
    res.json({
        success: true,
        data: rep,
      });


   
   
  } catch (err) {
    res.json({
      success: false,
      data: {
        message: err.toString(),
      },
    });
  }
};

exports.getAllServiceRequestNotes = async (req, res, next) => {
  const { srid } = req.query;
    const userId=req.decodedAccessToken.id;
  // pagination to be done
  try {
    const resp = await ServiceRequestNoteModel.find({creator_srid:srid});

    console.log(resp);
    res.json({
        success:true,
        data:resp
    })
  } catch (err) {
      res.json({
          success:false,
          data:{
              message:err.toString()
          }
      })
  }
};


exports.patchServiceRequestNotesUpdate = async (req, res, next) => {
  const { description } = req.body;
  const { nrid } = req.query;


  try {
    const rp = await ServiceRequestNoteModel.findById(nrid);
    console.log(rp)
    rp.updates.push(description);
    rp.save();
    res.json({
        success:true,
        data:rp
    })
  } catch (err) {
    res.json({
        success:false,
        data:err.toString()
    })

  }
};

exports.patchServiceRequestNotesAttachmentUpdate = async (req, res, next) => {
    const {nrid}=req.query;
    const { attachments } = req.body;
// should be array of string
  try {
    const rp = await ServiceRequestNoteModel.findById(nrid);
    console.log(rp)
    console.log(attachments)
    const rpp=[...rp.attachments,...attachments];
    rp.attachments=rpp; 
    rp.save();
    res.json({
        success:true,
        data:rp
    })
  } catch (err) {
    res.json({
        success:false,
        data:err.toString()
    })

  }


};

