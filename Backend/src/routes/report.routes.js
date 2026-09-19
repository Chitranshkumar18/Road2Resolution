import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import { authenticate, optionalAuth } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = Router();

router.post("/submit", optionalAuth, reportController.submitReport);
router.get("/export", authenticate, requireAdmin, reportController.exportReports);

export default router;
