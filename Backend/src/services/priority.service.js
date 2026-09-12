import { SEVERITY_LEVELS } from "../utils/constants.js";

/**
 * Calculates deterministic Priority Score (0 - 100) based on multi-factor civic metrics:
 * Formula: P = 0.4 * SafetyRisk + 0.3 * TrafficDensity + 0.3 * SeverityScore + Bonus
 */
export const calculatePriorityScore = ({
  severity = SEVERITY_LEVELS.HIGH,
  category = "pothole",
  safetyHazardIndex = 7.0,
  trafficImpactFactor = "Moderate",
  upvotes = 0,
  duplicateCount = 0,
}) => {
  // 1. Severity Score (0-100)
  let severityScore = 60;
  switch (severity?.toUpperCase()) {
    case "CRITICAL":
      severityScore = 98;
      break;
    case "HIGH":
      severityScore = 78;
      break;
    case "MEDIUM":
      severityScore = 55;
      break;
    case "LOW":
      severityScore = 30;
      break;
    default:
      severityScore = 60;
  }

  // 2. Safety Risk Score (0-100)
  const safetyNumeric = Number(safetyHazardIndex) || 7.0;
  const safetyRiskScore = Math.min(100, Math.max(10, safetyNumeric * 10));

  // 3. Traffic Impact Score (0-100)
  let trafficScore = 50;
  const trafficStr = String(trafficImpactFactor).toLowerCase();
  if (trafficStr.includes("severe") || trafficStr.includes("critical") || trafficStr.includes("gridlock")) {
    trafficScore = 95;
  } else if (trafficStr.includes("high") || trafficStr.includes("major")) {
    trafficScore = 80;
  } else if (trafficStr.includes("moderate") || trafficStr.includes("medium")) {
    trafficScore = 60;
  } else if (trafficStr.includes("low") || trafficStr.includes("minor")) {
    trafficScore = 30;
  }

  // Core formula: 40% Safety + 30% Traffic + 30% Severity
  let baseScore = (0.4 * safetyRiskScore) + (0.3 * trafficScore) + (0.3 * severityScore);

  // Bonus for high upvote citizen traction (+2 per upvote, max +10)
  const upvoteBonus = Math.min(10, (Number(upvotes) || 0) * 2);

  // Bonus for recurring reports in the vicinity (+3 per duplicate report, max +12)
  const duplicateBonus = Math.min(12, (Number(duplicateCount) || 0) * 3);

  // Category specific risk adjustment (e.g. traffic signal failure or water pipe burst in peak road)
  let categoryWeight = 0;
  if (category === "traffic_signal" || category === "water_leak") {
    categoryWeight = 4;
  } else if (category === "pothole") {
    categoryWeight = 2;
  }

  const finalScore = Math.round(Math.min(99, Math.max(15, baseScore + upvoteBonus + duplicateBonus + categoryWeight)));

  return finalScore;
};

export default {
  calculatePriorityScore,
};
