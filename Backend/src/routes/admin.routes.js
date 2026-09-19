import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateProvisionWorker } from "../validators/auth.validator.js";

const router = Router();

// Protect all admin routes with authentication and admin authorization
router.use(authenticate, requireAdmin);

router.get("/stats", adminController.getStats);
router.get("/departments", adminController.getDepartments);
router.post("/assign", adminController.assignDepartment);
router.get("/risk-predictions", adminController.getRiskPredictions);
router.post("/workers", validate(validateProvisionWorker), adminController.provisionWorker);

export default router;

