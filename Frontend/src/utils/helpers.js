import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if a complaint was submitted by the currently logged-in citizen.
 * Strictly checks unique user ID (complaint.userId === user._id || complaint.userId === user.id)
 * and reporter object identifiers.
 */
export function isUserComplaint(complaint, user) {
  if (!complaint || !user) return false;

  const currentUserId = String(user._id || user.id || '').trim();
  const complaintUserId = String(
    complaint.userId ||
    complaint.reporter?.id ||
    complaint.reporter?._id ||
    ''
  ).trim();

  // Primary check: Match by unique User ID
  if (currentUserId && complaintUserId && currentUserId === complaintUserId) {
    return true;
  }

  // Fallback: Match by email if user ID is missing
  const userEmail = String(user.email || '').trim().toLowerCase();
  const complaintEmail = String(complaint.reporter?.email || '').trim().toLowerCase();
  if (userEmail && complaintEmail && userEmail === complaintEmail) {
    return true;
  }

  return false;
}

/**
 * Filters a list of complaints to ONLY those belonging to the currently logged-in user.
 */
export function getUserComplaints(complaints, user) {
  if (!Array.isArray(complaints) || !user) return [];
  return complaints.filter((c) => isUserComplaint(c, user));
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const MAX_ASSIGNMENT_RADIUS_KM = 75;

/**
 * Evaluates whether an organization is geographically and domain eligible for a specific complaint.
 * Criteria:
 * 1. Must be within a 75 km radius of the complaint location.
 * 2. Must be an authorized road-repair, road-maintenance, municipal body, or match the issue category.
 */
export function checkOrganizationJurisdiction(complaint, org, maxRadiusKm = MAX_ASSIGNMENT_RADIUS_KM) {
  if (!complaint || !org) {
    return { eligible: false, distanceKm: 0, reason: "Missing complaint or organization information" };
  }

  // 1. Proximity / 75 km Radius Check
  let distanceKm = 0;
  if (complaint.location?.lat && complaint.location?.lng && org.centerCoords?.lat && org.centerCoords?.lng) {
    distanceKm = calculateDistanceKm(
      complaint.location.lat,
      complaint.location.lng,
      org.centerCoords.lat,
      org.centerCoords.lng
    );
  } else {
    // Fallback if coordinates missing: check state and city
    const complaintState = (complaint.location?.state || 'Delhi').trim().toLowerCase();
    const orgState = (org.state || '').trim().toLowerCase();
    if (complaintState !== orgState) {
      return {
        eligible: false,
        distanceKm: 999,
        reason: `Outside 75 km radius (Different state: ${org.state})`
      };
    }
    distanceKm = 10; // Default local municipal distance
  }

  const roundedDistance = Math.round(distanceKm * 10) / 10;
  const isWithinRadius = distanceKm <= maxRadiusKm;

  if (!isWithinRadius) {
    return {
      eligible: false,
      distanceKm: roundedDistance,
      reason: `Outside 75 km radius (~${Math.round(distanceKm)} km away)`
    };
  }

  // 2. Road Repair / Issue Category Check
  const complaintCat = (complaint.category || '').toLowerCase();
  const orgCategories = (org.categoryIds || []).map((c) => c.toLowerCase());
  const isRoadRepairOrg =
    orgCategories.includes('pothole') ||
    orgCategories.includes('road_damage') ||
    orgCategories.includes('drainage') ||
    orgCategories.includes('other') ||
    orgCategories.includes(complaintCat) ||
    org.type === 'MUNICIPAL' ||
    org.type === 'STATE_AGENCY';

  if (!isRoadRepairOrg && orgCategories.length > 0 && !orgCategories.includes(complaintCat)) {
    return {
      eligible: false,
      distanceKm: roundedDistance,
      reason: `Domain Mismatch: Does not service ${complaint.category || 'this defect type'}`
    };
  }

  return {
    eligible: true,
    distanceKm: roundedDistance,
    reason: `Within 75 km radius (~${roundedDistance} km away in ${org.city}, ${org.state})`
  };
}

/**
 * Returns a list of organizations filtered and scored for a specific complaint within 75 km radius
 */
export function getEligibleOrganizations(complaint, organizations = [], maxRadiusKm = MAX_ASSIGNMENT_RADIUS_KM) {
  if (!Array.isArray(organizations) || !complaint) return [];

  return organizations
    .map((org) => {
      const evaluation = checkOrganizationJurisdiction(complaint, org, maxRadiusKm);
      return {
        ...org,
        isEligible: evaluation.eligible,
        jurisdictionReason: evaluation.reason,
        distanceKm: evaluation.distanceKm ?? 0
      };
    })
    .sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });
}

/**
 * Formats the responsible entity string and badge attributes for a complaint.
 * Ensures strict distinction between registered organizations and public volunteers.
 */
export function formatResponsibleEntity(issue) {
  if (!issue) {
    return {
      label: 'Unassigned',
      entityName: 'Unassigned',
      type: 'UNASSIGNED',
      badgeClass: 'bg-slate-500/15 text-slate-400 border-slate-700',
      isVolunteer: false
    };
  }

  // Check audit certification first
  const auditEntity = issue.repairAudit?.completedByEntity;
  const workerSub = issue.workerSubmission;

  if (auditEntity?.type === 'PUBLIC_INDIVIDUAL' || issue.responsibleType === 'PUBLIC_INDIVIDUAL' || workerSub?.submittedBy === 'PUBLIC_INDIVIDUAL' || workerSub?.isVolunteer) {
    const name = auditEntity?.name || issue.responsibleName || workerSub?.workerName || 'Public Citizen Volunteer';
    return {
      label: `Public Volunteer – ${name}`,
      entityName: name,
      type: 'PUBLIC_INDIVIDUAL',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      isVolunteer: true,
      tag: '🌟 Community Volunteer'
    };
  }

  if (auditEntity?.type === 'ORGANIZATION' || issue.responsibleType === 'ORGANIZATION' || issue.assignedOrgName || workerSub?.organizationName) {
    const orgName = auditEntity?.organizationName || issue.assignedOrgName || workerSub?.organizationName || issue.department || 'Municipal Organization';
    const workerName = auditEntity?.name || issue.responsibleName || workerSub?.workerName;
    return {
      label: `${orgName}${workerName ? ` (${workerName})` : ''}`,
      entityName: orgName,
      workerName: workerName || null,
      type: 'ORGANIZATION',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      isVolunteer: false,
      tag: '🛠️ Registered Organization'
    };
  }

  if (issue.department) {
    return {
      label: issue.department,
      entityName: issue.department,
      type: 'DEPARTMENT',
      badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      isVolunteer: false,
      tag: '🏛️ Municipal Dept'
    };
  }

  return {
    label: 'Open for Assignment / Volunteer',
    entityName: 'Pending Assignment',
    type: 'OPEN',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    isVolunteer: false,
    tag: '⚡ Available'
  };
}


