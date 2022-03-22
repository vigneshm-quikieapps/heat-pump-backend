const { Router } = require("express");
const express = require("express");
const router = express.Router();
const ServiceRequestNotesController=require('../controllers/service-requests/serviceRequestsNotesController')
const {serviceRequestNotesValidations}=require('../validations')


router.post('/service-requests-notes',
serviceRequestNotesValidations.CHECK_SRID
,ServiceRequestNotesController.postServiceRequestNote)


router.get('/service-requests-notes',ServiceRequestNotesController.getAllServiceRequestNotes)

// router.patch('/service-requests-notes-update',serviceRequestNotesValidations.CHECK_NRID,ServiceRequestNotesController.patchServiceRequestNotesUpdate)

// router.patch('/service-requests-notes-update-attachments',serviceRequestNotesValidations.CHECK_NRID,ServiceRequestNotesController.patchServiceRequestNotesAttachmentUpdate)

module.exports=router;