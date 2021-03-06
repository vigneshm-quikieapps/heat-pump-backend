/**
 * @author Siddharth_Kumar_Yadav
 * @Since 07 Mar 2022
 */

var swaggerconf = {
  swaggerOptions: {
    swaggerDefinition: {
      info: {
        title: process.env.SWAGGER_TITLE,
        version: process.env.SWAGGER_VERSION,
        decription: process.env.SWAGGER_DESC,
      },
    },
    apis: ["./routes/*.js", "./models/*.js", "./routes/**/*.js"],
  },
};

module.exports = swaggerconf;
