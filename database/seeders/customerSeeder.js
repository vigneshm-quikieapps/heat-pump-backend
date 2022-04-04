/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Users = require("../../models/users.model");
const database = require("../../config/database");

mongoose
  .connect(database.dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log("ERROR", err));

console.log(database.dbConnection);

const customers = [];

for (var i = 0; i < 1000; i++) {
  const customer = {
    email: faker.internet.email(),
    password:
      "$2b$12$/nWaIBQ0fvOlVikwk8OgDeZFA7cgM8FPYlvhBaMddFtGUHapqUUym" /* 123456 */,
    name: faker.name.findName(),
    mobile: faker.phone.phoneNumber(),
    business_registered_name: faker.company.companyName(),
    business_trade_name: "RANDOM TRADE NAME",
    business_type: 1,
    address_1: faker.address.streetAddress(),
    address_2: faker.address.secondaryAddress(),
    country: faker.address.country(),
    city: faker.address.city(),
    postcode: faker.address.zipCode(),
    admin: false,
    status: 1,
  };

  customers.push(customer);
}

const seedDB = async () => {
  await Users.deleteMany({});
  await Users.insertMany(customers);
  await Users.insertMany([
    {
      email: "customer@gmail.com",
      password:
        "$2b$12$/nWaIBQ0fvOlVikwk8OgDeZFA7cgM8FPYlvhBaMddFtGUHapqUUym" /* 123456 */,
      name: faker.name.findName(),
      mobile: faker.phone.phoneNumber(),
      business_registered_name: faker.company.companyName(),
      business_trade_name: "RANDOM TRADE NAME",
      business_type: 1,
      address_1: faker.address.streetAddress(),
      address_2: faker.address.secondaryAddress(),
      country: faker.address.country(),
      city: faker.address.city(),
      postcode: faker.address.zipCode(),
      admin: false,
      status: 3,
    },
  ]);
};

seedDB()
  .then(() => {
    console.log("SEEDING SUCCESSFULLY COMPLETED");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("FAILED TO SEED THE ADMIN USERS", err);
  });
