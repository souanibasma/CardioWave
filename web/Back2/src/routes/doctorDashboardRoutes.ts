import express from "express";
import {
  getDoctorDashboardOverview,
  getDoctorRecentECGs,
  getDoctorAlerts,
  getDoctorWeeklyChart,
  getDoctorDistributionChart,
  getDoctorMonthlyTrendChart,
} from "../controllers/doctorDashboardController";
import { protect, requireApprovedDoctor } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/overview", protect, (req, res) => {
  return res.status(200).json({ ok: true, message: "overview route reached" });
});
router.get("/recent-ecgs", protect, requireApprovedDoctor, getDoctorRecentECGs);
router.get("/alerts", protect, requireApprovedDoctor, getDoctorAlerts);
router.get("/charts/weekly", protect, requireApprovedDoctor, getDoctorWeeklyChart);
router.get("/charts/distribution", protect, requireApprovedDoctor, getDoctorDistributionChart);
router.get("/charts/monthly-trend", protect, requireApprovedDoctor, getDoctorMonthlyTrendChart);

export default router;