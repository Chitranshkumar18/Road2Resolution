import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (userId, role = "citizen") => {
  return jwt.sign(
    {
      id: userId,
      role: role,
    },
    ENV.JWT_SECRET,
    {
      expiresIn: ENV.JWT_EXPIRES_IN,
    }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
};

export default generateToken;
