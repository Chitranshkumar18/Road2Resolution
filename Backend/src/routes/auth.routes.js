import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateRegister, validateLogin, validateUpdateProfile } from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(validateRegister), authController.register);
router.post("/login", validate(validateLogin), authController.login);
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/profile", authenticate, validate(validateUpdateProfile), authController.updateProfile);
router.post("/logout", authController.logout);

export default router;
