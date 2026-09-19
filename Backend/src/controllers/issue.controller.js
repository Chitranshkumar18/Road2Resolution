import asyncHandler from "../utils/asyncHandler.js";
import issueService from "../services/issue.service.js";
import routingService from "../services/routing.service.js";
import repairVerificationService from "../services/repairVerification.service.js";
import ApiError from "../utils/ApiError.js";

export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await issueService.getAllIssues(req.query);
  return res.status(200).json(issues);
});

export const getIssueById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await issueService.getIssueById(id);
  return res.status(200).json({
    success: true,
    issue,
  });
});

export const createIssue = asyncHandler(async (req, res) => {
  const created = await issueService.createIssue(req.body, req.user);
  return res.status(201).json({
    success: true,
    message: "Civic hazard reported successfully.",
    issue: created,
  });
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note, assignedOfficer, department } = req.body;
  const updated = await issueService.updateIssueStatus(id, status, note, assignedOfficer, department);
  return res.status(200).json({
    success: true,
    message: `Issue status updated to ${status}.`,
    issue: updated,
  });
});

export const assignIssueToOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { organizationId, notes, assignedOfficer } = req.body;
  const updated = await issueService.assignIssueToOrganization(id, organizationId, notes, assignedOfficer);
  return res.status(200).json({
    success: true,
    message: "Issue assigned to organization successfully.",
    issue: updated,
  });
});

export const acceptWorkAsOrganization = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { workerInfo } = req.body;
  const updated = await issueService.acceptWorkAsOrganization(id, workerInfo, req.user);
  return res.status(200).json({
    success: true,
    message: "Work accepted on behalf of organization.",
    issue: updated,
  });
});

export const acceptWorkAsVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { volunteerInfo } = req.body;
  const updated = await issueService.acceptWorkAsVolunteer(id, volunteerInfo, req.user);
  return res.status(200).json({
    success: true,
    message: "Task accepted as individual volunteer.",
    issue: updated,
  });
});

export const startWorkerTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { workerInfo } = req.body;
  const updated = await issueService.startWorkerTask(id, workerInfo, req.user);
  return res.status(200).json({
    success: true,
    message: "Task commenced.",
    issue: updated,
  });
});

export const upvoteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userKey = req.user?._id ? `user_${req.user._id}` : `ip_${req.ip || "guest"}`;
  const updated = await issueService.upvoteIssue(id, userKey);
  return res.status(200).json({
    success: true,
    message: "Upvote registered successfully.",
    issue: updated,
  });
});

export const submitWorkerRepair = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await issueService.findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${id}' not found.`);
  }

  // Verify issue status permits repair submission
  if (issue.status === "RESOLVED" || issue.status === "CLOSED" || issue.status === "PENDING_VERIFICATION") {
    throw new ApiError(
      400,
      `Issue '${id}' is currently in '${issue.status}' status and cannot accept new repair submissions.`
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
  const formatted = await issueService.getIssueById(id);

  return res.status(200).json({
    success: true,
    message: "Repair proof submitted successfully for QA certification.",
    issue: formatted,
    repair: result.repair,
  });
});

export const submitRepairVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { repairImageUrl, notes, auditData } = req.body;

  const issue = await issueService.findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${id}' not found.`);
  }

  const updatedIssue = await repairVerificationService.certifyAdminRepair(issue, repairImageUrl, notes, auditData);
  const formatted = await issueService.getIssueById(id);

  return res.status(200).json({
    success: true,
    message: "Repair certified & published live.",
    issue: formatted,
  });
});

export const getEligibleOrganizationsForIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const issue = await issueService.findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${id}' not found.`);
  }

  const orgs = await routingService.findEligibleOrganizations(issue);
  return res.status(200).json(orgs);
});

export const addPublicReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await issueService.addPublicReview(id, req.body, req.user);
  return res.status(200).json({
    success: true,
    message: "Public review submitted successfully.",
    issue: updated,
  });
});

export const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await issueService.deleteIssue(id);
  return res.status(200).json(result);
});

export default {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssueStatus,
  assignIssueToOrganization,
  acceptWorkAsOrganization,
  acceptWorkAsVolunteer,
  startWorkerTask,
  upvoteIssue,
  submitWorkerRepair,
  submitRepairVerification,
  getEligibleOrganizationsForIssue,
  addPublicReview,
  deleteIssue,
};
