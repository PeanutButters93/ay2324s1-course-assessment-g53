import jwt from "jsonwebtoken";

const secretKey = "yourSecretKey"

export const signJsonWebToken = (user) => {
  return jwt.sign(user, secretKey);
};

export const verifyJsonWebToken = (token) => {
  return jwt.verify(token, secretKey);
};