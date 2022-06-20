/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require("dotenv").config();
var dbConn =
  "mongodb+srv://heat_pump:QO3wuelfqfXVjv2Z@cluster0.p4kfv.mongodb.net/Heat_Pump?retryWrites=true&w=majority";

module.exports = {
  secret: "expressapitest",
  dbConnection: dbConn,
};

/**
 * new cluster
 * mongodb+srv://heat_pump:QO3wuelfqfXVjv2Z@cluster0.p4kfv.mongodb.net/test?retryWrites=true&w=majority
 * 
 * old cluster
  "mongodb+srv://heatpump:tfb30fbNOWxf6Xld@cluster0.t8ibh.mongodb.net/heatpump?retryWrites=true&w=majority";
 * 
 */