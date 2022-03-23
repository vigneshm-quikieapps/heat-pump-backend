/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require('dotenv').config();
const mongoose = require("mongoose");

const Users=require('../../models/users.model')
const database=require('../../config/database');
 

mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.catch(err=>console.log("ERROR",err  ))

const admins=[{
    email: "admin@gmail.com",
    password: "$2b$12$/nWaIBQ0fvOlVikwk8OgDeZFA7cgM8FPYlvhBaMddFtGUHapqUUym",/* 123456 */
    name: "John Thomas",
    mobile: "9123456734",
    business_registered_name: "ADMIN",
    business_trade_name: "ADMIN",
    business_type: "ADMIN",
    address_1: "ADMIN",
    address_2: "ADMIN",
    country: "INDIA",
    city: "BHOPAL",
    postcode: "123456",
    admin: true,
    status:2
  }];



const seedDB=async ()=>{
 await Users.deleteMany({});
 await Users.insertMany(admins);
}

seedDB().then(()=>{
    console.log("SEEDING SUCCESSFULLY COMPLETED")
    mongoose.connection.close();
})
.catch(err=>{
    console.log("FAILED TO SEED THE ADMIN USERS",err);
})