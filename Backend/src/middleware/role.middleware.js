import ApiError from "../utils/ApiError.js";

/**
 * Role authorization middleware factory
 * @param  {...string} roles Allowed roles ('citizen', 'worker', 'admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "User is not authenticated."));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource.`
        )
      );
    }

    next();
  };
};

export const requireAdmin = authorizeRoles("admin");
export const requireWorker = authorizeRoles("worker", "admin");
export const requireCitizen = authorizeRoles("citizen", "worker", "admin");

export default {
  authorizeRoles,
  requireAdmin,
  requireWorker,
  requireCitizen,
};
