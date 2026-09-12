import { Router } from "express";
import reviewController from "../controllers/review.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateReview } from "../validators/review.validator.js";

const router = Router();

router.get("/", reviewController.getReviews);
router.post("/", validate(validateReview), reviewController.createReview);

export default router;
