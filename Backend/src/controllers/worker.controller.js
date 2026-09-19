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

  // Reference coordinates for worker's operational region
  const workerLat = Number(req.query.lat) || Number(req.user?.lat) || 28.6139;
  const workerLng = Number(req.query.lng) || Number(req.user?.lng) || 77.2090;

  // Server-side authorization & data filtering boundary
  const authorizedIssues = issues.filter((issue) => {
    // 1. Issue explicitly assigned to worker's contractor unit or organization
    const issueOrgId = issue.assignedOrgId ? String(issue.assignedOrgId) : "";
    const issueOrgName = (issue.assignedOrgName || "").trim().toLowerCase();

    if (workerOrgId && issueOrgId && workerOrgId === issueOrgId) return true;
    if (workerUnit && issueOrgName && (workerUnit === issueOrgName || issueOrgName.includes(workerUnit))) return true;
    if (workerOrgName && issueOrgName && (workerOrgName === issueOrgName || issueOrgName.includes(workerOrgName))) return true;

    // 2. Issue actively worked on / submitted by this specific worker
    const submissionWorkerId = String(issue.workerSubmission?.worker?._id || issue.workerSubmission?.worker || issue.workerSubmission?.workerId || "").trim();
    if (workerId && submissionWorkerId && workerId === submissionWorkerId) return true;

    const submissionEmail = (issue.workerSubmission?.workerEmail || "").toLowerCase().trim();
    if (workerEmail && submissionEmail && workerEmail === submissionEmail) return true;

    const respName = (issue.responsibleName || "").trim().toLowerCase();
    if (workerName && respName && workerName === respName) return true;

    // 3. Open / Verified issues in worker's operational jurisdiction / 50 km radius available for work
    const isOpenOrVerified = issue.status === "VERIFIED" || issue.status === "ASSIGNED" || issue.status === "OPEN" || issue.status === "IN_PROGRESS";
    if (isOpenOrVerified) {
      const issueZone = (issue.location?.zone || "").trim().toLowerCase();
      if (workerZone && issueZone && workerZone === issueZone) return true;

      const issueLat = Number(issue.location?.lat);
      const issueLng = Number(issue.location?.lng);
      if (!isNaN(issueLat) && !isNaN(issueLng)) {
        const distKm = calculateDistanceKm(workerLat, workerLng, issueLat, issueLng);
        if (distKm <= MAX_WORKER_RADIUS_KM) return true;
      }
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

    if (isAssignedToOtherOrg && !isOwnTask) {
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

