import { Router } from "express";
import analyticsController from "../controllers/analytics.controller.js";

const router = Router();

router.get("/trends", analyticsController.getTrends);
router.get("/severity-breakdown", analyticsController.getSeverityBreakdown);
router.get("/category-breakdown", analyticsController.getCategoryBreakdown);
router.get("/department-workload", analyticsController.getDepartmentWorkload);

export default router;
