import asyncHandler from "../utils/asyncHandler.js";
import aiService from "../services/ai.service.js";
import ApiError from "../utils/ApiError.js";

export const analyzeImage = asyncHandler(async (req, res) => {
  const imageSource = req.file ? req.file.buffer : (req.body.imageUrl || req.body.image);
  const categoryHint = typeof req.body.categoryHint === "string" ? req.body.categoryHint.trim() : "";

  if (!imageSource) {
    throw new ApiError(400, "Image file or data URL is required for AI analysis.");
  }

  const result = await aiService.analyzeImage(imageSource, categoryHint);
  return res.status(200).json(result);
});

export const checkDuplicates = asyncHandler(async (req, res) => {
  const { lat, lng, category, radiusKm } = req.body;

  const numLat = Number(lat);
  const numLng = Number(lng);

  if (isNaN(numLat) || numLat < -90 || numLat > 90 || isNaN(numLng) || numLng < -180 || numLng > 180) {
    throw new ApiError(400, "Valid latitude (-90 to 90) and longitude (-180 to 180) are required.");
  }

  const cleanRadius = Math.min(Math.max(Number(radiusKm) || 1.5, 0.1), 50);
  const cleanCategory = typeof category === "string" ? category.trim() : "pothole";

  const result = await aiService.checkDuplicates(numLat, numLng, cleanCategory, cleanRadius);
  return res.status(200).json(result);
});

export const verifyRepair = asyncHandler(async (req, res) => {
  const { beforeUrl, afterUrl } = req.body;

  if (!beforeUrl || !afterUrl) {
    throw new ApiError(400, "Both before-repair and after-repair image URLs are required.");
  }

  const result = await aiService.verifyRepair(beforeUrl, afterUrl);
  return res.status(200).json(result);
});

export default {
  analyzeImage,
  checkDuplicates,
  verifyRepair,
};

