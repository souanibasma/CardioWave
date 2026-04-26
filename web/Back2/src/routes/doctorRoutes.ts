import express from "express";
import {
  getDoctorProfile,
  updateDoctorProfile,
  changeDoctorPassword,
  getDoctorDashboardStats,
  getDoctorWeeklyAnalysis,
  getDoctorRecentPatients,
  getDoctorRecentAnalyses,
  getDoctorReceivedECGs,
} from "../controllers/doctorController";

import {
  protect,
  authorize,
  requireApprovedDoctor,
} from "../middleware/authMiddleware";


const router = express.Router();

router.use(protect, authorize("doctor"), requireApprovedDoctor);

router.get("/profile", getDoctorProfile);
router.put("/profile", updateDoctorProfile);
router.put("/change-password", changeDoctorPassword);




router.get("/profile", protect, requireApprovedDoctor, getDoctorProfile);
router.put("/profile", protect, requireApprovedDoctor, updateDoctorProfile);
router.put(
  "/change-password",
  protect,
  requireApprovedDoctor,
  changeDoctorPassword
);

router.get(
  "/dashboard/stats",
  protect,
  requireApprovedDoctor,
  getDoctorDashboardStats
);

router.get(
  "/dashboard/weekly-analysis",
  protect,
  requireApprovedDoctor,
  getDoctorWeeklyAnalysis
);

router.get(
  "/dashboard/recent-patients",
  protect,
  requireApprovedDoctor,
  getDoctorRecentPatients
);

router.get(
  "/dashboard/recent-analyses",
  protect,
  requireApprovedDoctor,
  getDoctorRecentAnalyses
);
router.get(
  "/ecgs/received",
  protect,
  requireApprovedDoctor,
  getDoctorReceivedECGs
);
export default router;