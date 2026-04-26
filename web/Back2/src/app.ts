import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import patientRoutes from "./routes/patientRoutes";
import articleRoutes from "./routes/articleRoutes";
import publicArticleRoutes from "./routes/publicArticleRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import doctorDashboardRoutes from "./routes/doctorDashboardRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import ecgAnalysisRoutes from "./routes/ecgAnalysisRoutes";

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Auth & core modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// ECG Upload
app.use("/api/ecg", ecgAnalysisRoutes);

// ECG Analysis
app.use("/api/ecg-analysis", ecgAnalysisRoutes);

// Doctor dashboard
app.use("/api/doctor/dashboard", doctorDashboardRoutes);

// Admin notifications
app.use("/api/admin/notifications", notificationRoutes);

// Admin article management
app.use("/api/admin/articles", articleRoutes);

// Public / doctor article reading, likes, comments
app.use("/api/articles", publicArticleRoutes);

import chatbotRoutes from "./routes/chatbotRoutes";
app.use("/api/chatbot", chatbotRoutes);

// Auth & core modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// Uploads
app.use("/api/upload", uploadRoutes);

// Doctor dashboard
app.use("/api/doctor/dashboard", doctorDashboardRoutes);

// Admin notifications
app.use("/api/admin/notifications", notificationRoutes);

// Admin article management
app.use("/api/admin/articles", articleRoutes);

// Public / doctor article reading, likes, comments
app.use("/api/articles", publicArticleRoutes);

app.use("/api/chatbot", chatbotRoutes);

import doctorPatientsRoutes from "./routes/doctorPatients.routes";



// fichiers statiques ECG
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static("uploads"));
app.use("/api/doctor", doctorPatientsRoutes);
app.use("/api/chatbot", chatbotRoutes);
export default app;
