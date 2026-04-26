import { Router } from "express";
import * as ecgAnalysisController from "../controllers/ecgAnalysisController";
import uploadECGFile from "../middleware/ecgUploadMiddleware";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// POST /api/ecg/upload
router.post("/upload", protect, uploadECGFile.single("image"), ecgAnalysisController.uploadECG);

// GET /api/ecg/:id
router.get("/:id", ecgAnalysisController.getECGAnalysisDetails);

// POST /api/ecg-analysis/:id/digitize
router.post("/:id/digitize", ecgAnalysisController.digitizeECGAnalysis);

// POST /api/ecg-analysis/:id/analyze
router.post("/:id/analyze", ecgAnalysisController.analyzeECGWithAI);

// PATCH /api/ecg-analysis/:id/notes
router.patch("/:id/notes", ecgAnalysisController.saveDoctorNotes);

export default router;
