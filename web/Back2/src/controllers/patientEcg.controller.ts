import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import Ecg from "../models/ECG";
import ECGAnalysis from "../models/ECGAnalysis";

interface AuthRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    role: "admin" | "doctor" | "medecin" | "patient";
  };
  file?: Express.Multer.File;
}

export const sendEcgToDoctor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const patientId = req.user?.id || req.user?._id;
    const { doctorId, title, urgency, notes } = req.body;

    if (!patientId) {
      res.status(401).json({ message: "Utilisateur non authentifié." });
      return;
    }

    if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
      res.status(400).json({ message: "doctorId invalide." });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier ECG fourni." });
      return;
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: { $in: ["doctor", "medecin"] },
      isApproved: true,
    });

    if (!doctor) {
      res.status(404).json({ message: "Médecin introuvable ou non approuvé." });
      return;
    }

    await User.findByIdAndUpdate(patientId, {
      assignedDoctor: doctor._id,
    });

    const filePath = `uploads/ecgs/${req.file.filename}`;

    const ecg = await Ecg.create({
      patientId,
      doctorId: doctor._id,
      fileUrl: `/${filePath}`,
      originalFileName: req.file.originalname,
      status: "En attente",
      diagnosis: notes || "ECG en attente d’analyse",

      title: title || req.file.originalname,
      originalImage: filePath,
      patient: patientId,
      doctor: doctor._id,
      uploadedBy: patientId,
      urgent: urgency === "urgent" || urgency === "Urgente",
      result: "En attente",
    });

    const analysis = await ECGAnalysis.create({
      ecg: (ecg as any)._id,
      status: "uploaded",
      doctorNotes: "",
      aiResult: null,
    });

    res.status(201).json({
      message: "ECG envoyé avec succès.",
      ecg,
      analysis,
      analysisId: (analysis as any)._id,
    });
  } catch (error: any) {
    console.error("sendEcgToDoctor error:", error);
    res.status(500).json({
      message: error.message || "Erreur serveur.",
    });
  }
};