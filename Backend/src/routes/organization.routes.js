import { Router } from "express";
import organizationController from "../controllers/organization.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateCreateOrganization } from "../validators/organization.validator.js";

const router = Router();

router.get("/", organizationController.getAllOrganizations);
router.post("/", validate(validateCreateOrganization), organizationController.createOrganization);
router.get("/:id", organizationController.getOrganizationById);

export default router;
