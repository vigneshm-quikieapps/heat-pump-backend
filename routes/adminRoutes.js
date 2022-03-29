/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const auth = require("../controllers/admin/adminController");
const AdminController = require("../controllers/admin/adminController");

router.get(
  "/service-requests-count",
  AdminController.getServiceRequestsStatusAdminSide
);
router.get("/service-requests", AdminController.getAllServiceRequestsAdminSide2);
module.exports = router;
