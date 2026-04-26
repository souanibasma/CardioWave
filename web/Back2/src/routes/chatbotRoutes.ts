import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();

// ⚠️ fixe temporairement pour éviter les erreurs ENV
const PYTHON_API = "http://127.0.0.1:8002";

router.post("/chat", async (req: Request, res: Response) => {
  const { question, history = [] } = req.body;

  // ✅ validation
  if (!question || !question.trim()) {
    return res.status(400).json({ message: "Question requise" });
  }

  try {
    const response = await axios.post(
      `${PYTHON_API}/chat`,
      {
        question,
        history,
      },
      {
        timeout: 120000, // évite timeout long
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("❌ Erreur Python API:");
    console.error(error.response?.data || error.message);

    // 🔥 cas où Python n’est pas lancé
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        message: "Chatbot indisponible (API Python non démarrée)",
      });
    }

    // 🔥 cas route incorrecte
    if (error.response?.status === 404) {
      return res.status(500).json({
        message: "Route /chat introuvable côté Python",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur chatbot",
      error: error.response?.data || error.message,
    });
  }
});

export default router;