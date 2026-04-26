import { Router } from "express";
import * as ecgAnalysisController from "../controllers/ecgAnalysisController";
import uploadECGFile from "../middleware/ecgUploadMiddleware";
import { protect } from "../middleware/authMiddleware";
import { getDoctorReceivedECGs } from "../controllers/doctorDashboardController";

const router = Router();

// POST /api/ecg/upload — médecin upload direct (avec ou sans patient)
router.post("/upload", protect, uploadECGFile.single("image"), ecgAnalysisController.uploadECG);

// GET /api/ecg/received — ECGs envoyés par les patients au médecin
router.get("/received", protect, getDoctorReceivedECGs);

// GET /api/ecg/:id
router.get("/:id", ecgAnalysisController.getECGAnalysisDetails);

// POST /api/ecg-analysis/:id/digitize
router.post("/:id/digitize", ecgAnalysisController.digitizeECGAnalysis);

// POST /api/ecg-analysis/:id/analyze
router.post("/:id/analyze", ecgAnalysisController.analyzeECGWithAI);

// PATCH /api/ecg-analysis/:id/notes
router.patch("/:id/notes", ecgAnalysisController.saveDoctorNotes);

export default router;