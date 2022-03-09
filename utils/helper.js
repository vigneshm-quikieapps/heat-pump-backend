const jwt = require("jsonwebtoken");

function getJwtToken(payload = {}) {
  const token = jwt.sign(payload, "secret_key", {
    expiresIn: "12hr",
  });
  return token;
}

module.exports = { getJwtToken };
