/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const UserModel = require("../../models/users.model");
const ServiceRequestNoteModel = require("../../models/service-request-note.model");
const ServiceRequestModel = require("../../models/service-request.model");
exports.postServiceRequestNote = async (req, res, next) => {
  const { srid } = req.query;

  const { title, description, status, attachments, type = 1 } = req.body;

  try {
    const note = new ServiceRequestNoteModel({
      title: title,
      description: description,
      attachments: attachments,
      creator_srid: srid,
      type: type,
    });

    const rep = await note.save();

    // console.log(rep);
    if(attachments)
    
{      const sr= await ServiceRequestModel.findById(srid)

      attachments.forEach(e=>sr.attachments.push(e));

      await sr.save();
}

    const rp = await ServiceRequestModel.findById(srid).populate("notes");

    if (rp.notes.length) {
      rp.notes.push(rep._id.toString());
      rp.save();
    } else {
      const rspp = await ServiceRequestModel.findByIdAndUpdate(srid, {
        notes: [rep._id.toString()],
      });
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
  const userId = req.decodedAccessToken.id;
  // pagination to be done
  try {
    const resp = await ServiceRequestNoteModel.find({ creator_srid: srid });

    console.log(resp);
    res.json({
      success: true,
      data: resp,
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
