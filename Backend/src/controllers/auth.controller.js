import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json({
    success: true,
    message: "User registered successfully.",
    token: result.token,
    user: result.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const result = await authService.login(email, password, role);
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    token: result.token,
    user: result.user,
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);
  return res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await authService.updateProfile(req.user._id, req.body);
  return res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});

export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
};
