/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

const fs = require("fs");
require("dotenv").config();
const { validationResult } = require("express-validator");
const aws = require("aws-sdk");
const { default: axios } = require("axios");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCSES_KEY,
  signatureVersion: process.env.AWS_S3_SIGNATURE_VERSION,
  endpoint: process.env.AWS_S3_END_POINT,
  region: process.env.AWS_S3_REGION,
});

exports.uploadDocController = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: errors.array(),
    });
  }
  const userId = req.decodedAccessToken.id;

  let paths = req.files.map((e) => e.path);

  var name = paths[0].split("/")[1];

  var key = `${userId}/${name}`;
  var URL = "";
  try {
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "heatpump-bucket",
        ContentType: "pdf",
        Key: key,
      },
      (err, url) => {
        URL = url;
        if (err) {
          res.send({ err });
        } else {
          fs.readFile(paths[0], (err, file) => {
            axios
              .put(URL, file, {
                headers: {
                  "Content-Type": "pdf",
                },
              })
              .then((rep) =>
                res.send({
                  success: true,
                  data: {
                    message: [key],
                  },
                })
              )
              .catch((err) => {
                res.json({
                  err: err.data,
                });
              });
          });
        }
      }
    );
  } catch (err) {
    res.json({ err });
  }
};

exports.getDocController = (req, res, next) => {
  const { fp } = req.query;
  const userId = req.decodedAccessToken.id;
  try {
    s3.getObject(
      {
        Bucket: "heatpump-bucket",
        Key: `${fp}`,
      },
      (err, file) => {
        if (err) {
          res.json({
            success: false,
            data: {
              message: "Supplied File is unavailable in our server",
            },
          });
        } else {
          const type = fp.split(".")[1];
          var contentType =
            type === "pdf" ? "application/pdf" : `image/${type}`;
          res.setHeader("Content-Type", contentType);
          res.send(file.Body);
        }
      }
    );
  } catch (err) {
    res.json({
      success: false,
      data: {
        message: "Supplied File is unavailable in our server",
      },
    });
  }
  // next();
};
