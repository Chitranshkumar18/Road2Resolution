import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import { optionalAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/submit", optionalAuth, reportController.submitReport);
router.get("/export", reportController.exportReports);

export default router;
