import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import ECG from "../models/ECG"; // adapte le chemin/nom selon ton projet
import ECGAnalysis from "../models/ECGAnalysis";
interface AuthRequest extends Request {
  user?: any;
}



// GET /api/doctor/profile
export const getDoctorProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctor = await User.findById(req.user._id).select("-password");

    if (!doctor) {
      res.status(404).json({ message: "Médecin introuvable" });
      return;
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du profil médecin" });
  }
};

// PUT /api/doctor/profile
export const updateDoctorProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      specialty,
      licenseNumber,
      hospitalOrClinic,
    } = req.body;

    const doctor = await User.findById(req.user._id);

    if (!doctor) {
      res.status(404).json({ message: "Médecin introuvable" });
      return;
    }

    if (email && email !== doctor.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        res.status(400).json({ message: "Cet email est déjà utilisé" });
        return;
      }

      doctor.email = email;
    }

    if (fullName !== undefined) doctor.fullName = fullName;
    if (phone !== undefined) doctor.phone = phone;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (licenseNumber !== undefined) doctor.licenseNumber = licenseNumber;
    if (hospitalOrClinic !== undefined) doctor.hospitalOrClinic = hospitalOrClinic;

    await doctor.save();

    const updatedDoctor = await User.findById(doctor._id).select("-password");

    res.status(200).json({
      message: "Profil médecin mis à jour avec succès",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("updateDoctorProfile error:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du profil médecin",
    });
  }
};
export const changeDoctorPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: "Les deux mots de passe sont requis" });
      return;
    }

    const doctor = await User.findById(req.user._id);

    if (!doctor) {
      res.status(404).json({ message: "Médecin introuvable" });
      return;
    }

    // Vérifier ancien mot de passe
    const isMatch = await bcrypt.compare(currentPassword, doctor.password);

    if (!isMatch) {
      res.status(400).json({ message: "Mot de passe actuel incorrect" });
      return;
    }

    // Hash nouveau mot de passe
    doctor.password = await bcrypt.hash(newPassword, 10);

    await doctor.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement de mot de passe" });
  }
};



// =========================
// DOCTOR DASHBOARD STATS
// =========================
export const getDoctorDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const totalPatients = await User.countDocuments({
      role: "patient",
      assignedDoctor: doctorId,
    });

    const totalAnalyses = await ECG.countDocuments({
      doctorId: doctorId,
    });

    const abnormalECGs = await ECG.countDocuments({
      doctorId: doctorId,
      status: "Anormal",
    });

    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = await ECG.countDocuments({
      doctorId: doctorId,
      createdAt: { $gte: startOfWeek },
    });

    res.status(200).json({
      totalPatients,
      totalAnalyses,
      abnormalECGs,
      thisWeek,
    });
  } catch (error) {
    console.error("Erreur getDoctorDashboardStats:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// =========================
// WEEKLY ANALYSIS DATA
// =========================
export const getDoctorWeeklyAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const result = [];

    const now = new Date();
    const currentDay = now.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const start = new Date(monday);
      start.setDate(monday.getDate() + i);

      const end = new Date(start);
      end.setDate(start.getDate() + 1);

      const analyses = await ECG.countDocuments({
        doctorId: doctorId,
        createdAt: { $gte: start, $lt: end },
      });

      result.push({
        day: days[i],
        analyses,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Erreur getDoctorWeeklyAnalysis:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// =========================
// RECENT PATIENTS
// =========================
export const getDoctorRecentPatients = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const patients = await User.find({
      role: "patient",
      assignedDoctor: doctorId,
    })
      .select("fullName dateOfBirth lastVisit riskLevel")
      .sort({ updatedAt: -1 })
      .limit(5);

    const formattedPatients = patients.map((patient: any) => {
      let age = null;
      if (patient.dateOfBirth) {
        const diff = Date.now() - new Date(patient.dateOfBirth).getTime();
        age = new Date(diff).getUTCFullYear() - 1970;
      }

      return {
        id: patient._id,
        name: patient.fullName,
        age,
        lastVisit: patient.lastVisit || patient.updatedAt,
        risk: patient.riskLevel || "Low",
      };
    });

    res.status(200).json(formattedPatients);
  } catch (error) {
    console.error("Erreur getDoctorRecentPatients:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// RECENT ECG ANALYSES
// =========================
export const getDoctorRecentAnalyses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const analyses = await ECG.find({ doctorId: doctorId })
      .populate("patientId", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedAnalyses = analyses.map((item: any) => ({
      id: item._id,
      patient: item.patientId?.fullName || "Patient inconnu",
      date: item.createdAt,
      result: item.status || "En attente",
      condition: item.diagnosis || "N/A",
      fileUrl: item.fileUrl,
      originalFileName: item.originalFileName,
    }));

    res.status(200).json(formattedAnalyses);
  } catch (error) {
    console.error("Erreur getDoctorRecentAnalyses:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


export const getDoctorReceivedECGs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctorId = req.user._id;

    const ecgs = await ECG.find({ doctorId })
      .populate("patientId", "fullName dateOfBirth")
      .sort({ createdAt: -1 });

    const formatted = await Promise.all(
      ecgs.map(async (ecg: any) => {
        const analysis = await ECGAnalysis.findOne({ ecg: ecg._id });

        let patientAge = null;

        if (ecg.patientId?.dateOfBirth) {
          const diff = Date.now() - new Date(ecg.patientId.dateOfBirth).getTime();
          patientAge = new Date(diff).getUTCFullYear() - 1970;
        }

        const createdAt = new Date(ecg.createdAt);

        return {
          id: String(ecg._id),
          analysisId: analysis ? String((analysis as any)._id) : "",
          patientNom: ecg.patientId?.fullName || "Patient inconnu",
          patientAge: patientAge ?? 0,
          patientId: ecg.patientId?._id ? String(ecg.patientId._id) : "",
          dateEnvoi: createdAt.toLocaleDateString("fr-FR"),
          heureEnvoi: createdAt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          fichier: ecg.originalFileName || ecg.title || "ECG",
          taille: "",
          statut: ecg.status || "En attente",
          fileUrl: ecg.fileUrl || `/${ecg.originalImage}`,
        };
      })
    );

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Erreur getDoctorReceivedECGs:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};