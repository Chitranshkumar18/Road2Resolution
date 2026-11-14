import { Router } from "express";
import aiController from "../controllers/ai.controller.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { aiImageRateLimiter, aiDuplicateRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Public / citizen AI analysis endpoints with strict rate limiting
router.post("/analyze", optionalAuth, aiImageRateLimiter, uploadSingle("image"), aiController.analyzeImage);
router.post("/check-duplicates", optionalAuth, aiDuplicateRateLimiter, aiController.checkDuplicates);

// Repair verification comparison (restricted to authenticated accounts)
router.post("/verify-repair", authenticate, aiImageRateLimiter, aiController.verifyRepair);

export default router;

