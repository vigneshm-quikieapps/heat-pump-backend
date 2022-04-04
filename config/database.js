/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require("dotenv").config();
var dbConn =
  "mongodb+srv://heatpump:tfb30fbNOWxf6Xld@cluster0.t8ibh.mongodb.net/heatpump?retryWrites=true&w=majority";
console.log(dbConn);
module.exports = {
  secret: "expressapitest",
  dbConnection: dbConn,
};
