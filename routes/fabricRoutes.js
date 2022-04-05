/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

 const express = require("express");
 const { check, body } = require("express-validator");
 const router = express.Router();
const fabricRouter=require('../controllers/fabric/fabricController')

 router.post('/fabric-details',fabricRouter.createFabric)
 router.get('/fabric-details',fabricRouter.getAllFabricFromType)


 module.exports=router;