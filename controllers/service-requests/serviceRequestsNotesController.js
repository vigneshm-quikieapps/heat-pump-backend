/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const UserModel = require("../../models/users.model");
const ServiceRequestNoteModel = require("../../models/service-request-note.model");
const ServiceRequestModel = require("../../models/service-request.model");
const { default: faker } = require("@faker-js/faker");
const { GmailTransport } = require("../../config/mail");
exports.postServiceRequestNote = async (req, res, next) => {
  const { srid } = req.query;
  console.log("CALLED");
  const { title, description, status, attachments, type = 1 } = req.body;
  const name = req.decodedAccessToken.name;
  console.log(name);
  try {
    // for(var i=0;i<10;i++){

    // const ary=[];
    // for(var j=0;j<20;j++){
    //   ary.push(faker.system.directoryPath())
    // }

    // const note = new ServiceRequestNoteModel({
    //   title: faker.lorem.words(5),
    //   description: faker.lorem.paragraphs(4),
    //   attachments: ary,
    //   creator_srid: '624202e439e6ee483cc177f6',
    //   type: Math.ceil(Math.random()*100)%4+1,
    // });

    // console.log(i);
    const note = new ServiceRequestNoteModel({
      title: title,
      description: description,
      attachments: attachments,
      creator_srid: srid,
      type: type,
    });

    const AssociatedSR = await ServiceRequestModel.findById(srid);
    const AssociatedUserId = AssociatedSR.creator_id.toString();
    const usr = await UserModel.findById(AssociatedUserId);
    console.log(usr);
    const rep = await note.save();
    var sr;
    // console.log(rep);
    console.log(srid);
    sr = await ServiceRequestModel.findById(srid);
    if (attachments) {
      attachments.forEach((e) => sr.attachments.push(e));
    }

    if (title == "--closed--") {
      sr.status = 4;
    }
    sr.last_updated_by = name;
    await sr.save();

    const rp = await ServiceRequestModel.findById(srid).populate("notes");

    if (rp.notes.length) {
      rp.notes.push(rep._id.toString());
      rp.save();
    } else {
      const rspp = await ServiceRequestModel.findByIdAndUpdate(srid, {
        notes: [rep._id.toString()],
      });
    }

    console.log("!!!", sr);

    const msg = {
      to: usr.email, // Change to your recipient
      from: '"Heat-Pump Support" siddharthsk1234@gmail.com', // Change to your verified sender
      subject: `Update: ${sr.service_ref_number} - ${sr.title} `,
      html: `Hello ${sr.creator_name} <br/>
    Please note that your service request <strong>${sr.service_ref_number}</strong> has been updated. To view updates, please access our customer support portal at https://css.heatpumpdesigner.com/ and navigate to the My Service Requests page. <br/><br/>
Regards,<br/>
Luths Services Support Staff <br/>
    
    `,
    };

    const closeMsg = {
      to: usr.email, // Change to your recipient
      from: '"Heat-Pump Support" siddharthsk1234@gmail.com', // Change to your verified sender
      subject: `Closed: ${sr.service_ref_number} - ${sr.title} `,
      html: `Hello ${sr.creator_name} <br/>
    Please be aware that your service request <strong> ${sr.service_ref_number} </strong> has been closed.  <br/>
    Reason for closing : ${description} <br/>
    If you would like to re-engage Luths Services, Glasgow on this matter, access our customer support portal at https://css.heatpumpdesigner.com/ and navigate to the My Service Requests page. <br/> 
    Regards,<br/>
    Luths Services Support Staff <br/>   
    `,
    };

    GmailTransport.sendMail(title == "--closed--" ? closeMsg : msg)
      .then((rr) => {
        console.log("SENT");
      })
      .catch((er) => {
        console.log("FAILED TO SEND");
      });

    // process.exit(1);

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
