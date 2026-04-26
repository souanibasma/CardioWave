import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import ECG from "../models/ECG";

import ECGAnalysis from "../models/ECGAnalysis";
interface AuthRequest extends Request {
  user?: any;
}

// GET /api/patient/profile
export const getPatientProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const patient = await User.findById(req.user._id)
      .select("-password")
      .populate("assignedDoctor", "fullName email specialty hospitalOrClinic");

    if (!patient) {
      res.status(404).json({ message: "Patient introuvable" });
      return;
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("getPatientProfile error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du profil patient" });
  }
};

// PUT /api/patient/profile
export const updatePatientProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, phone, dateOfBirth, gender } = req.body;

    const patient = await User.findById(req.user._id);

    if (!patient) {
      res.status(404).json({ message: "Patient introuvable" });
      return;
    }

    if (email && email !== patient.email) {
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        res.status(400).json({ message: "Cet email est déjà utilisé" });
        return;
      }

      patient.email = email;
    }

    if (fullName !== undefined) patient.fullName = fullName;
    if (phone !== undefined) patient.phone = phone;
    if (dateOfBirth !== undefined) {
      patient.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    }
    if (gender !== undefined) patient.gender = gender;

    await patient.save();

    const updatedPatient = await User.findById(patient._id).select("-password");

    res.status(200).json({
      message: "Profil patient mis à jour avec succès",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("updatePatientProfile error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil patient" });
  }
};

// GET /api/patient/doctors
export const getApprovedDoctors = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const doctors = await User.find({
      role: "doctor",
      isApproved: true,
    }).select("fullName email specialty hospitalOrClinic");

    res.status(200).json(doctors);
  } catch (error) {
    console.error("getApprovedDoctors error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des médecins" });
  }
};

// PUT /api/patient/assign-doctor/:doctorId
export const assignDoctorToPatient = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      isApproved: true,
    });

    if (!doctor) {
      res.status(404).json({ message: "Médecin introuvable ou non approuvé" });
      return;
    }

    const patient = await User.findById(req.user._id);

    if (!patient) {
      res.status(404).json({ message: "Patient introuvable" });
      return;
    }

    patient.assignedDoctor = doctor._id;
    await patient.save();

    res.status(200).json({
      message: "Médecin assigné avec succès",
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specialty: doctor.specialty,
        hospitalOrClinic: doctor.hospitalOrClinic,
      },
    });
  } catch (error) {
    console.error("assignDoctorToPatient error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l’assignation du médecin" });
  }
};

// GET /api/patient/my-doctor
export const getMyDoctor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const patient = await User.findById(req.user._id).populate(
      "assignedDoctor",
      "fullName email specialty hospitalOrClinic"
    );

    if (!patient) {
      res.status(404).json({ message: "Patient introuvable" });
      return;
    }

    res.status(200).json(patient.assignedDoctor || null);
  } catch (error) {
    console.error("getMyDoctor error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du médecin" });
  }
};

// POST /api/patient/
export const uploadPatientECG = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, urgency, notes, doctorId } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier ECG fourni" });
      return;
    }

    const patient = await User.findById(req.user._id);

    if (!patient) {
      res.status(404).json({ message: "Patient introuvable" });
      return;
    }

    const finalDoctorId = doctorId || patient.assignedDoctor;

    if (!finalDoctorId) {
      res.status(400).json({ message: "Aucun médecin assigné" });
      return;
    }

    const filePath = `uploads/ecgs/${req.file.filename}`;

    const ecg = await ECG.create({
      patientId: patient._id,
      doctorId: finalDoctorId,
      fileUrl: `/${filePath}`,
      originalFileName: req.file.originalname,
      diagnosis: notes || "ECG en attente d’analyse",

      patient: patient._id,
      doctor: finalDoctorId,
      uploadedBy: patient._id,
      title: title || req.file.originalname,
      originalImage: filePath,
      urgent: urgency === "urgente" || urgency === "urgent",
      status: "En attente",
      result: "En attente",
    });

    const analysis = await ECGAnalysis.create({
      ecg: (ecg as any)._id,
      status: "uploaded",
    });

    res.status(201).json({
      message: "ECG envoyé avec succès",
      ecg,
      analysis,
      analysisId: (analysis as any)._id,
    });
  } catch (error) {
    console.error("uploadPatientECG error:", error);
    res.status(500).json({ message: "Erreur lors de l’envoi de l’ECG" });
  }
};
// GET /api/patient/ecgs
export const getPatientECGs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ecgs = await ECG.find({ patient: req.user._id })
      .populate("doctor", "fullName specialty")
      .sort({ createdAt: -1 });

    res.status(200).json(ecgs);
  } catch (error) {
    console.error("getPatientECGs error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des ECG" });
  }
};

// GET /api/patient/ecgs/:id
export const getPatientECGById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ecg = await ECG.findOne({
      _id: req.params.id,
      patient: req.user._id,
    }).populate("doctor", "fullName specialty hospitalOrClinic");

    if (!ecg) {
      res.status(404).json({ message: "ECG introuvable" });
      return;
    }

    res.status(200).json(ecg);
  } catch (error) {
    console.error("getPatientECGById error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l’ECG" });
  }
};

// DELETE /api/patient/ecgs/:id
export const deletePatientECG = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ecg = await ECG.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!ecg) {
      res.status(404).json({ message: "ECG introuvable" });
      return;
    }

    await ecg.deleteOne();

    res.status(200).json({ message: "ECG supprimé avec succès" });
  } catch (error) {
    console.error("deletePatientECG error:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l’ECG" });
  }
};

// PUT /api/patient/change-password
export const changePatientPassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        message: "Current password and new password are required",
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        message: "The new password must contain at least 6 characters",
      });
      return;
    }

    const patient = await User.findById(req.user?._id);

    if (!patient) {
      res.status(404).json({
        message: "Patient not found",
      });
      return;
    }

    if (patient.role !== "patient") {
      res.status(403).json({
        message: "Access restricted to patients only",
      });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, patient.password);

    if (!isMatch) {
      res.status(400).json({
        message: "Current password is incorrect",
      });
      return;
    }

    patient.password = await bcrypt.hash(newPassword, 10);
    await patient.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("changePatientPassword error:", error);
    res.status(500).json({
      message: "Error while changing password",
    });
  }
};
// GET /api/patient/ecgs/stats
export const getPatientECGStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.user?._id;

    const [total, analysed, pending, urgent] = await Promise.all([
      ECG.countDocuments({ patient: patientId }),
      ECG.countDocuments({ patient: patientId, status: "Analysé" }),
      ECG.countDocuments({ patient: patientId, status: "En attente" }),
      ECG.countDocuments({ patient: patientId, urgency: "urgente" }),
    ]);

    res.status(200).json({
      total,
      analysed,
      pending,
      urgent,
    });
  } catch (error) {
    console.error("getPatientECGStats error:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques ECG",
    });
  }
};