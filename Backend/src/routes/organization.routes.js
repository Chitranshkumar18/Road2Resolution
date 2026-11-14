import { Router } from "express";
import organizationController from "../controllers/organization.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateOrganization } from "../validators/organization.validator.js";

const router = Router();

router.get("/", organizationController.getAllOrganizations);
router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(validateCreateOrganization),
  organizationController.createOrganization
);
router.get("/:id", organizationController.getOrganizationById);

export default router;
