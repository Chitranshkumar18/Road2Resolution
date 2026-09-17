import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import { formatIssueForFrontend, calculateDistanceMeters } from "../utils/helpers.js";
import { calculatePriorityScore } from "./priority.service.js";
import { getDepartmentForCategory } from "./routing.service.js";
import { uploadImage } from "./cloudinary.service.js";
import { createNotification } from "./notification.service.js";
import { emitIssueUpdated } from "../sockets/socket.js";

/**
 * Finds an issue either by customId (ISS-XXXXXX) or MongoDB ObjectId
 */
export const findIssueByIdOrCustomId = async (id) => {
  if (!id) return null;

  let issue = await Issue.findOne({ customId: id }).populate("repairs");
  if (!issue && mongoose.Types.ObjectId.isValid(id)) {
    issue = await Issue.findById(id).populate("repairs");
  }
  return issue;
};

/**
 * Retrieves all issues matching given filter criteria
 */
export const getAllIssues = async (filters = {}) => {
  const query = {};

  // Category filter
  if (filters.category && filters.category !== "all") {
    query.category = filters.category;
  }

  // Status filter
  if (filters.status && filters.status !== "all") {
    if (filters.status === "unassigned") {
      query.$or = [{ assignedOrgId: "" }, { assignedOrgId: { $exists: false } }, { assignedOrgId: null }];
    } else if (filters.status === "assigned") {
      query.assignedOrgId = { $exists: true, $ne: "" };
    } else {
      query.status = filters.status;
    }
  }

  // Severity filter
  if (filters.severity && filters.severity !== "all") {
    query.severity = filters.severity;
  }

  // State filter
  if (filters.state && filters.state !== "all") {
    query["location.state"] = new RegExp(`^${filters.state}$`, "i");
  }

  // City filter
  if (filters.city && filters.city !== "all") {
    query["location.city"] = new RegExp(`^${filters.city}$`, "i");
  }

  // Reporter filter
  if (filters.reporterEmail) {
    query["reporter.email"] = filters.reporterEmail.toLowerCase();
  } else if (filters.userId) {
    query.$or = [{ userId: filters.userId }, { "reporter.id": filters.userId }, { "reporter._id": filters.userId }];
  }

  // Search filter
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    const regex = new RegExp(q, "i");
    query.$or = [
      { title: regex },
      { customId: regex },
      { description: regex },
      { "location.address": regex },
      { "location.city": regex },
      { assignedOrgName: regex },
      { responsibleName: regex },
    ];
  }

  const issues = await Issue.find(query).sort({ createdAt: -1 }).populate("repairs").lean();

  return issues.map((issue) => formatIssueForFrontend(issue));
};

/**
 * Retrieves a single issue by ID
 */
export const getIssueById = async (id) => {
  const issue = await findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Complaint with ID '${id}' not found.`);
  }
  return formatIssueForFrontend(issue);
};

/**
 * Creates a new civic complaint
 */
export const createIssue = async (issueData, currentUser = null) => {
  const {
    title,
    description = "",
    category = "pothole",
    imageUrl,
    image,
    capturedAt,
    photoCapturedAt,
    photoValiditySeconds = 60,
    address,
    lat,
    lng,
    state = "Delhi",
    city = "New Delhi",
    district = "",
    pincode = "",
    landmark = "",
    road = "",
    area = "",
    zone = "Municipal Zone",
    severity = "HIGH",
    priorityScore: customPriority,
    aiConfidence = 95.0,
    aiDetection,
    reporter,
    userId,
  } = issueData;

  // 60-Second Photo Validity Window Verification for Citizen Live Camera Capture
  const rawCaptureTime = capturedAt || photoCapturedAt;
  const captureTimestamp = rawCaptureTime ? new Date(rawCaptureTime).getTime() : null;
  const now = Date.now();

  if (captureTimestamp && !isNaN(captureTimestamp)) {
    const ageSeconds = (now - captureTimestamp) / 1000;
    // Enforce 60-second limit with 5-second grace for network transit / clock skew
    if (ageSeconds > 65) {
      throw new ApiError(
        400,
        `Photo evidence expired. The complaint photo was captured ${Math.round(ageSeconds)} seconds ago, exceeding the 60-second live submission limit. Please capture a new live photo.`
      );
    }
    if (ageSeconds < -10) {
      throw new ApiError(400, "Invalid capture timestamp detected. Please capture a fresh live photo.");
    }
  }

  // Process image
  const rawImage = imageUrl || image;
  const finalImageUrl = await uploadImage(rawImage, "civicvision/issues");

  // Calculate priority score if not provided
  const score =
    customPriority ??
    calculatePriorityScore({
      severity,
      category,
      safetyHazardIndex: aiDetection?.safetyHazardIndex || 7.5,
      trafficImpactFactor: aiDetection?.trafficImpactFactor || "Moderate",
    });

  const dept = getDepartmentForCategory(category);

  const reporterUserId = currentUser?._id || currentUser?.id || reporter?._id || reporter?.id || userId || "";
  const currentReputation = currentUser?.reputationScore ?? reporter?.reputation ?? 0;
  let updatedCivicPoints = currentUser?.civicPoints ?? 0;

  // Add +10 Civic Points whenever a citizen successfully submits a complaint (reputation stays unchanged)
  if (reporterUserId) {
    try {
      let userDoc = null;
      if (mongoose.Types.ObjectId.isValid(reporterUserId)) {
        userDoc = await User.findByIdAndUpdate(
          reporterUserId,
          { $inc: { civicPoints: 10 } },
          { returnDocument: "after" }
        );
      } else if (currentUser?.email || reporter?.email) {
        userDoc = await User.findOneAndUpdate(
          { email: (currentUser?.email || reporter?.email).toLowerCase() },
          { $inc: { civicPoints: 10 } },
          { returnDocument: "after" }
        );
      }
      if (userDoc) {
        updatedCivicPoints = userDoc.civicPoints ?? 0;
      } else {
        updatedCivicPoints += 10;
      }
    } catch (e) {
      console.warn("Failed to increment user civic points:", e.message);
      updatedCivicPoints += 10;
    }
  }

  const reporterInfo = {
    id: reporterUserId,
    _id: reporterUserId,
    name: currentUser?.name || reporter?.name || "Citizen Reporter",
    email: currentUser?.email || reporter?.email || "",
    avatar: currentUser?.avatar || reporter?.avatar || "",
    reputation: currentReputation,
    civicPoints: updatedCivicPoints,
  };

  const newIssue = await Issue.create({
    title: title || `${category} reported at ${address ? address.split(",")[0] : "Site Location"}`,
    description,
    category,
    status: "VERIFIED",
    severity,
    priorityScore: score,
    aiConfidence,
    aiDetection: aiDetection || {
      detectedObjects: ["Civic Infrastructure Anomaly"],
      safetyHazardIndex: 7.5,
      trafficImpactFactor: "Moderate",
      suggestedAction: "Dispatched to designated municipal field unit.",
    },
    imageUrl: finalImageUrl,
    capturedAt: captureTimestamp ? new Date(captureTimestamp) : new Date(),
    photoValiditySeconds: 60,
    location: {
      address: address || "Outer Ring Road, New Delhi",
      lat: Number(lat) || 28.6139,
      lng: Number(lng) || 77.2090,
      state,
      city,
      district,
      pincode,
      landmark,
      road,
      area,
      zone,
    },
    reporter: reporterInfo,
    userId: reporterInfo.id,
    department: dept,
  });

  // Notify connected clients
  await createNotification({
    title: `🚨 New Civic Issue Reported: ${newIssue.customId}`,
    message: `${newIssue.title} (${newIssue.severity} Priority) logged at ${city}.`,
    type: "info",
    link: `/citizen/issue/${newIssue.customId}`,
  });

  const formatted = formatIssueForFrontend(newIssue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Updates issue status
 */
export const updateIssueStatus = async (id, status, note = "", assignedOfficer = "", department = "") => {
  const issue = await findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${id}' not found.`);
  }

  issue.status = status;
  if (assignedOfficer) issue.assignedOfficer = assignedOfficer;
  if (department) issue.department = department;

  issue.timeline.push({
    status,
    message: `Status updated to ${status}.`,
    note: note || `Updated by municipal administrator.`,
    officer: assignedOfficer || "Municipal Officer",
    timestamp: new Date(),
  });

  await issue.save();
  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Assigns an issue to an organization
 */
export const assignIssueToOrganization = async (issueId, organizationId, notes = "", assignedOfficer = "") => {
  const issue = await findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  if (issue.status === "RESOLVED" || issue.repairAudit?.verified) {
    throw new ApiError(400, "Cannot reassign organization: this complaint has already been verified and resolved.");
  }

  const organization = await Organization.findOne({
    $or: [{ id: organizationId }, { _id: mongoose.Types.ObjectId.isValid(organizationId) ? organizationId : null }],
  });

  const orgName = organization ? organization.name : organizationId;

  issue.assignedOrgId = organization ? organization.id : organizationId;
  issue.assignedOrgName = orgName;
  issue.responsibleType = "ORGANIZATION";
  issue.responsibleOrgName = orgName;
  issue.status = "ASSIGNED";
  if (assignedOfficer) issue.assignedOfficer = assignedOfficer;

  issue.timeline.push({
    status: "ASSIGNED",
    message: `Assigned to ${orgName}.`,
    note: notes || `Dispatched to ${orgName} field crew.`,
    officer: assignedOfficer || "Control Desk",
    timestamp: new Date(),
  });

  await issue.save();
  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Worker accepts work on behalf of Assigned Organization
 */
export const acceptWorkAsOrganization = async (issueId, workerInfo = {}, currentUser = null) => {
  const issue = await findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  const workerName = workerInfo.name || currentUser?.name || "Field Worker";
  const orgName = workerInfo.organizationName || issue.assignedOrgName || currentUser?.contractorUnit || "Municipal Rapid Repair Unit";

  issue.status = "IN_PROGRESS";
  issue.responsibleType = "ORGANIZATION";
  issue.responsibleName = workerName;
  issue.responsibleOrgName = orgName;
  if (!issue.assignedOrgName) issue.assignedOrgName = orgName;

  issue.timeline.push({
    status: "IN_PROGRESS",
    message: `Task accepted by ${orgName} field crew (${workerName}).`,
    note: `Work commenced on site.`,
    officer: workerName,
    timestamp: new Date(),
  });

  await issue.save();
  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Normal person / individual takes task as Volunteer
 */
export const acceptWorkAsVolunteer = async (issueId, volunteerInfo = {}, currentUser = null) => {
  const issue = await findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  const volName = volunteerInfo.name || currentUser?.name || "Community Volunteer";

  issue.status = "IN_PROGRESS";
  issue.responsibleType = "PUBLIC_INDIVIDUAL";
  issue.responsibleName = volName;
  issue.responsibleOrgName = "";

  issue.timeline.push({
    status: "IN_PROGRESS",
    message: `Community Volunteer (${volName}) accepted task.`,
    note: volunteerInfo.notes || "Assigned personal responsibility to resolve hazard.",
    officer: volName,
    timestamp: new Date(),
  });

  await issue.save();
  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Starts worker task
 */
export const startWorkerTask = async (issueId, workerInfo = {}, currentUser = null) => {
  return await acceptWorkAsOrganization(issueId, workerInfo, currentUser);
};

/**
 * Citizen upvotes an issue
 */
export const upvoteIssue = async (issueId, userId = "") => {
  const issue = await findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  const userKey = userId || "guest_user";
  const alreadyUpvoted = issue.upvotedBy && issue.upvotedBy.includes(userKey);

  if (!alreadyUpvoted) {
    issue.upvotes = (issue.upvotes || 0) + 1;
    if (!issue.upvotedBy) issue.upvotedBy = [];
    issue.upvotedBy.push(userKey);

    // Recalculate priority score dynamically with upvote bonus
    issue.priorityScore = calculatePriorityScore({
      severity: issue.severity,
      category: issue.category,
      safetyHazardIndex: issue.aiDetection?.safetyHazardIndex || 7.5,
      trafficImpactFactor: issue.aiDetection?.trafficImpactFactor || "Moderate",
      upvotes: issue.upvotes,
    });

    await issue.save();
  }

  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Adds public community review to a resolved issue
 */
export const addPublicReview = async (issueId, reviewData) => {
  const issue = await findIssueByIdOrCustomId(issueId);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${issueId}' not found.`);
  }

  const { author = "Community Resident", rating = 5, comment, tag = "⚡ Fast Municipal Action", role = "Public Community Feedback" } = reviewData;

  const newReview = {
    id: `rev_${Date.now()}`,
    author: author.trim() || "Community Resident",
    rating: Number(rating) || 5,
    comment: comment.trim(),
    tag,
    role,
    published: true,
    createdAt: new Date(),
  };

  if (!issue.reviews) issue.reviews = [];
  issue.reviews.push(newReview);

  await issue.save();

  // Also create separate Review record for global querying
  await Review.create({
    issue: issue._id,
    issueCustomId: issue.customId || issue.id,
    author: newReview.author,
    rating: newReview.rating,
    comment: newReview.comment,
    tag: newReview.tag,
    role: newReview.role,
  });

  const formatted = formatIssueForFrontend(issue);
  emitIssueUpdated(formatted);

  return formatted;
};

/**
 * Deletes an issue
 */
export const deleteIssue = async (id) => {
  const issue = await findIssueByIdOrCustomId(id);
  if (!issue) {
    throw new ApiError(404, `Issue with ID '${id}' not found.`);
  }

  await Issue.deleteOne({ _id: issue._id });
  return { success: true, message: `Issue ${id} deleted successfully.` };
};

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
  addPublicReview,
  deleteIssue,
  findIssueByIdOrCustomId,
};
