import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import path from "path";
import fs from "fs";
import { decryptFile } from "../utils/ecgCrypto";

export const serveECGFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const rawFilename = req.params.filename;
  const filename = Array.isArray(rawFilename) ? rawFilename[0] : rawFilename;
  const safeName = path.basename(filename);
  const filePath = path.join(process.cwd(), "src/uploads/ecgs", safeName);
  console.log("📁 process.cwd():", process.cwd());
  console.log("📄 filePath:", filePath);
  console.log("✅ Existe?", fs.existsSync(filePath));
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: "Fichier introuvable" });
    return;
  }

  // ✅ Essayer de déchiffrer, sinon servir directement (anciens fichiers)
  let fileBuffer: Buffer;
  try {
    fileBuffer = decryptFile(filePath);       // nouveau fichier chiffré
  } catch (err) {
    fileBuffer = fs.readFileSync(filePath);   // ancien fichier non chiffré
  }

  const ext = path.extname(safeName).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".dcm": "application/dicom"
  };

  res.setHeader("Content-Type", mimeTypes[ext] || "application/octet-stream");
  res.send(fileBuffer);
};