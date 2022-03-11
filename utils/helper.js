const jwt = require("jsonwebtoken");

function getJwtToken(payload = {},expiresIn="12hr") {
  const token = jwt.sign(payload, "secret_key", {
    expiresIn: expiresIn
  });
  return token;
}

module.exports = { getJwtToken };
