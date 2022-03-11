const jwt = require('jsonwebtoken');
const {NOT_FOUND_ACCESS_TOKEN}=require('../utils/constants')


module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    req.isAuth=false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  
  try {
    decodedToken = jwt.verify(token,'secret_key');
   
  } catch (err) {

    req.isAuth=false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth=false;
    return next();
  }
  req.userId = decodedToken.id
  req.isAuth=true;
  next();
};