import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

const rawJwtSecret = process.env.JWT_SECRET;
if (isProduction) {
  if (!rawJwtSecret || typeof rawJwtSecret !== "string" || rawJwtSecret.trim().length < 32) {
    throw new Error(
      "FATAL SECURITY CONFIGURATION ERROR: JWT_SECRET environment variable is missing, empty, or too weak for production (minimum 32 characters required). Application cannot start safely."
    );
  }
}

export const ENV = {
  NODE_ENV,
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/civicvision",
  JWT_SECRET: rawJwtSecret || (isProduction ? "" : "dev_jwt_secret_road2solution_local_testing_only_32_chars"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_URL: (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, ""),
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || "chitranshkumar730@gmail.com").trim().toLowerCase(),
  ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD || "",
  AI_MODEL_SERVICE_URL: (process.env.AI_MODEL_SERVICE_URL || process.env.AI_SERVICE_URL || "http://127.0.0.1:8000").replace(/\/+$/, ""),
};

export default ENV;

