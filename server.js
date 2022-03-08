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
 var jwt = require('jsonwebtoken');
 var database = require('./config/database');
 
 var morgan = require('morgan');
 var multer = require('multer');
 
 
 var authRoutes=require('./routes/authRoutes');
//  var users = require('./routes/users');

 
 
 var app = express();
 global.__base = __dirname + "/"
 var swaggerJsDoc = require('swagger-jsdoc');
 var swaggerconf = require('./config/swaggerConfig');
 
 
 var swaggerSpec = swaggerJsDoc(swaggerconf.swaggerOptions);
 // serve swagger
 app.get('/swagger.json', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(swaggerSpec);
 });
 
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));
 
 app.use(require('morgan')('short'));

//  app.set('view engine', 'jade');
//  app.use(authRoutes);
 
//  app.use('/users', users);
 

//  app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//  });
 
 
mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>app.listen(4000,()=>console.log("Server Online")))
.catch(err=>console.log("ERROR",err  ))

 



 
//  dbConnect.then( function(db){
//    console.log("Connection is Okay for database", db);
//  });
 
//  console.log("this is db connection", database.dbConnection);
 
//  mongoose.connect(database.dbConnection, { useMongoClient: true })
//  .then(()=> console.log('connection successfull'))
//  .catch((err)=> console.console.error(err));
 
 // error handler
 app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};
  
   // render the error page
   res.status(err.status || 500);
   res.render('error');
 });
 
//  app.listen(3000);
