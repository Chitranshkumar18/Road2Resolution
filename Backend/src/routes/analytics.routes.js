import { Router } from "express";
import analyticsController from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";

const router = Router();

// Protect all administrative analytics routes
router.use(authenticate, requireAdmin);

router.get("/trends", analyticsController.getTrends);
router.get("/severity-breakdown", analyticsController.getSeverityBreakdown);
router.get("/category-breakdown", analyticsController.getCategoryBreakdown);
router.get("/department-workload", analyticsController.getDepartmentWorkload);

export default router;
