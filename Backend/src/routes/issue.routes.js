import { Router } from "express";
import issueController from "../controllers/issue.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateIssue,
  validateUpdateStatus,
  validateAssignOrganization,
} from "../validators/issue.validator.js";
import { validateSubmitRepair, validateVerifyRepair } from "../validators/repair.validator.js";
import { validateReview } from "../validators/review.validator.js";

const router = Router();

router.get("/", issueController.getAllIssues);
router.post("/", optionalAuth, validate(validateCreateIssue), issueController.createIssue);

router.get("/:id", issueController.getIssueById);
router.delete("/:id", optionalAuth, issueController.deleteIssue);

router.patch("/:id/status", optionalAuth, validate(validateUpdateStatus), issueController.updateIssueStatus);
router.post("/:id/assign-organization", optionalAuth, validate(validateAssignOrganization), issueController.assignIssueToOrganization);

router.post("/:id/accept-org", optionalAuth, issueController.acceptWorkAsOrganization);
router.post("/:id/accept-volunteer", optionalAuth, issueController.acceptWorkAsVolunteer);
router.post("/:id/start-work", optionalAuth, issueController.startWorkerTask);

router.post("/:id/worker-repair", optionalAuth, validate(validateSubmitRepair), issueController.submitWorkerRepair);
router.post("/:id/verify-repair", optionalAuth, validate(validateVerifyRepair), issueController.submitRepairVerification);

router.get("/:id/eligible-organizations", issueController.getEligibleOrganizationsForIssue);
router.post("/:id/upvote", optionalAuth, issueController.upvoteIssue);
router.post("/:id/reviews", validate(validateReview), issueController.addPublicReview);

export default router;
