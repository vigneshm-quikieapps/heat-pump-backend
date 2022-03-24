/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const { Router } = require("express");
const express = require("express");
const router = express.Router();
const ServiceRequestNotesController = require("../controllers/service-requests/serviceRequestsNotesController");
const { serviceRequestNotesValidations } = require("../validations");

router.post(
  "/service-requests-notes",
  serviceRequestNotesValidations.CHECK_SRID,
  ServiceRequestNotesController.postServiceRequestNote
);

router.get(
  "/service-requests-notes",
  ServiceRequestNotesController.getAllServiceRequestNotes
);

module.exports = router;
