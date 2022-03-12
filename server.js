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
var uploadRoutes=require('./routes/uploadRoutes');
var mailRoutes=require('./routes/mailRoutes')
var adminRoutes=require('./routes/adminRoutes')
var customerRoutes=require('./routes/customerRoutes');
const accessTokenMiddleware = require('./middlewares/accessTokenMiddleware');

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
 app.use(require('morgan')('combined'));
 app.use((req,res,next)=>{ //cors browser security mechansim unlinke postman
  res.header("Access-Control-Allow-Origin","*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  if(req.method==='OPTIONS'){ //you can't avoid to check 
    res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
    return res.status(200).json({});
  }
  next();
});

 app.use('/api/v1/auth',authRoutes);
 app.use('/api/v1/mail',mailRoutes);
 app.use('/api/v1/customer',accessTokenMiddleware,(req,res,next)=>{
  if(req.isAuth===false){
    res.json({
      success:false,
      data:{

        message:"Unauthorized"
      }
    })
  }else
  next()
},customerRoutes);
 app.use('/api/v1/uploads',accessTokenMiddleware,(req,res,next)=>{
  if(req.isAuth===false){
    res.json({
      success:false,
      data:{
        message:"Unauthorized"
      }
    })
  }
},uploadRoutes);
 app.use('/api/v1/admin/',accessTokenMiddleware,(req,res,next)=>{
  if(req.isAuth===false){
    res.json({
      success:false,
      data:{
        message:"Unauthorized"
      }
    })
  }
},adminRoutes);
 
// DATABASE CONNECTIVITY AND SERVER INITIALIZATION
mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>app.listen(PORT,()=>console.log("Server Online")))
.catch(err=>console.log("ERROR",err))


