import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const PYTHON_API = process.env.PYTHON_API_URL || "http://localhost:8000";

router.post("/chat", async (req: Request, res: Response) => {
  const { question, history = [] } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ message: "Question requise" });
  }

  try {
    const response = await axios.post(
      `${PYTHON_API}/chat`,
      { question, history },
      { timeout: 120000 }
    );

    return res.json(response.data);
  } catch (error: any) {
    console.error("Erreur Python API:", error.response?.data || error.message);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Service chatbot indisponible — vérifiez que api.py tourne",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur chatbot",
      error: error.response?.data || error.message,
    });
  }
});

export default router;