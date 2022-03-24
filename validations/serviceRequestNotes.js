const { check, body } = require("express-validator");

const CHECK_ATTACHEMNT = body("attachments")
  .notEmpty()
  .withMessage("Please pass uattachments");
const CHECK_SRID = body("srid")
  .notEmpty()
  .withMessage("Please enter service_request_id");
const CHECK_NRID = body("nrid")
  .notEmpty()
  .withMessage("Please enter service_request_id");

module.exports = {
  CHECK_ATTACHEMNT,
  CHECK_SRID,
  CHECK_NRID,
};
