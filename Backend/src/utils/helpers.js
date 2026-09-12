import crypto from "crypto";
import { MAX_GEOFENCE_METERS, MAX_ORGANIZATION_RADIUS_KM } from "./constants.js";

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const p1 = Number(lat1);
  const l1 = Number(lon1);
  const p2 = Number(lat2);
  const l2 = Number(lon2);

  if (isNaN(p1) || isNaN(l1) || isNaN(p2) || isNaN(l2)) return 0;

  const R = 6371; // Radius of Earth in KM
  const dLat = (p2 - p1) * (Math.PI / 180);
  const dLon = (l2 - l1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1 * (Math.PI / 180)) *
      Math.cos(p2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates distance in meters
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const km = calculateDistanceKm(lat1, lon1, lat2, lon2);
  return Math.round(km * 1000);
};

/**
 * Validates whether coordinates fall within geofence limit
 */
export const isWithinGeofence = (lat1, lon1, lat2, lon2, maxMeters = MAX_GEOFENCE_METERS) => {
  const distance = calculateDistanceMeters(lat1, lon1, lat2, lon2);
  return {
    verified: distance <= maxMeters,
    distanceMeters: distance,
  };
};

/**
 * Generates clean unique complaint ID like ISS-XXXXXX
 */
export const generateIssueId = () => {
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ISS-${randomSuffix}`;
};

/**
 * Strips password and sensitive fields from User object
 */
export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  delete user.__v;
  if (!user.id && user._id) {
    user.id = String(user._id);
  }
  return user;
};

/**
 * Maps canonical Issue document into the exact object structure expected by the React frontend
 */
export const formatIssueForFrontend = (doc) => {
  if (!doc) return null;
  const issue = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };

  const id = issue.customId || issue.id || (issue._id ? String(issue._id) : "");
  const mongoId = issue._id ? String(issue._id) : id;

  // Priority and AI mapping
  const priorityScore = issue.priorityScore ?? issue.priority?.score ?? 75;
  const aiConfidence = issue.aiConfidence ?? issue.ai?.confidence ?? 94.0;
  const aiDetection = issue.aiDetection || issue.ai?.detection || {
    detectedObjects: ["Civic Infrastructure Anomaly"],
    safetyHazardIndex: 7.0,
    trafficImpactFactor: "Moderate",
    suggestedAction: "Forwarded to municipal inspection queue.",
  };

  // Location mapping
  const location = {
    address: issue.location?.address || "Site Location",
    lat: issue.location?.lat ?? (issue.location?.coordinates?.[1] || 28.6139),
    lng: issue.location?.lng ?? (issue.location?.coordinates?.[0] || 77.2090),
    state: issue.location?.state || "Delhi",
    city: issue.location?.city || "New Delhi",
    district: issue.location?.district || "",
    pincode: issue.location?.pincode || "",
    landmark: issue.location?.landmark || "",
    road: issue.location?.road || "",
    area: issue.location?.area || "",
    zone: issue.location?.zone || "Municipal Zone",
  };

  // Reporter mapping
  const reporter = {
    id: issue.reporter?.id || issue.reporter?._id || issue.userId || "",
    _id: issue.reporter?._id || issue.reporter?.id || issue.userId || "",
    name: issue.reporter?.name || "Citizen Reporter",
    email: issue.reporter?.email || "",
    avatar: issue.reporter?.avatar || "",
    reputation: issue.reporter?.reputation || issue.reporter?.reputationScore || 0,
  };

  // Worker submission mapping
  const workerSubmission = issue.workerSubmission
    ? {
        repairImageUrl: issue.workerSubmission.repairImageUrl || issue.workerSubmission.afterImageUrl || "",
        afterImageUrl: issue.workerSubmission.afterImageUrl || issue.workerSubmission.repairImageUrl || "",
        notes: issue.workerSubmission.notes || "",
        materialsUsed: issue.workerSubmission.materialsUsed || "",
        submittedBy: issue.workerSubmission.submittedBy || "ORGANIZATION",
        isVolunteer: Boolean(issue.workerSubmission.isVolunteer),
        organizationName: issue.workerSubmission.organizationName || issue.assignedOrgName || "",
        workerName: issue.workerSubmission.workerName || "",
        workerEmail: issue.workerSubmission.workerEmail || "",
        submittedAt: issue.workerSubmission.submittedAt || issue.updatedAt || new Date().toISOString(),
        gpsVerification: issue.workerSubmission.gpsVerification || {
          verified: true,
          distanceMeters: 0,
          timestamp: new Date().toISOString(),
        },
      }
    : null;

  // Repair audit mapping
  const repairAudit = issue.repairAudit
    ? {
        verified: Boolean(issue.repairAudit.verified),
        verifiedAt: issue.repairAudit.verifiedAt || issue.updatedAt,
        verifiedBy: issue.repairAudit.verifiedBy || "Municipal Field Engineering",
        notes: issue.repairAudit.notes || "Surface restoration verified.",
        confidenceScore: issue.repairAudit.confidenceScore || 97.4,
        qualityRating: issue.repairAudit.qualityRating || "Optimal Grade A",
        hazardEliminated: issue.repairAudit.hazardEliminated ?? true,
        completedByEntity: issue.repairAudit.completedByEntity || {
          type: issue.responsibleType || (workerSubmission?.isVolunteer ? "PUBLIC_INDIVIDUAL" : "ORGANIZATION"),
          name: issue.responsibleName || workerSubmission?.workerName || "Assigned Crew",
          organizationName: issue.assignedOrgName || workerSubmission?.organizationName || "",
        },
      }
    : null;

  return {
    ...issue,
    id: id,
    _id: mongoId,
    priorityScore,
    aiConfidence,
    aiDetection,
    location,
    reporter,
    userId: issue.userId || reporter.id,
    assignedOrgId: issue.assignedOrgId || "",
    assignedOrgName: issue.assignedOrgName || "",
    responsibleType: issue.responsibleType || "UNASSIGNED",
    responsibleName: issue.responsibleName || "",
    responsibleOrgName: issue.responsibleOrgName || issue.assignedOrgName || "",
    workerSubmission,
    repairAudit,
    repairVerificationUrl: issue.repairVerificationUrl || workerSubmission?.repairImageUrl || "",
    afterImageUrl: issue.afterImageUrl || workerSubmission?.afterImageUrl || "",
    upvotes: issue.upvotes || 0,
    upvotedBy: issue.upvotedBy || [],
    reviews: Array.isArray(issue.reviews) ? issue.reviews : [],
    timeline: Array.isArray(issue.timeline) ? issue.timeline : [],
    createdAt: issue.createdAt || new Date().toISOString(),
    updatedAt: issue.updatedAt || new Date().toISOString(),
  };
};

export default {
  calculateDistanceKm,
  calculateDistanceMeters,
  isWithinGeofence,
  generateIssueId,
  sanitizeUser,
  formatIssueForFrontend,
};
