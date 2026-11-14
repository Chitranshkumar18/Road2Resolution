import ApiError from "../utils/ApiError.js";
import { ENV } from "../config/env.js";

/**
 * Centralized error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose Bad ObjectId CastError
  if (err.name === "CastError") {
    const message = `Resource not found with ID of ${err.value}`;
    error = new ApiError(404, message);
  }

  // Handle Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const message = `Duplicate value entered for '${field}'. Please use another value.`;
    error = new ApiError(409, message);
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(", "), messages);
  }

  // Handle JWT Error
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid authentication token.");
  }

  // Handle JWT Expired Error
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Authentication token has expired. Please login again.");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
    ...(ENV.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
