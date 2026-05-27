import { Request, Response } from "express";
import axios from "axios";
import ECGAnalysis from "../models/ECGAnalysis"; // ✅ AJOUTE CETTE LIGNE

export const chatWithECG = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { message, history } = req.body;

    // Récupérer l'analyse ECG
    const analysis = await ECGAnalysis.findById(id).populate('ecg');
    if (!analysis) {
      res.status(404).json({ message: "Analyse introuvable" });
      return;
    }

    // Appeler le chatbot API
    const response = await axios.post("http://127.0.0.1:8002/chat", {
      message,
      aiResult: analysis.aiResult || {},
      doctorNotes: analysis.doctorNotes || "",
      patient: {},
      history: history || [],
    });

    res.status(200).json({ reply: response.data.reply });
  } catch (error: any) {
    console.error("chatWithECG error:", error);
    res.status(500).json({ message: error.message });
  }
};
export const askChatbot = async (req: Request, res: Response) => {
  try {
    const { question, history } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "La question est obligatoire",
      });
    }
    
    const response = await axios.post("http://127.0.0.1:8002/chat", {
      question: question,
      history: history || [],
    });

    return res.status(200).json({
      answer: response.data.answer,
      sources: response.data.sources || [],
    });
  } catch (error: any) {
    console.error("Erreur communication chatbot Python:");
    console.error(error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "Erreur lors de la communication avec le chatbot Python";

    return res.status(status).json({
      message,
      error: error.response?.data || error.message,
    });
  }
};