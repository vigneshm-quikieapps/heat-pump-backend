/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require("dotenv").config();
var dbConn = process.env.MONGODB_URI;
module.exports = {
  secret: "expressapitest",
  dbConnection: dbConn,
};
