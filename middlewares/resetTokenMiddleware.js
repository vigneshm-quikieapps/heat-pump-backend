/**
 * Heat-Pump 
 * @ All rights reserved 
 * [Copying this content without the author is strictly prohibited
 * and shall be considered an punishable offence under aegis of Heat-Pump]
 */
 var express = require('express');
 var router = express.Router();
 var jwt = require('jsonwebtoken');
const { INVALID_RESET_TOKEN, NOT_FOUND_RESET_TOKEN } = require('../utils/constants');
 
 router.use((req,res,next) => {
    var token = req.body.reset_token || req.query.reset_token || req.headers['x-reset-token']
    if(token) {
      jwt.verify(token,'secret_key', (err, decoded) => {
         if(err) {
           return res.json({message:INVALID_RESET_TOKEN})
         } else {
           req.decodedResetToken = decoded;
           next();
         }
      });
    } else {
      return res.status(403).send({
        message: NOT_FOUND_RESET_TOKEN
      });
    }
 });
 
 module.exports = router;