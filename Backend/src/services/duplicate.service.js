import Issue from "../models/Issue.js";
import { calculateDistanceKm, formatIssueForFrontend } from "../utils/helpers.js";

/**
 * Checks for duplicate civic complaints within geospatial proximity
 * @param {number} lat Latitude
 * @param {number} lng Longitude
 * @param {string} category Issue category
 * @param {number} radiusKm Search radius in KM (default 1.5)
 */
export const findDuplicates = async (lat, lng, category, radiusKm = 1.5) => {
  const targetLat = Number(lat);
  const targetLng = Number(lng);

  if (isNaN(targetLat) || isNaN(targetLng)) {
    return {
      hasDuplicates: false,
      duplicates: [],
      highestSimilarity: 0,
    };
  }

  // Find non-resolved issues (or all active issues within bounding box)
  const candidateIssues = await Issue.find({
    status: { $nin: ["RESOLVED", "CLOSED", "REJECTED"] },
  }).lean();

  const duplicates = candidateIssues
    .map((issue) => {
      const issueLat = issue.location?.lat;
      const issueLng = issue.location?.lng;
      const dist = calculateDistanceKm(targetLat, targetLng, issueLat, issueLng);
      const categoryMatch = issue.category === category;

      // Higher similarity when category matches and distance is near
      const similarityScore = categoryMatch
        ? Math.max(0, Math.min(99, Math.round(98 - dist * 15)))
        : Math.max(0, Math.min(60, Math.round(50 - dist * 10)));

      const distanceMeters = Math.round(dist * 1000);

      return {
        ...formatIssueForFrontend(issue),
        distanceMeters,
        similarityScore,
      };
    })
    .filter((issue) => issue.distanceMeters <= radiusKm * 1000 && issue.similarityScore >= 65)
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    highestSimilarity: duplicates[0]?.similarityScore || 0,
  };
};

export default {
  findDuplicates,
};
