/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const { serviceRequestValidations } = require("../validations");

const ServiceRequestsController = require("../controllers/service-requests/serviceRequestsController");
const ServiceRequestModel = require("../models/service-request.model");
//
const usersModel = require("../models/users.model");
router.post(
  "/service-requests",
  serviceRequestValidations.POST_SERVICE_REQUEST,
  ServiceRequestsController.postServiceRequest
);

router.get(
  "/service-requests",
  serviceRequestValidations.GET_ALL_SERVICE_REQUESTS,
  ServiceRequestsController.getAllServiceRequests
);
router.patch(
  "/service-requests/:id",
  serviceRequestValidations.PATCH_SERVICE_REQUEST,
  ServiceRequestsController.patchServiceRequest
);

router.get(
  "/service-requests/:id",
  ServiceRequestsController.getServiceRequestById
);

router.get(
  "/service-requests-status",
  ServiceRequestsController.getServiceRequestsStatus
);

module.exports = router;
