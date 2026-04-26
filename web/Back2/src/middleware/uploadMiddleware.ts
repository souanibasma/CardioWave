import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// 📁 BON DOSSIER
const uploadDir = path.join(process.cwd(), "uploads/ecgs");

// créer dossier si inexistant
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // 👉 GARDE LE NOM ORIGINAL (important)
    const cleanName = file.originalname.replace(/\s+/g, "-");
    cb(null, cleanName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées"));
  }
};

const uploadEcg = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default uploadEcg;