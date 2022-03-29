const { validationResult } = require("express-validator");

const ServiceRequestModel = require("../../models/service-request.model");
const UserModel = require("../../models/users.model");

exports.getAllServiceRequestsAdminSide = async (req, res, next) => {
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
    f_srid = "SR",
    f_priority,
    f_title = "",
  } = req.query;
  const statuses = status.split(",");
  console.log(statuses);
  var mp = new Map();
  const searchArray = [];

  for (let status of statuses) {
    searchArray.push({ status: status });
    mp.set(parseInt(status), true);
  }
  console.log(mp.get(1));

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

  const rspp = await UserModel.find({ admin: false });

  const response = await UserModel.find({ admin: false }).populate([
    {
      path: "service_requests",
      model: "ServiceRequest",
      populate: [
        {
          path: "job_reference_id",
          model: "Job",
        },
        {
          path: "notes",
          model: "ServiceRequestNote",
        },
      ],
      match: {
        $and: [
          { service_ref_number: new RegExp(f_srid) },
          { priority: f_priority ? f_priority : { $exists: true } },
          { title: new RegExp(f_title) },
          { $or: searchArray },
        ],
      },
      options: {
        sort: {},
        skip: perPage * (page - 1),
        limit: perPage,
      },
    },
  ]);

  const response2 = await UserModel.find({ admin: false }).populate({
    path: "service_requests",
    model: "ServiceRequest",
    match: {
      $and: [
        { service_ref_number: new RegExp(f_srid) },
        { priority: f_priority ? f_priority : { $exists: true } },
        { title: new RegExp(f_title) },
        { $or: searchArray },
      ],
    },
  });

  const foundServiceRequests = [];

  console.log("REPONSELENGTH", response.length);
  response.forEach((e) => {
    if (e.service_requests.length) {
      e.service_requests.forEach((f) => {
        foundServiceRequests.push(f);
      });
    }
  });

  console.log("FOUNDSERVICEREQUESTSLENGTH", foundServiceRequests.length);

  var total_records = 0;

  response2.forEach((e) => {
    total_records += parseInt(e.service_requests.length);
  });
  console.log(total_records);

  const respArray = [];

  for (let i = 0; i < foundServiceRequests.length; i++) {
    console.log(foundServiceRequests[i]);
    console.log(mp.get(foundServiceRequests[i].status));
    console.log(mp.get(1));
    if (mp.get(foundServiceRequests[i].status) === true) {
      respArray.push(foundServiceRequests[i]);
    }
  }

  respArray.slice(perPage * (page - 1), perPage * (page - 1) + perPage);

  const total_pages = Math.ceil(total_records / perPage);

  res.json({
    success: true,
    data: {
      total_records: total_records,
      total_pages: total_pages,
      current_page: page,
      data: respArray,
    },
  });
};

exports.getServiceRequestsStatusAdminSide = async (req, res, next) => {
  const userId = req.decodedAccessToken.id;

  const response = await UserModel.find({ admin: false }).populate([
    {
      path: "service_requests",
      model: "ServiceRequest",
      populate: [
        {
          path: "job_reference_id",
          model: "Job",
        },
        {
          path: "notes",
          model: "ServiceRequestNote",
        },
      ],
    },
  ]);

  const sArray = [];
  response.forEach((e) => {
    e.service_requests.forEach((f) => {
      sArray.push(f);
    });
  });

  let closed = 0,
    neww = 0,
    working = 0,
    need_attention = 0;

  for (let i = 0; i < sArray.length; i++) {
    switch (sArray[i].status) {
      case 1:
        neww += 1;
        break;
      case 2:
        working += 1;
        break;
      case 3:
        need_attention += 1;
        break;
      case 4:
        closed += 1;
        break;
    }
  }

  res.json({
    success: true,
    data: {
      total: sArray.length,
      new: neww,
      working: working,
      need_attention: need_attention,
      closed: closed,
    },
  });
};
