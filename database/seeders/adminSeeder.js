require('dotenv').config();
const mongoose = require("mongoose");

const Users=require('../../models/users.model')
const database=require('../../config/database');
 
console.log(database);
mongoose.connect(database.dbConnection, {useNewUrlParser: true, useUnifiedTopology: true})
.catch(err=>console.log("ERROR",err  ))

const admins=[{
    name:'admin',
    email:'admin@gmail.com',
    password:'123'
}];

const seedDB=async ()=>{
 await Users.deleteMany({});
 await Users.insertMany(admins);
}

seedDB().then(()=>{
    console.log("OK")
    mongoose.connection.close();
})
.catch(err=>{
    console.log("FAILED TO SEED THE ADMIN USERS",err);
})