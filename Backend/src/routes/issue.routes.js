import { Router } from "express";
import issueController from "../controllers/issue.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { requireAdmin, requireWorker, requireCitizen } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateIssue,
  validateUpdateStatus,
  validateAssignOrganization,
} from "../validators/issue.validator.js";
import { validateSubmitRepair, validateVerifyRepair } from "../validators/repair.validator.js";
import { validateReview } from "../validators/review.validator.js";
import { publicUpvoteRateLimiter, publicReviewRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Public issue listing & guest/citizen reporting
router.get("/", optionalAuth, issueController.getAllIssues);
router.post("/", optionalAuth, validate(validateCreateIssue), issueController.createIssue);

// Public issue details
router.get("/:id", issueController.getIssueById);

// Admin privileged issue management
router.delete("/:id", authenticate, requireAdmin, issueController.deleteIssue);
router.patch("/:id/status", authenticate, requireAdmin, validate(validateUpdateStatus), issueController.updateIssueStatus);
router.post("/:id/assign-organization", authenticate, requireAdmin, validate(validateAssignOrganization), issueController.assignIssueToOrganization);

// Field worker task operations (accessible to workers and admins)
router.post("/:id/accept-org", authenticate, requireWorker, issueController.acceptWorkAsOrganization);
router.post("/:id/start-work", authenticate, requireWorker, issueController.startWorkerTask);
router.post("/:id/worker-repair", authenticate, requireWorker, validate(validateSubmitRepair), issueController.submitWorkerRepair);

// Community volunteer task acceptance (accessible to any authenticated user)
router.post("/:id/accept-volunteer", authenticate, requireCitizen, issueController.acceptWorkAsVolunteer);

// Admin repair certification & publication
router.post("/:id/verify-repair", authenticate, requireAdmin, validate(validateVerifyRepair), issueController.submitRepairVerification);

// Public discovery, upvoting & feedback
router.get("/:id/eligible-organizations", issueController.getEligibleOrganizationsForIssue);
router.post("/:id/upvote", optionalAuth, publicUpvoteRateLimiter, issueController.upvoteIssue);
router.post("/:id/reviews", optionalAuth, publicReviewRateLimiter, validate(validateReview), issueController.addPublicReview);

export default router;

