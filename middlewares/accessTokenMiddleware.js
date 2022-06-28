/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const consola = require("consola");
const jwt = require("jsonwebtoken");
const { NOT_FOUND_ACCESS_TOKEN } = require("../utils/constants");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedAccessToken;
  console.log(token);

  try {
    decodedAccessToken = jwt.verify(token, "secret_key");
  } catch (err) {
    console.error(err);
    req.isAuth = false;
    return next();
  }
  if (!decodedAccessToken) {
    req.isAuth = false;
    return next();
  }

  
  req.decodedAccessToken = decodedAccessToken;
  req.isAuth = true;
  next();
};
