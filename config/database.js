require('dotenv').config();
// let dbConn =  'mongodb://'+ process.env.DB_USER + ":" + process.env.DB_PASS + "@" + process.env.DB_HOST +":" + process.env.DB_PORT + "/" + process.env.DB_NAME;
var dbConn="mongodb+srv://testdb:UmsB51hkBUsQioHl@cluster0.v48mv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
module.exports = {
  'secret': 'expressapitest',
  'dbConnection': dbConn
}