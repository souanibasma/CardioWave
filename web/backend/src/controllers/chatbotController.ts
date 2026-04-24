import { Request, Response } from "express";
import axios from "axios";

export const askChatbot = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        message: "La question est obligatoire",
      });
    }

    const response = await axios.post("http://127.0.0.1:8000/chat", {
      question,
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