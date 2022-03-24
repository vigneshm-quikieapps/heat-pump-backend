/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const auth = require("../controllers/admin/adminController");
const ServiceRequestsController = require("../controllers/service-requests/serviceRequestsController");

router.get(
    "/service-requests-count",
    ServiceRequestsController.getServiceRequestsStatusAdminSide
  );  
router.get('/service-requests',ServiceRequestsController.getAllServiceRequestsAdminSide)
module.exports = router;
