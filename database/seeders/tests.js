/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Users = require("../../models/users.model");
const database = require("../../config/database");
const serviceRequestModel = require("../../models/service-request.model");
const fabricModels = require("../../models/fabric.models");

mongoose
  .connect(database.dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log("ERROR", err));

const seedDB = async () => {
  // await Users.deleteMany({});
  await fabricModels.updateMany(
    {},
    {
      $set: {
        //    password:'$2b$12$73OuDYiLGq3drzt7i.vwAurojQ9rmBGulKo.w8L9DR9ec/T7u1trC'
        status: 1,
      },
    }
  );
};

seedDB()
  .then(() => {
    console.log("SEEDING SUCCESSFULLY COMPLETED");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("FAILED TO SEED THE ADMIN USERS", err);
  });
