/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const PASSWORD_CHANGED = "Password has been changed Successfully";
const IV_OTP_TOKEN = "Failed to authenticate with provided OTP Token";
const INVALID_RESET_TOKEN = "Failed to authenticate with provided Reset Token";
const INVALID_ACCESS_TOKEN = "Failed to authenticate with provided Token";

const NOT_FOUND_OTP_TOKEN = "No OTP Token provided";
const NOT_FOUND_RESET_TOKEN = "No Reset Token provied";
const NOT_FOUND_ACCESS_TOKEN = "No Access Token provied";

const USER_ALREADY_EXISTS =
  "Customer Account already exists with the provided email";
const USER_NOT_FOUND = "It appears that your email is not registered with us. If you'd like to register with us, use the Sign Up option below.";
const INVALID_CREDENTIALS = "Invalid Credentials";

const EMAIL_SENT = "Email has been successfully sent";
module.exports = {
  PASSWORD_CHANGED,
  IV_OTP_TOKEN,
  INVALID_RESET_TOKEN,
  NOT_FOUND_OTP_TOKEN,
  NOT_FOUND_RESET_TOKEN,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  EMAIL_SENT,
};
