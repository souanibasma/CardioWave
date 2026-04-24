import { Request, Response } from "express";
import axios from "axios";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import ECG from "../models/ECG";
import ECGAnalysis from "../models/ECGAnalysis";
import User from "../models/User";

const FASTAPI_URL = "http://localhost:8000";
const AI_MODEL_URL = "http://localhost:8001";
const FLASK_API_URL = "http://localhost:5002";

// Helper to get absolute path of uploaded files
const getUploadPath = (filename: string) => {
  return path.join(__dirname, "..", "uploads", filename);
};

// 0) uploadECG (combined upload + analysis creation)
export const uploadECG = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    let { patientId, title } = req.body;

    if (!file) {
      res.status(400).json({ message: "Aucun fichier envoyé" });
      return;
    }

    if (!title) {
      res.status(400).json({ message: "Le titre est requis" });
      return;
    }

    // 1. Vérifier le patient si fourni
    let finalPatientId = null;
    if (patientId && patientId !== "null" && patientId !== "undefined" && patientId !== "") {
      const patient = await User.findOne({
        _id: patientId,
        role: "patient",
        assignedDoctor: (req as any).user?._id,
      });

      if (!patient) {
        res.status(403).json({ message: "Patient non autorisé ou introuvable" });
        return;
      }
      finalPatientId = patient._id;
    }

    // 2. Créer l'ECG
    const ecg = await ECG.create({
      title,
      originalImage: `uploads/ecgs/${file.filename}`,
      patient: finalPatientId,
      uploadedBy: (req as any).user?._id,
    });

    // 3. Créer l'Analyse automatiquement
    const analysis = await ECGAnalysis.create({
      ecg: ecg._id,
      status: "uploaded",
    });

    res.status(200).json({ ecg, analysis });
  } catch (error: any) {
    console.error("uploadECG error:", error);
    res.status(500).json({ message: error.message });
  }
};

// a) createAnalysisFromECG
export const createAnalysisFromECG = async (req: Request, res: Response) => {
  try {
    const { ecgId } = req.body;
    if (!ecgId) {
       res.status(400).json({ message: "ecgId requis" });
       return;
    }

    const ecg = await ECG.findById(ecgId);
    if (!ecg) {
       res.status(404).json({ message: "ECG introuvable" });
       return;
    }

    const analysis = await ECGAnalysis.create({
      ecg: ecgId,
      status: 'uploaded'
    });

    res.status(201).json(analysis);
  } catch (error: any) {
    console.error("createAnalysisFromECG error:", error);
    res.status(500).json({ message: error.message });
  }
};

// b) getECGAnalysisDetails
export const getECGAnalysisDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const analysis = await ECGAnalysis.findById(id)
      .populate({
        path: 'ecg',
        populate: { path: 'patient', select: 'fullName' }
      });

    if (!analysis) {
       res.status(404).json({ message: "Analyse introuvable" });
       return;
    }

    res.status(200).json(analysis);
  } catch (error: any) {
    console.error("getECGAnalysisDetails error:", error);
    res.status(500).json({ message: error.message });
  }
};

// c) digitizeECGAnalysis
export const digitizeECGAnalysis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const analysis = await ECGAnalysis.findById(id).populate('ecg');
    if (!analysis || !analysis.ecg) {
       res.status(404).json({ message: "Analyse ou ECG introuvable" });
       return;
    }

    const ecg = analysis.ecg as any;
    // Assuming originalImage is a relative path in backend/src/uploads/
    const imagePath = path.resolve(__dirname, "../", ecg.originalImage);
    
    if (!fs.existsSync(imagePath)) {
      res.status(400).json({ message: "Fichier image original introuvable sur le serveur: " + imagePath });
      return;
    }

    // Call FastAPI
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const response = await axios.post(`${FASTAPI_URL}/digitize`, formData, {
      headers: formData.getHeaders(),
    });

    const { plot_4leads, plot_12leads, plot_full_lead_ii, npy_file } = response.data;

    analysis.plotImage = plot_4leads;
    analysis.plot12leads = plot_12leads;
    analysis.plotFullLeadII = plot_full_lead_ii;
    analysis.npyFile = npy_file;
    analysis.status = 'digitized';

    await analysis.save();
    res.status(200).json(analysis);
  } catch (error: any) {
    console.error("digitizeECGAnalysis error:", error);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
};

// d) analyzeECGWithAI
export const analyzeECGWithAI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const analysis = await ECGAnalysis.findById(id);
    if (!analysis) {
       res.status(404).json({ message: "Analyse introuvable" });
       return;
    }

    if (analysis.status !== 'digitized') {
       res.status(400).json({ message: "L'ECG doit être digitalisé avant l'analyse IA" });
       return;
    }

    if (!analysis.npyFile) {
       res.status(400).json({ message: "Fichier .npy manquant" });
       return;
    }

    console.log(`[AI Analyze] Downloading NPY from: ${analysis.npyFile}`);
    const npyResponse = await axios.get(analysis.npyFile, { responseType: 'arraybuffer' });
    const npyBuffer = Buffer.from(npyResponse.data);

    // 1. Call AI Classification (Port 8001)
    console.log(`[AI Analyze] Calling AI Model at ${AI_MODEL_URL}/predict`);
    const formDataAI = new FormData();
    formDataAI.append('file', npyBuffer, { filename: 'signal.npy' });
    const resAI = await axios.post(`${AI_MODEL_URL}/predict`, formDataAI, {
      headers: formDataAI.getHeaders()
    });

    // 2. Call Flask Deterministic (Port 5002)
    console.log(`[AI Analyze] Calling Deterministic Rules at ${FLASK_API_URL}/api/ecg/analyze`);
    const formDataFlask = new FormData();
    formDataFlask.append('file', npyBuffer, { filename: 'signal.npy' });
    const resFlask = await axios.post(`${FLASK_API_URL}/api/ecg/analyze`, formDataFlask, {
      headers: formDataFlask.getHeaders()
    });

    const aiData = resAI.data;
    const flaskData = resFlask.data;

    // 3. Construct aiResult for frontend (ECGAnalysis.tsx)
    const combinedResult = {
      // Metrics (source: Flask)
      heart_rate: flaskData.data?.intervals?.hr,
      pr_interval: flaskData.data?.intervals?.pr,
      qrs_duration: flaskData.data?.intervals?.qrs,
      qtc: flaskData.data?.intervals?.qtc,
      rhythm: flaskData.data?.details?.rhythm,

      // AI Classification results (source: FastAPI)
      ai_classification: {
        status: aiData.summary?.status,
        confidence: aiData.n0?.confidence,
        anomalies: aiData.summary?.anomalies || [],
        n0: aiData.n0,
        n1: aiData.n1,
      },

      // Deterministic rules results (source: Flask)
      deterministic: {
        intervals: flaskData.data?.intervals,
        diagnosis: flaskData.data?.diagnosis,
        confidence: flaskData.data?.confidence,
        details: flaskData.data?.details,
      }
    };

    analysis.aiResult = combinedResult;
    analysis.status = 'analyzed';

    await analysis.save();
    console.log(`[AI Analyze] Success for analysis ${id}`);
    res.status(200).json(analysis);
  } catch (error: any) {
    console.error("analyzeECGWithAI error:", error);
    res.status(500).json({ message: error.response?.data?.detail || error.message });
  }
};

// e) saveDoctorNotes
export const saveDoctorNotes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const analysis = await ECGAnalysis.findByIdAndUpdate(id, { doctorNotes: notes }, { new: true });
    if (!analysis) {
       res.status(404).json({ message: "Analyse introuvable" });
       return;
    }

    res.status(200).json(analysis);
  } catch (error: any) {
    console.error("saveDoctorNotes error:", error);
    res.status(500).json({ message: error.message });
  }
};
