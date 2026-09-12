import ApiError from "../utils/ApiError.js";

/**
 * 404 Route Not Found middleware
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route Not Found`);
  next(error);
};

export default notFound;
