import { Router } from "express";
import reviewController from "../controllers/review.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateReview } from "../validators/review.validator.js";
import { publicReviewRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.get("/", reviewController.getReviews);
router.post("/", optionalAuth, publicReviewRateLimiter, validate(validateReview), reviewController.createReview);

export default router;

