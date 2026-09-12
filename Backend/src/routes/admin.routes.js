import { Router } from "express";
import adminController from "../controllers/admin.controller.js";

const router = Router();

router.get("/stats", adminController.getStats);
router.get("/departments", adminController.getDepartments);
router.post("/assign", adminController.assignDepartment);
router.get("/risk-predictions", adminController.getRiskPredictions);

export default router;
