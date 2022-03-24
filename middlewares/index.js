/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const otpTokenMiddleware = require("./otpTokenMiddleware");
const resetTokenMiddleware = require("./resetTokenMiddleware");
const confirmPasswordMiddleware = require("./confirmPasswordMiddleware");
module.exports = {
  otpTokenMiddleware,
  resetTokenMiddleware,
  confirmPasswordMiddleware,
};
