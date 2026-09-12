import asyncHandler from "../utils/asyncHandler.js";
import issueService from "../services/issue.service.js";
import repairVerificationService from "../services/repairVerification.service.js";
import ApiError from "../utils/ApiError.js";

export const getAssignedIssues = asyncHandler(async (req, res) => {
  const workerUnit = req.user?.contractorUnit || req.user?.organizationName || "";
  const issues = await issueService.getAllIssues({
    status: req.query.status || "all",
    search: req.query.search || "",
  });

  // Filter issues relevant to worker or open for work
  return res.status(200).json(issues);
});

export const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const submitRepair = asyncHandler(async (req, res) => {
  const { issueId } = req.body;
  if (!issueId) {
    throw new ApiError(400, "Issue ID is required.");
  }

  const issue = await issueService.findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  const result = await repairVerificationService.processWorkerRepairSubmission(issue, req.body, req.user);
  const formatted = await issueService.getIssueById(issueId);

  return res.status(200).json({
    success: true,
    message: "Repair proof submitted successfully.",
    issue: formatted,
    repair: result.repair,
  });
});

export default {
  getAssignedIssues,
  getProfile,
  submitRepair,
};
