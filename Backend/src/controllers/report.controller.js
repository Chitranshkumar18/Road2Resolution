import asyncHandler from "../utils/asyncHandler.js";
import issueService from "../services/issue.service.js";

export const submitReport = asyncHandler(async (req, res) => {
  const created = await issueService.createIssue(req.body, req.user);
  return res.status(201).json({
    success: true,
    message: "Report submitted successfully.",
    issue: created,
  });
});

export const exportReports = asyncHandler(async (req, res) => {
  const format = req.query.format || "json";
  const issues = await issueService.getAllIssues();

  return res.status(200).json({
    exportDate: new Date().toISOString(),
    format,
    totalIssues: issues.length,
    data: issues,
  });
});

export default {
  submitReport,
  exportReports,
};
