import User from "../models/User.js";
import Issue from "../models/Issue.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";
import { sanitizeUser, calculateWorkerStats } from "../utils/helpers.js";
import { uploadImage } from "./cloudinary.service.js";
import { ENV } from "../config/env.js";

/**
 * Registers a new citizen or worker account
 */
export const register = async (userData) => {
  const { name, email, password, role = "citizen", ...rest } = userData;

  const cleanEmail = (email || "").trim().toLowerCase();

  // Admin registration check
  if (role === "admin") {
    throw new ApiError(
      400,
      "Admin registration is not permitted. Admin accounts are provisioned exclusively by system administrators."
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw new ApiError(409, "An account with this email address already exists.");
  }

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password,
    role: role || "citizen",
    ...rest,
  });

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  const token = generateToken(user._id, user.role);

  return {
    user: sanitized,
    token,
  };
};

/**
 * Authenticates user and returns JWT token
 */
export const login = async (email, password, preferredRole = "citizen") => {
  const cleanEmail = (email || "").trim().toLowerCase();

  // Admin email verification
  if (preferredRole === "admin" && cleanEmail !== ENV.ADMIN_EMAIL.toLowerCase()) {
    throw new ApiError(
      403,
      "Invalid admin email address. Admin access is restricted to the authorized administrator."
    );
  }

  const user = await User.findOne({ email: cleanEmail }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account has been suspended.");
  }

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  const token = generateToken(user._id, user.role);

  return {
    user: sanitized,
    token,
  };
};

/**
 * Gets currently authenticated user by ID
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  return sanitized;
};

/**
 * Updates user profile details
 */
export const updateProfile = async (userId, updates = {}) => {
  // Prevent direct modification of restricted fields
  delete updates.password;
  delete updates.role;
  delete updates._id;

  if (updates.avatar && typeof updates.avatar === "string" && (updates.avatar.startsWith("data:") || updates.avatar.startsWith("http"))) {
    try {
      updates.avatar = await uploadImage(updates.avatar, "civicvision/avatars");
    } catch (e) {
      console.warn("Avatar upload processing note:", e.message);
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const sanitized = sanitizeUser(user);
  if (user.role === "worker") {
    const issues = await Issue.find({}).populate("repairs").lean();
    const stats = calculateWorkerStats(issues, user);
    Object.assign(sanitized, stats);
  }
  return sanitized;
};

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
};
