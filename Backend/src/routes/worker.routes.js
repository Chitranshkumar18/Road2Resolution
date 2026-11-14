import { Router } from "express";
import workerController from "../controllers/worker.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireWorker } from "../middleware/role.middleware.js";

const router = Router();

// Protect all worker field operations routes (accessible to workers and admins)
router.use(authenticate, requireWorker);

router.get("/assigned-issues", workerController.getAssignedIssues);
router.get("/profile", workerController.getProfile);
router.post("/repair", workerController.submitRepair);

export default router;
