const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();
const customerController = require('../controllers/customer/customerController');

router.post('/create-service-request',
[
    body('priority').isInt({min:1,max:3}).withMessage('Please enter valid priority in range [1-4]')
]
,customerController.postServiceRequest)


module.exports=router;