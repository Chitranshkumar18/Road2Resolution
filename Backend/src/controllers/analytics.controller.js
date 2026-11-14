import asyncHandler from "../utils/asyncHandler.js";
import analyticsService from "../services/analytics.service.js";

export const getTrends = asyncHandler(async (req, res) => {
  const timeframe = req.query.timeframe || "monthly";
  const trends = await analyticsService.getIssueTrends(timeframe);
  return res.status(200).json(trends);
});

export const getSeverityBreakdown = asyncHandler(async (req, res) => {
  const severities = await analyticsService.getSeverityBreakdown();
  return res.status(200).json(severities);
});

export const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const categories = await analyticsService.getCategoryBreakdown();
  return res.status(200).json(categories);
});

export const getDepartmentWorkload = asyncHandler(async (req, res) => {
  const workloads = await analyticsService.getDepartmentWorkload();
  return res.status(200).json(workloads);
});

export default {
  getTrends,
  getSeverityBreakdown,
  getCategoryBreakdown,
  getDepartmentWorkload,
};
