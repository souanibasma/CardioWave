import { Request, Response } from "express";
import User from "../models/User";
import ECG from "../models/ECG";
import ECGAnalysis from "../models/ECGAnalysis"; // ← ajouter cette ligne

interface AuthRequest extends Request {
  user?: any;
}

const calculateAge = (dateOfBirth?: string | Date) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const diff = Date.now() - dob.getTime();
  return new Date(diff).getUTCFullYear() - 1970;
};

const formatRelativeTime = (date: string | Date) => {
  const now = new Date().getTime();
  const target = new Date(date).getTime();
  const diffMs = now - target;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Il y a moins d'1h";
  if (diffHours < 24) return `Il y a ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays}j`;
};

export const getDoctorDashboardOverview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const receivedToday = await ECG.countDocuments({
      doctor: doctorId,
      createdAt: { $gte: startToday },
    });

    const abnormalDetected = await ECG.countDocuments({
      doctor: doctorId,
      result: "Anormal",
    });

    const activePatients = await User.countDocuments({
      role: "patient",
      assignedDoctor: doctorId,
    });

    const pendingAnalyses = await ECG.countDocuments({
      doctor: doctorId,
      status: "pending",
    });

    res.status(200).json({
      receivedToday,
      abnormalDetected,
      activePatients,
      pendingAnalyses,
    });
  } catch (error) {
    console.error("getDoctorDashboardOverview:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDoctorRecentECGs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const ecgs = await ECG.find({ doctor: doctorId })
      .populate("patient", "fullName dateOfBirth")
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = await Promise.all(ecgs.map(async (ecg: any) => {
      const analysis = await ECGAnalysis.findOne({ ecg: ecg._id });
      return {
        id: ecg._id,
        analysisId: analysis ? analysis._id : null,
        patient: ecg.patient?.fullName || "Patient inconnu",
        age: calculateAge(ecg.patient?.dateOfBirth),
        date: new Date(ecg.createdAt).toLocaleString("fr-FR"),
        statut: analysis?.status || "uploaded",
        type: ecg.title || "ECG",
        urgent: ecg.urgent || false,
      };
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("getDoctorRecentECGs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDoctorAlerts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const alerts = await ECG.find({
      doctor: doctorId,
      result: "Anormal",
    })
      .populate("patient", "fullName")
      .sort({ createdAt: -1 })
      .limit(3);

    const formatted = alerts.map((item: any) => ({
      id: item._id,
      patient: item.patient?.fullName || "Patient inconnu",
      condition: item.condition || "Condition inconnue",
      time: formatRelativeTime(item.createdAt),
      severity: item.urgent ? "high" : "medium",
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("getDoctorAlerts:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDoctorWeeklyChart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Exemple statique initial, à remplacer plus tard par aggregation Mongo
    res.status(200).json({
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      normal: [8, 11, 7, 9, 10, 5, 3],
      abnormal: [2, 3, 1, 4, 3, 1, 1],
    });
  } catch (error) {
    console.error("getDoctorWeeklyChart:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDoctorDistributionChart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Version simple initiale
    res.status(200).json({
      labels: ["Sinus Normal", "Fibrillation Auric.", "Bradycardie", "Autres"],
      values: [68, 12, 10, 10],
    });
  } catch (error) {
    console.error("getDoctorDistributionChart:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getDoctorMonthlyTrendChart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Version simple initiale
    res.status(200).json({
      labels: ["Jan", "Fév", "Mar", "Avr"],
      received: [38, 45, 41, 52],
      abnormal: [6, 9, 7, 12],
    });
  } catch (error) {
    console.error("getDoctorMonthlyTrendChart:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};