const UserModel = require("../../models/users.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { GmailTransport } = require("../../config/mail");

exports.getAllUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const userId = req.decodedAccessToken.id;
  const email = req.decodedAccessToken.email;
  var {
    page,
    perPage,
    status,
    f_status,
    mno = "",
    bn = "",
    badm = false,
  } = req.query;
  const statuses = status.split(",");

  var mp = new Map();
  const searchArray = [];

  for (let status of statuses) {
    searchArray.push({ status: status });
    mp.set(parseInt(status), true);
  }

  if (mp.size == 0) {
    searchArray.push({ status: 1 });
    searchArray.push({ status: 2 });
  }

  if (!page) {
    page = 1;
  }
  if (!perPage) {
    perPage = 10;
  }

  const SearchAndArray = [
    { admin: badm == 1 ? true : false },
    {
      mobile: new RegExp(mno),
    },
    { business_registered_name: new RegExp(bn) },
  ];

  if (badm == 1) {
    // string
    SearchAndArray.push({
      business_admin: true,
    });
  }

  // console.log(searchArray)
  const SKIP = perPage * (page - 1);
  const LIMIT = perPage;
  const response = await UserModel.find({
    $or: searchArray,
    $and: SearchAndArray,
  });

  const data = await UserModel.find({
    $or: searchArray,
    $and: SearchAndArray,
  })
    .populate([
      {
        path: "service_requests",
        populate: {
          path: "job_reference_id",
        },
        model: "ServiceRequest",
        match: { $or: searchArray },
      },
    ])
    .skip(SKIP)
    .limit(LIMIT);

  const total_records = response.length;
  const current_page = page;
  const total_pages = Math.ceil(total_records / perPage);
  res.send({
    total_pages,
    current_page,
    total_records,
    data: {
      data: data,
    },
  });

  // const foundServiceRequests = [...response.service_requests];

  // const total_records=response2.service_requests.length;

  // const respArray = [];

  // for (let i = 0; i < foundServiceRequests.length; i++) {
  //   console.log(foundServiceRequests[i].status)

  //   if(mp.get(foundServiceRequests[i].status)===true)
  //   {respArray.push(foundServiceRequests[i]);}
  // }

  // const total_records=respArray.length

  // console.log("TR",total_records)

  // const total_pages = Math.ceil(total_records / perPage);

  // res.json({
  //   success: true,
  //   data: {
  //     message: "OK",
  //     total_records: total_records,
  //     total_pages: total_pages,
  //     current_page: page,
  //     data: respArray,
  //   },
  // });
};

exports.getUserByID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }

  const userId = req.decodedAccessToken.id;

  const user = await UserModel.findById(userId).select("+password").exec();

  console.log(user.password);

  if (!user) {
    return res.status(404).json({
      errorMessage: "User not found",
    });
  }

  res.json({
    success: true,
    data: {
      message: "OK",
      data: user,
    },
  });
};

exports.patchUser = async (req, res, next) => {
  const { id } = req.query;

  var obj = req.body;
  console.log(obj);

  try {
    if (obj.password) {
      console.log("YES");
      const hpwd = await bcrypt.hash(obj.password, 12);
      obj.password = hpwd;
    }
    const rsp = await UserModel.findByIdAndUpdate(id, obj);
    //approved status 3
    // rejected status 5
    const aprrovedMsg = {
      to: rsp.email, // Change to your recipient  "nizam.mogal@ismartapps.co.uk"
      from: '"Heat-Pump Support" info@heatpumpdesigner.com', // Change to your verified sender
      cc: "info@heatpumpdesigner.com",
      subject: `Approved: Customer Account Request `,
      html: `Hello ${rsp.name}, <br/><br/>
      We have approved your account with us.
      You can start accessing our job services portal https://jsp-heatpumpdesigner.vercel.app/ 
      to purchase design services with us and ask questions.
      We’ll be happy to help you. Thank you once again for being interested in Luths Services, Glasgow. <br/><br/>
      Regards,<br/>
      Luths Services Support Staff <br/>
`,
    };
    const rejectedMsg = {
      to: rsp.email, // Change to your recipient  "nizam.mogal@ismartapps.co.uk"
      from: '"Heat-Pump Support" info@heatpumpdesigner.com', // Change to your verified sender
      cc: "info@heatpumpdesigner.com",
      subject: `Declined: Customer Account Request  `,
      html: `Hello ${rsp.name}, <br/><br/>
      Sorry, we cannot create an account for you with us at this time. Thank you for being interested in Luths Services, Glasgow. <br/><br/>
      Regards,<br/>
      Luths Services Support Staff <br/>
`,
    };

    if (obj.status == 3) {
      GmailTransport.sendMail(aprrovedMsg)
        .then((rr) => {
          console.log("SENT");
          console.log(rr);
        })
        .catch((er) => {
          console.log("ERROR", er);
          console.log("FAILED TO SEND");
        });
    } else if (obj.status == 5) {
      GmailTransport.sendMail(rejectedMsg)
        .then((rr) => {
          console.log("SENT");
          console.log(rr);
        })
        .catch((er) => {
          console.log("ERROR", er);
          console.log("FAILED TO SEND");
        });
    }

    res.send({
      success: true,
      data: {
        message: "updated",
      },
    });
  } catch (err) {
    res.send({
      success: false,
      data: {
        message: err.toString(),
      },
    });
  }
};

exports.getUsersStatus = async (req, res, next) => {
  const userId = req.decodedAccessToken.id;

  const response = await UserModel.find({ admin: false });
  const sArray = response;

  let neww = 0,
    inprogress = 0,
    active = 0;
  let total_records = sArray.length;
  for (let i = 0; i < sArray.length; i++) {
    switch (sArray[i].status) {
      case 1:
        neww += 1;
        break;
      case 2:
        inprogress += 1;
        break;
      case 3:
        active += 1;
        break;
      default:
        total_records -= 1;
    }
  }

  res.json({
    success: true,
    data: {
      total: total_records,
      new: neww,
      inprogress: inprogress,
      active: active,
    },
  });
};
