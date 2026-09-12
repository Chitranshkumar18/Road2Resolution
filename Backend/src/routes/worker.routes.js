import { Router } from "express";
import workerController from "../controllers/worker.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/assigned-issues", optionalAuth, workerController.getAssignedIssues);
router.get("/profile", optionalAuth, workerController.getProfile);
router.post("/repair", optionalAuth, workerController.submitRepair);

export default router;
