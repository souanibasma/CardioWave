import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
  getDashboardStats,
  getDashboardCharts,
  getRecentDoctors,
} from "../controllers/adminController";
import { protect, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect, requireAdmin);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts", getDashboardCharts);
router.get("/dashboard/recent-doctors", getRecentDoctors);

// Users
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUserByAdmin);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

// Doctors
router.get("/pending-doctors", getPendingDoctors);
router.put("/approve-doctor/:id", approveDoctor);
router.put("/reject-doctor/:id", rejectDoctor);


export default router;