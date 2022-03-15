const express = require("express");
const router = express.Router();
const jobsController=require('../controllers/jobs/jobs.controller')


router.post('/jobs',jobsController.postJob)
router.get('/jobs',jobsController.getAllJobs)

module.exports=router;