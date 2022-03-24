/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobs/jobs.controller");

router.post("/jobs", jobsController.postJob);
router.get("/jobs", jobsController.getAllJobs);

module.exports = router;
