import express from "express";
import {
  getPatientProfile,
  updatePatientProfile,
  getApprovedDoctors,
  assignDoctorToPatient,
  getMyDoctor,
  uploadPatientECG,
  getPatientECGs,
  getPatientECGById,
  deletePatientECG,
  changePatientPassword,
  getPatientECGStats,
} from "../controllers/patientController";
import { protect, authorize } from "../middleware/authMiddleware";
import uploadEcg from "../middleware/uploadMiddleware";
const router = express.Router();

router.use(protect, authorize("patient"));

router.get("/profile", getPatientProfile);
router.put("/profile", updatePatientProfile);
router.put("/change-password", changePatientPassword);

router.get("/doctors", getApprovedDoctors);
router.put("/assign-doctor/:doctorId", assignDoctorToPatient);
router.get("/my-doctor", getMyDoctor);

router.post("/ecgs", uploadEcg.single("file"), uploadPatientECG);
router.get("/ecgs/stats", getPatientECGStats);
router.get("/ecgs", getPatientECGs);
router.get("/ecgs/:id", getPatientECGById);
router.delete("/ecgs/:id", deletePatientECG);

export default router;