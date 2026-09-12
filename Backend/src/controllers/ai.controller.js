import asyncHandler from "../utils/asyncHandler.js";
import aiService from "../services/ai.service.js";

export const analyzeImage = asyncHandler(async (req, res) => {
  const imageSource = req.file ? req.file.buffer : (req.body.imageUrl || req.body.image);
  const categoryHint = req.body.categoryHint || "";

  const result = await aiService.analyzeImage(imageSource, categoryHint);
  return res.status(200).json(result);
});

export const checkDuplicates = asyncHandler(async (req, res) => {
  const { lat, lng, category, radiusKm } = req.body;
  const result = await aiService.checkDuplicates(lat, lng, category, radiusKm);
  return res.status(200).json(result);
});

export const verifyRepair = asyncHandler(async (req, res) => {
  const { beforeUrl, afterUrl } = req.body;
  const result = await aiService.verifyRepair(beforeUrl, afterUrl);
  return res.status(200).json(result);
});

export default {
  analyzeImage,
  checkDuplicates,
  verifyRepair,
};
