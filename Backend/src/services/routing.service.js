import Organization from "../models/Organization.js";
import Department from "../models/Department.js";
import { calculateDistanceKm } from "../utils/helpers.js";
import { ISSUE_CATEGORIES, MAX_ORGANIZATION_RADIUS_KM } from "../utils/constants.js";

/**
 * Determines primary department for a given issue category
 */
export const getDepartmentForCategory = (category) => {
  const cat = ISSUE_CATEGORIES.find((c) => c.id === category);
  return cat ? cat.department : "Public Works Department (PWD)";
};

/**
 * Finds all eligible organizations for an issue based on 75km radius and domain match
 */
export const findEligibleOrganizations = async (issue, maxRadiusKm = MAX_ORGANIZATION_RADIUS_KM) => {
  const organizations = await Organization.find({ isActive: true }).lean();
  if (!organizations || organizations.length === 0) return [];

  const issueLat = issue.location?.lat || 28.6139;
  const issueLng = issue.location?.lng || 77.2090;
  const issueCategory = (issue.category || "pothole").toLowerCase();

  return organizations
    .map((org) => {
      let distanceKm = 10;
      if (org.centerCoords?.lat && org.centerCoords?.lng) {
        distanceKm = calculateDistanceKm(
          issueLat,
          issueLng,
          org.centerCoords.lat,
          org.centerCoords.lng
        );
      }

      const roundedDist = Math.round(distanceKm * 10) / 10;
      const isWithinRadius = distanceKm <= maxRadiusKm;

      const orgCategories = (org.categoryIds || []).map((c) => c.toLowerCase());
      const isDomainMatch =
        orgCategories.includes("pothole") ||
        orgCategories.includes("road_damage") ||
        orgCategories.includes("drainage") ||
        orgCategories.includes("other") ||
        orgCategories.includes(issueCategory) ||
        org.type === "MUNICIPAL" ||
        org.type === "STATE_AGENCY";

      const isEligible = isWithinRadius && isDomainMatch;
      let jurisdictionReason = `Within ${maxRadiusKm} km radius (~${roundedDist} km away in ${org.city || "Area"}, ${org.state || "State"})`;

      if (!isWithinRadius) {
        jurisdictionReason = `Outside ${maxRadiusKm} km radius (~${Math.round(distanceKm)} km away)`;
      } else if (!isDomainMatch) {
        jurisdictionReason = `Domain Mismatch: Does not service ${issue.category || "this defect"}`;
      }

      return {
        ...org,
        id: org.id || org._id.toString(),
        isEligible,
        jurisdictionReason,
        distanceKm: roundedDist,
      };
    })
    .sort((a, b) => {
      if (a.isEligible && !b.isEligible) return -1;
      if (!a.isEligible && b.isEligible) return 1;
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });
};

export default {
  getDepartmentForCategory,
  findEligibleOrganizations,
};
