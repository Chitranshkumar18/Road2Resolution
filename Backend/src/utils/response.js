export const successResponse = (res, statusCode = 200, message = "Success", data = null) => {
  const responseBody = {
    success: true,
    message,
    ...(data !== null && typeof data === "object" && !Array.isArray(data) ? data : { data }),
  };
  return res.status(statusCode).json(responseBody);
};

export const errorResponse = (res, statusCode = 500, message = "Server Error", errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default {
  successResponse,
  errorResponse,
};
