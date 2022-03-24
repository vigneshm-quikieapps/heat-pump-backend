const { check, body } = require("express-validator");

const POST_SERVICE_REQUEST = [
  body("priority")
    .isInt({ min: 1, max: 3 })
    .withMessage("Please enter valid priority in range [1-4]"),
  body("title").notEmpty().withMessage("Please Enter title of service request"),
  check("attachments")
    .if(body("attachments").exists())
    .notEmpty()
    .withMessage("Please enter pdf files files"),
];

const GET_ALL_SERVICE_REQUESTS = [
  check(["perPage", "page"]).isInt().withMessage("Please enter valid Number"),
  check(["status"]).notEmpty().withMessage("Please enter valid status "),
];

const PATCH_SERVICE_REQUEST = [
  body("attachments")
    .notEmpty()
    .withMessage("Please don't pass attachaments here pass uattachments"),
];

module.exports = {
  POST_SERVICE_REQUEST,
  GET_ALL_SERVICE_REQUESTS,
  PATCH_SERVICE_REQUEST,
};
