import { Router } from "express";
import aiController from "../controllers/ai.controller.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/analyze", uploadSingle("image"), aiController.analyzeImage);
router.post("/check-duplicates", aiController.checkDuplicates);
router.post("/verify-repair", aiController.verifyRepair);

export default router;
