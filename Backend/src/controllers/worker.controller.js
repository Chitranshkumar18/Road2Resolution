import asyncHandler from "../utils/asyncHandler.js";
import issueService from "../services/issue.service.js";
import repairVerificationService from "../services/repairVerification.service.js";
import ApiError from "../utils/ApiError.js";
import Issue from "../models/Issue.js";
import { sanitizeUser, calculateWorkerStats, calculateDistanceKm } from "../utils/helpers.js";

const MAX_WORKER_RADIUS_KM = 50;

export const getAssignedIssues = asyncHandler(async (req, res) => {
  const issues = await issueService.getAllIssues({
    status: req.query.status || "all",
    search: req.query.search || "",
  });

  // Admin users can inspect all issues
  if (req.user?.role === "admin") {
    return res.status(200).json(issues);
  }

  const workerId = String(req.user?._id || req.user?.id || "");
  const workerEmail = (req.user?.email || "").toLowerCase().trim();
  const workerName = (req.user?.name || "").trim().toLowerCase();
  const workerUnit = (req.user?.contractorUnit || "").trim().toLowerCase();
  const workerOrgName = (req.user?.organizationName || "").trim().toLowerCase();
  const workerOrgId = req.user?.organization ? String(req.user.organization) : "";
  const workerZone = (req.user?.zone || "").trim().toLowerCase();

  // Backward-compatible workerType resolution
  const effectiveWorkerType = req.user?.workerType || (
    req.user?.organization ||
    (req.user?.organizationName &&
      req.user?.organizationName !== "Independent Field Worker" &&
      req.user?.organizationName !== "Individual Worker / Public Person")
      ? "organization"
      : "individual"
  );

  // Reference coordinates for worker's operational region
  const workerLat = Number(req.query.lat) || Number(req.user?.lat) || 28.6139;
  const workerLng = Number(req.query.lng) || Number(req.user?.lng) || 77.2090;

  // Server-side authorization & data filtering boundary
  const authorizedIssues = issues.filter((issue) => {
    // 1. Issue actively worked on / submitted by this specific worker
    const submissionWorkerId = String(
      issue.workerSubmission?.worker?._id ||
      issue.workerSubmission?.worker ||
      issue.workerSubmission?.workerId ||
      ""
    ).trim();
    if (workerId && submissionWorkerId && workerId === submissionWorkerId) return true;

    const submissionEmail = (issue.workerSubmission?.workerEmail || "").toLowerCase().trim();
    if (workerEmail && submissionEmail && workerEmail === submissionEmail) return true;

    const respName = (issue.responsibleName || "").trim().toLowerCase();
    if (workerName && respName && workerName === respName) return true;

    const issueOrgId = issue.assignedOrgId ? String(issue.assignedOrgId).trim() : "";
    const issueOrgName = (issue.assignedOrgName || "").trim().toLowerCase();
    const hasOrgAssignment = Boolean(issueOrgId || issueOrgName);

    // 2. Organization Worker: Sees ALL organization-assigned complaints (and NEVER unassigned complaints)
    if (effectiveWorkerType === "organization") {
      return hasOrgAssignment;
    }

    // 3. Individual Worker: Sees ALL unassigned complaints (and NEVER organization-assigned complaints)
    if (effectiveWorkerType === "individual") {
      return !hasOrgAssignment;
    }

    return false;
  });

  return res.status(200).json(authorizedIssues);
});

export const getProfile = asyncHandler(async (req, res) => {
  const issues = await Issue.find({}).populate("repairs").lean();
  const stats = calculateWorkerStats(issues, req.user);
  const sanitized = sanitizeUser(req.user);
  if (sanitized) {
    Object.assign(sanitized, stats);
  }

  return res.status(200).json({
    success: true,
    user: sanitized,
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

  // Verify issue status permits repair submission
  if (issue.status === "RESOLVED" || issue.status === "CLOSED" || issue.status === "PENDING_VERIFICATION") {
    throw new ApiError(
      400,
      `Issue '${issueId}' is currently in '${issue.status}' status and cannot accept new repair submissions.`
    );
  }

  // Authorization check for workers
  if (req.user?.role === "worker") {
    const effectiveWorkerType = req.user?.workerType || (
      req.user?.organization ||
      (req.user?.organizationName &&
        req.user?.organizationName !== "Independent Field Worker" &&
        req.user?.organizationName !== "Individual Worker / Public Person")
        ? "organization"
        : "individual"
    );

    const workerOrgId = req.user.organization ? String(req.user.organization) : "";
    const workerUnit = (req.user.contractorUnit || "").trim().toLowerCase();
    const workerOrgName = (req.user.organizationName || "").trim().toLowerCase();
    const issueOrgId = issue.assignedOrgId ? String(issue.assignedOrgId) : "";
    const issueOrgName = (issue.assignedOrgName || "").trim().toLowerCase();

    const matchesOrgId = Boolean(issueOrgId && workerOrgId && issueOrgId === workerOrgId);
    const matchesOrgName = Boolean(
      issueOrgName &&
        workerOrgName &&
        (issueOrgName.includes(workerOrgName) || workerOrgName.includes(issueOrgName))
    );
    const matchesUnit = Boolean(
      issueOrgName &&
        workerUnit &&
        (issueOrgName.includes(workerUnit) || workerUnit.includes(issueOrgName))
    );

    const hasOrgAssignment = Boolean(issueOrgId || issueOrgName);
    const isAssignedToOtherOrg = hasOrgAssignment && !matchesOrgId && !matchesOrgName && !matchesUnit;

    const isOwnTask =
      (issue.responsibleName && issue.responsibleName.toLowerCase() === req.user.name?.toLowerCase()) ||
      (issue.workerSubmission?.workerId && String(issue.workerSubmission.workerId) === String(req.user._id));

    if (effectiveWorkerType === "individual" && hasOrgAssignment && !isOwnTask) {
      throw new ApiError(
        403,
        `Access forbidden: Individual workers cannot submit repairs for issues assigned to an organization (${issue.assignedOrgName}).`
      );
    }

    if (effectiveWorkerType === "organization" && isAssignedToOtherOrg && !isOwnTask) {
      throw new ApiError(
        403,
        `Access forbidden: You are not authorized to submit repairs for issues assigned to another contractor (${issue.assignedOrgName}).`
      );
    }
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

