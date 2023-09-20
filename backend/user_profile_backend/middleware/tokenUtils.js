const jwt = require("jsonwebtoken");

const secretKey = "yourSecretKey"

const signJsonWebToken = (user) => {
  return jwt.sign(user, secretKey);
};

const verifyJsonWebToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = { signJsonWebToken, verifyJsonWebToken }; // for testing