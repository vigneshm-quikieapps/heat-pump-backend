/**
 * Heat-Pump 
 * @ All rights reserved 
 * [Copying this content without the author is strictly prohibited
 * and shall be considered an punishable offence under aegis of Heat-Pump]
 */


var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./config/database');
var morgan = require('morgan');
var multer = require('multer');


// SWAGGER IMPORTS
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerconf = require('./config/swaggerConfig');
var swaggerSpec = swaggerJsDoc(swaggerconf.swaggerOptions);


// ROUTES
var authRoutes=require('./routes/authRoutes');


// DECLARATIONS
var app = express();
const PORT = process.env.PORT || 3000;
global.__base = __dirname + "/"

 app.get('/swagger.json', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(swaggerSpec);
 });
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));
 app.use(require('morgan')('short'));
 app.use(authRoutes);
 
// DATABASE CONNECTIVITY AND SERVER INITIALIZATION
mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>app.listen(PORT,()=>console.log("Server Online")))
.catch(err=>console.log("ERROR",err  ))

 
//  // error handler
//  app.use(function(err, req, res, next) {
//    // set locals, only providing error in development
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//    // render the error page
//    res.status(err.status || 500);
//    res.render('error');
//  });
 
