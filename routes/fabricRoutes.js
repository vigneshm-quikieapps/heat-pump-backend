/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const fabricRouter = require("../controllers/fabric/fabricController");

router.post("/fabric-details", fabricRouter.createFabric);
router.get("/fabric-details", fabricRouter.getAllFabricFromType);
router.get("/fabric-details-single",fabricRouter.getFabric);
router.patch("/fabric-details",fabricRouter.patchFabric);
router.delete("/fabric-details",fabricRouter.deleteFabric);
module.exports = router;
