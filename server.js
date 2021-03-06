/**
 * Heat-Pump
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022.
 * COPYRIGHT NOTICE:
 * Copyright (c) 2022 Quikieapps,
 * Bangalore, India.
 * All Rights Reserved.
 * This software is the confidential and proprietary information of
 * Quikieapps ("Confidential Information"). You shall
 * not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered
 * into with Quikieapps.
 */

// console.log = function () {};
var express = require("express");
var path = require("path");
var fs = require("fs");

var cors = require("cors");
const ruid = require("express-ruid");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var database = require("./config/database");
var morgan = require("morgan");
var multer = require("multer");
var helmet = require("helmet");
var rfs = require("rotating-file-stream"); // version 2.x

// SWAGGER IMPORTS
var swaggerJsDoc = require("swagger-jsdoc");
var swaggerconf = require("./config/swaggerConfig");
var swaggerSpec = swaggerJsDoc(swaggerconf.swaggerOptions);

// ROUTES
var authRoutes = require("./routes/authRoutes");

var adminRoutes = require("./routes/adminRoutes");

var jobRoutes = require("./routes/jobRoutes");

var userRoutes = require("./routes/userRoutes");

var fabricRoutes = require("./routes/fabricRoutes");

var quoteRoutes = require("./routes/quoteRoutes");

var commonRoutes = require("./routes/commonRoutes");
var servicesRoutes = require("./routes/servicesRoutes");
var serviceRequestNotesRoutes = require("./routes/serviceRequestNotesRoutes");

const accessTokenMiddleware = require("./middlewares/accessTokenMiddleware");
const unauthourizedMiddleware = require("./middlewares/unauthorizedMiddleware");
const corsMiddleware = require("./middlewares/corsMiddleware");
const { addColors } = require("winston/lib/winston/config");
const { myCache } = require("./utils/cache");

// DECLARATIONS
var app = express();
const PORT = process.env.PORT || 3000;
global.__base = __dirname + "/";

app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

const corsOpts = {
  origin: true,
  credentials:true,
  methods: ["GET", "POST", "PATCH","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
// app.use((req,res,next)=>{ //cors browser security mechansim 
//   res.header("Access-Control-Allow-Origin","*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With,Content-Type,Accept,Authorization");
//   if(req.method==='OPTIONS'){ //you can't avoid to check 
//     res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET')
//     return res.status(200).json({});
//   }
//   next();
// });

app.use(cors(corsOpts));
app.use(helmet());
app.use(ruid());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});
app.use(
  morgan(
    ':res[request-id] => :remote-addr - :remote-user [:date[clf]] "method :url HTTP/:http-version" :status :res[content-length]',
    { stream: accessLogStream }
  )
);
//  app.use(corsMiddleware);
app.use("/api/v1/auth", authRoutes);
app.use(
  "/api/v1/admin",
  accessTokenMiddleware,
  unauthourizedMiddleware,
  adminRoutes
);
app.use(
  "/api/v1/common",
  accessTokenMiddleware,
  unauthourizedMiddleware,
  commonRoutes
);
app.use(
  "/api/v1/services",
  accessTokenMiddleware,
  unauthourizedMiddleware,
  servicesRoutes,
  serviceRequestNotesRoutes,
  fabricRoutes,
  quoteRoutes,
  jobRoutes,
  userRoutes
);

app.get(test = "/api/v1/test", (req, res) => {
  res.send("Hello World");
});

// DATABASE CONNECTIVITY AND SERVER INITIALIZATION
mongoose
  .connect(database.dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response)=>{
  //  myCache.flushall();
  })
  .catch((err) => {
    console.log(err);
    if (err.code === "ECONNREFUSED")
      console.log(
        "Failed to Connect with MongoDB Please check your Internet Connection"
      );
    else console.log("ERORR", err);
  });
// .then(result=>app.listen(PORT,()=>console.log("Server Online")))

module.exports = app;
