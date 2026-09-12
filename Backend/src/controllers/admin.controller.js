import asyncHandler from "../utils/asyncHandler.js";
import Department from "../models/Department.js";
import { DEPARTMENTS } from "../utils/constants.js";
import analyticsService from "../services/analytics.service.js";
import issueService from "../services/issue.service.js";

export const getStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  return res.status(200).json(stats);
});

export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().lean();
  if (departments && departments.length > 0) {
    return res.status(200).json(departments);
  }
  return res.status(200).json(DEPARTMENTS);
});

export const assignDepartment = asyncHandler(async (req, res) => {
  const { issueId, departmentId, officerName } = req.body;
  const deptObj = DEPARTMENTS.find((d) => d.id === departmentId);
  const deptName = deptObj?.name || departmentId;

  const updatedIssue = await issueService.updateIssueStatus(
    issueId,
    "ASSIGNED",
    `Assigned to ${deptName} (${officerName || "Duty Engineer"})`,
    officerName,
    deptName
  );

  return res.status(200).json({
    success: true,
    message: `Issue assigned to ${deptName}`,
    issue: updatedIssue,
  });
});

export const getRiskPredictions = asyncHandler(async (req, res) => {
  const riskData = await analyticsService.getRiskPredictionData();
  return res.status(200).json(riskData);
});

export default {
  getStats,
  getDepartments,
  assignDepartment,
  getRiskPredictions,
};
