import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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

/**
 * Simulates AI detection output for a selected category or image
 */
export function generateMockAiDetection(category, description) {
  const isPothole = category === 'pothole' || /pothole|road|asphalt/i.test(description || '');
  const isWater = category === 'water_leak' || /water|pipe|leak|flood/i.test(description || '');
  const isLight = category === 'streetlight' || /light|pole|dark/i.test(description || '');
  const isGarbage = category === 'garbage' || /garbage|trash|waste/i.test(description || '');

  let severity = 'MEDIUM';
  let priorityScore = 72;
  let confidence = (91 + Math.random() * 8).toFixed(1);
  let detectedObjects = ['Civic Infrastructure Anomaly'];
  let safetyScore = 7.5;
  let suggestedAction = 'Dispatch field verification team.';

  if (isPothole) {
    severity = 'CRITICAL';
    priorityScore = 92;
    confidence = (95 + Math.random() * 4.5).toFixed(1);
    detectedObjects = ['Deep Pothole Crater (Width ~55cm)', 'Sub-base Aggregate Exposure', 'High-Speed Traffic Corridor'];
    safetyScore = 9.3;
    suggestedAction = 'Emergency asphalt patch & safety cordon installation within 6 hours.';
  } else if (isWater) {
    severity = 'HIGH';
    priorityScore = 86;
    confidence = (93 + Math.random() * 5).toFixed(1);
    detectedObjects = ['Pressurized Water Plume', 'Erosion Risk', 'Walkway Flooding'];
    safetyScore = 8.1;
    suggestedAction = 'Main line valve isolation and pipe collar clamp installation.';
  } else if (isLight) {
    severity = 'HIGH';
    priorityScore = 79;
    confidence = (96 + Math.random() * 3).toFixed(1);
    detectedObjects = ['Luminaire Burnout', 'Dark Zone Footprint (180m)', 'Pedestrian Transit Zone'];
    safetyScore = 8.4;
    suggestedAction = 'LED driver replacement and night patrol verification.';
  } else if (isGarbage) {
    severity = 'MEDIUM';
    priorityScore = 65;
    confidence = (94 + Math.random() * 4).toFixed(1);
    detectedObjects = ['Solid Waste Spillage', 'Public Health Hazard', 'Stray Animal Gathering'];
    safetyScore = 6.8;
    suggestedAction = 'Hydraulic refuse truck dispatch and chemical disinfection.';
  }

  return {
    category: category || (isPothole ? 'pothole' : isWater ? 'water_leak' : isLight ? 'streetlight' : 'garbage'),
    severity,
    priorityScore,
    aiConfidence: parseFloat(confidence),
    aiDetection: {
      detectedObjects,
      safetyHazardIndex: safetyScore,
      trafficImpactFactor: severity === 'CRITICAL' ? 'High Hazard' : 'Moderate Impact',
      suggestedAction
    }
  };
}
