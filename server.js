/**
 * Heat-Pump 
 * @ All rights reserved 
 * [Copying this content without the author is strictly prohibited
 * and shall be considered an punishable offence under aegis of Heat-Pump]
 */


var express = require('express');
var path = require('path');
var fs=require('fs');
// var logger = require('morgan');
const ruid = require('express-ruid');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var database = require('./config/database');
var morgan = require('morgan');
var multer = require('multer');
var helmet=require('helmet')
var rfs = require('rotating-file-stream') // version 2.x
// var addRequestId = require('express-request-id')();

// SWAGGER IMPORTS
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerconf = require('./config/swaggerConfig');
var swaggerSpec = swaggerJsDoc(swaggerconf.swaggerOptions);


// ROUTES
var authRoutes=require('./routes/authRoutes');

var adminRoutes=require('./routes/adminRoutes')

var jobRoutes=require('./routes/jobRoutes');

var userRoutes=require('./routes/userRoutes')

var commonRoutes=require('./routes/commonRoutes');
var servicesRoutes=require('./routes/servicesRoutes');
var serviceRequestNotesRoutes=require('./routes/serviceRequestNotesRoutes')
// var {logger}=require('./utils/logger')


const accessTokenMiddleware = require('./middlewares/accessTokenMiddleware');
const unauthourizedMiddleware=require('./middlewares/unauthorizedMiddleware');
const corsMiddleware=require('./middlewares/corsMiddleware')

// DECLARATIONS
var app = express();
const PORT = process.env.PORT || 3000;
global.__base = __dirname + "/"

app.get('/swagger.json', function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(swaggerSpec);
 });


 app.use(helmet()); 
 app.use(ruid())
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(cookieParser());
 app.use(express.static(path.join(__dirname, 'public')));
 var accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
 app.use(morgan(':res[request-id] => :remote-addr - :remote-user [:date[clf]] "method :url HTTP/:http-version" :status :res[content-length]',{stream:accessLogStream}));
 app.use(corsMiddleware);
 app.use('/api/v1/auth',authRoutes);
 app.use('/api/v1/common',accessTokenMiddleware,unauthourizedMiddleware,commonRoutes);
 app.use('/api/v1/services',accessTokenMiddleware,unauthourizedMiddleware,servicesRoutes,serviceRequestNotesRoutes,jobRoutes);
app.use('/api/v1/services',userRoutes)
// DATABASE CONNECTIVITY AND SERVER INITIALIZATION
mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>app.listen(PORT,()=>console.log("Server Online")))
.catch(err=>console.log("ERROR",err))


