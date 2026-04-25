import { Request, Response } from "express";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import ECGAnalysis from "../models/ECGAnalysis";

// ── helpers ──────────────────────────────────────────────

function resolveImageUrl(rawPath: string): string {
  if (!rawPath) return "";
  if (rawPath.startsWith("http")) return rawPath;
  if (rawPath.includes("/files/")) {
    const clean = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
    return `http://localhost:8000${clean}`;
  }
  const clean = rawPath.replace(/\\/g, "/");
  const normalized = clean.startsWith("/") ? clean : `/${clean}`;
  return `http://localhost:5000${normalized}`;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string): string {
  return status === "ANORMAL" || status === "TACHYCARDIA" ? "#DC2626" : "#059669";
}

function buildMetricRow(
  label: string,
  value: any,
  unit: string,
  min?: number,
  max?: number
): string {
  const val = Number(value);
  const isNormal = min !== undefined
    ? val >= min && val <= (max ?? Infinity)
    : val <= (max ?? Infinity);
  const statusColor = isNormal ? "#059669" : "#D97706";
  const statusLabel = isNormal ? "Normal" : val > (max ?? 0) ? "Élevé" : "Faible";

  return `
    <tr>
      <td style="padding:10px 16px;color:#334155;font-size:13px;">${label}</td>
      <td style="padding:10px 16px;font-weight:700;font-size:14px;color:#0F172A;">
        ${value ?? "—"} <span style="font-weight:400;color:#94A3B8;font-size:12px;">${unit}</span>
      </td>
      <td style="padding:10px 16px;">
        <span style="color:${statusColor};font-size:12px;font-weight:600;">${statusLabel}</span>
      </td>
    </tr>`;
}

function buildChatSummarySection(chatSummary?: string): string {
  if (!chatSummary) return "";
  return `
    <div style="margin-top:28px;">
      <h2 style="font-size:16px;font-weight:700;color:#0F172A;margin:0 0 12px;
                 padding-bottom:8px;border-bottom:2px solid #E2E8F0;">
        Résumé de la consultation IA
      </h2>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;
                  padding:16px;font-size:13px;color:#334155;line-height:1.7;">
        ${chatSummary}
      </div>
    </div>`;
}

function buildAnomaliesSection(aiClassification: any): string {
  if (!aiClassification?.n1?.positives) return "";
  const categoryLabels: Record<string, string> = {
    cd: "Troubles de conduction",
    arrhythmia: "Arythmies",
    ihd: "Ischémie cardiaque",
    beat: "Battements anormaux",
    hyp: "Hypertrophie",
  };
  const entries = Object.entries(aiClassification.n1.positives)
    .filter(([, list]: [string, any]) => list.length > 0);

  if (entries.length === 0) return "";

  return `
    <div style="margin-top:20px;">
      <h3 style="font-size:14px;font-weight:700;color:#0F172A;margin:0 0 10px;">
        Anomalies détectées par catégorie
      </h3>
      <div style="display:flex;flex-wrap:wrap;gap:10px;">
        ${entries.map(([key, list]: [string, any]) => `
          <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;">
            <div style="font-size:11px;font-weight:700;color:#991B1B;text-transform:uppercase;
                        letter-spacing:0.5px;margin-bottom:6px;">
              ${categoryLabels[key] || key}
            </div>
            ${list.map((code: string) => `
              <span style="display:inline-block;background:#DC2626;color:#fff;
                           padding:2px 8px;border-radius:4px;font-size:12px;
                           font-weight:700;margin-right:4px;">${code}</span>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </div>`;
}

// ── HTML template ─────────────────────────────────────────

function buildHTML(analysis: any, chatSummary?: string): string {
  const ecg = analysis.ecg || {};
  const aiResult = analysis.aiResult || {};
  const aiClass = aiResult.ai_classification || {};
  const deterministic = aiResult.deterministic || {};
  const metrics = {
    hr: aiResult.heart_rate ?? aiResult.hr ?? "—",
    pr: aiResult.pr_interval ?? aiResult.pr ?? "—",
    qrs: aiResult.qrs_duration ?? aiResult.qrs ?? "—",
    qtc: aiResult.qtc ?? "—",
  };

  const originalImage = resolveImageUrl(ecg.originalImage || "");
  const plot4leads = resolveImageUrl(analysis.plotImage || "");
  const plot12leads = resolveImageUrl(analysis.plot12leads || "");
  const plotLeadII = resolveImageUrl(analysis.plotFullLeadII || "");

  const statusColor = getStatusColor(aiClass.status || "");
  const confidence = aiClass.confidence
    ? `${(aiClass.confidence * 100).toFixed(1)}%`
    : "—";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #fff;
      color: #0F172A;
      font-size: 13px;
    }
    .page { padding: 40px 48px; max-width: 900px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    h2 { font-size: 16px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    tr:nth-child(even) { background: #F8FAFC; }
    img { max-width: 100%; border-radius: 8px; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
<div class="page">

  <!-- ── EN-TÊTE ── -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;
              padding-bottom:20px;border-bottom:3px solid #0F172A;margin-bottom:28px;">
    <div>
      <h1>Rapport d'Analyse ECG</h1>
      <p style="color:#64748B;margin-top:6px;font-size:13px;">
        Généré le ${formatDate(new Date())}
      </p>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;
                  letter-spacing:0.5px;margin-bottom:4px;">ID Analyse</div>
      <div style="font-size:12px;font-weight:600;color:#334155;">${analysis._id}</div>
    </div>
  </div>

  <!-- ── INFOS PATIENT ── -->
  <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;
              padding:20px 24px;margin-bottom:28px;">
    <h2 style="margin-bottom:14px;color:#0F172A;">Informations patient</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
      <div>
        <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;
                    letter-spacing:0.5px;margin-bottom:4px;">Patient</div>
        <div style="font-weight:600;font-size:14px;">
          ${ecg.patient?.fullName || "Non renseigné"}
        </div>
      </div>
      <div>
        <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;
                    letter-spacing:0.5px;margin-bottom:4px;">Titre ECG</div>
        <div style="font-weight:600;font-size:14px;">${ecg.title || "—"}</div>
      </div>
      <div>
        <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;
                    letter-spacing:0.5px;margin-bottom:4px;">Date d'analyse</div>
        <div style="font-weight:600;font-size:14px;">
          ${ecg.createdAt ? formatDate(ecg.createdAt) : "—"}
        </div>
      </div>
    </div>
  </div>

  <!-- ── RÉSULTAT IA ── -->
  ${analysis.status === "analyzed" && aiClass.status ? `
  <div style="border-left:6px solid ${statusColor};background:${aiClass.status === "ANORMAL" ? "#FEF2F2" : "#ECFDF5"};
              border-radius:0 12px 12px 0;padding:20px 24px;margin-bottom:28px;">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:11px;color:#64748B;text-transform:uppercase;
                    letter-spacing:0.5px;margin-bottom:6px;">Classification IA</div>
        <div style="font-size:26px;font-weight:800;color:${statusColor};">
          ${aiClass.status}
        </div>
        <div style="font-size:13px;color:#64748B;margin-top:4px;">
          Confiance du modèle : <strong>${confidence}</strong>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;color:#64748B;margin-bottom:4px;">Statut du dossier</div>
        <span style="background:#ECFDF5;color:#059669;padding:4px 12px;
                     border-radius:20px;font-size:12px;font-weight:700;
                     border:1px solid #10B981;">Analysé</span>
      </div>
    </div>
    ${buildAnomaliesSection(aiClass)}
  </div>
  ` : `
  <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;
              padding:16px 20px;margin-bottom:28px;color:#92400E;font-size:13px;">
    Analyse IA non encore effectuée pour ce dossier.
  </div>
  `}

  <!-- ── MÉTRIQUES ── -->
  <div style="margin-bottom:28px;">
    <h2 style="margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #E2E8F0;">
      Métriques cliniques
    </h2>
    <table style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#F1F5F9;">
          <th style="padding:10px 16px;text-align:left;font-size:12px;
                     color:#64748B;font-weight:600;">Paramètre</th>
          <th style="padding:10px 16px;text-align:left;font-size:12px;
                     color:#64748B;font-weight:600;">Valeur</th>
          <th style="padding:10px 16px;text-align:left;font-size:12px;
                     color:#64748B;font-weight:600;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${buildMetricRow("Fréquence cardiaque", metrics.hr, "bpm", 60, 100)}
        ${buildMetricRow("Intervalle PR", metrics.pr, "ms", 120, 200)}
        ${buildMetricRow("Durée QRS", metrics.qrs, "ms", 60, 100)}
        ${buildMetricRow("QTc", metrics.qtc, "ms", undefined, 450)}
        ${deterministic.diagnosis ? `
        <tr>
          <td style="padding:10px 16px;color:#334155;font-size:13px;">
            Diagnostic déterministe
          </td>
          <td colspan="2" style="padding:10px 16px;font-weight:700;font-size:13px;
              color:${getStatusColor(deterministic.diagnosis)};">
            ${deterministic.diagnosis}
          </td>
        </tr>` : ""}
        ${deterministic.details?.rhythm ? `
        <tr>
          <td style="padding:10px 16px;color:#334155;font-size:13px;">Rythme</td>
          <td colspan="2" style="padding:10px 16px;font-size:13px;color:#334155;">
            ${deterministic.details.rhythm}
          </td>
        </tr>` : ""}
      </tbody>
    </table>
  </div>

  <!-- ── NOTES MÉDECIN ── -->
  ${analysis.doctorNotes ? `
  <div style="margin-bottom:28px;">
    <h2 style="margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #E2E8F0;">
      Notes du médecin
    </h2>
    <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:10px;
                padding:16px;font-size:13px;color:#0C4A6E;line-height:1.7;
                white-space:pre-wrap;">
      ${analysis.doctorNotes}
    </div>
  </div>` : ""}

  <!-- ── RÉSUMÉ CHAT ── -->
  ${buildChatSummarySection(chatSummary)}

  <!-- ── PAGE 2 : PLOTS ECG ── -->
  ${(plot4leads || plot12leads || plotLeadII || originalImage) ? `
  <div class="page-break" style="margin-top:40px;">
    <h2 style="margin-bottom:20px;padding-bottom:8px;border-bottom:2px solid #E2E8F0;">
      Visualisations ECG
    </h2>

    ${originalImage ? `
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;color:#64748B;text-transform:uppercase;
                  letter-spacing:0.5px;margin-bottom:8px;font-weight:600;">
        ECG Original
      </div>
      <img src="${originalImage}" style="width:100%;border:1px solid #E2E8F0;"/>
    </div>` : ""}

    ${plot4leads ? `
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;color:#64748B;text-transform:uppercase;
                  letter-spacing:0.5px;margin-bottom:8px;font-weight:600;">
        Signal digitalisé — 4 dérivations
      </div>
      <img src="${plot4leads}" style="width:100%;border:1px solid #E2E8F0;"/>
    </div>` : ""}

    ${plot12leads ? `
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;color:#64748B;text-transform:uppercase;
                  letter-spacing:0.5px;margin-bottom:8px;font-weight:600;">
        Reconstruction 12 dérivations
      </div>
      <img src="${plot12leads}" style="width:100%;border:1px solid #E2E8F0;"/>
    </div>` : ""}

    ${plotLeadII ? `
    <div style="margin-bottom:24px;">
      <div style="font-size:12px;color:#64748B;text-transform:uppercase;
                  letter-spacing:0.5px;margin-bottom:8px;font-weight:600;">
        Dérivation II continue (Full Lead II)
      </div>
      <img src="${plotLeadII}" style="width:100%;border:1px solid #E2E8F0;"/>
    </div>` : ""}
  </div>` : ""}

  <!-- ── PIED DE PAGE ── -->
  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #E2E8F0;
              display:flex;justify-content:space-between;color:#94A3B8;font-size:11px;">
    <span>Rapport généré automatiquement — ECG Cascade Pipeline</span>
    <span>Document confidentiel — Usage médical uniquement</span>
  </div>

</div>
</body>
</html>`;
}

// ── Controller ────────────────────────────────────────────

export const generateReport = async (req: Request, res: Response) => {
  try {
    const { analysisId } = req.params;
    const { chatSummary } = req.body; // résumé optionnel du chat

    // 1. Récupérer l'analyse depuis MongoDB
    const analysis = await ECGAnalysis.findById(analysisId).populate({
      path: "ecg",
      populate: { path: "patient", select: "fullName" },
    });

    if (!analysis) {
      return res.status(404).json({ message: "Analyse introuvable" });
    }

    // 2. Créer le dossier reports s'il n'existe pas
    const reportsDir = path.join(__dirname, "..", "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // 3. Générer le HTML
    const html = buildHTML(analysis.toObject(), chatSummary);

    // 4. Lancer Puppeteer et générer le PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const fileName = `ecg_${analysisId}_report.pdf`;
    const filePath = path.join(reportsDir, fileName);

    await page.pdf({
      path: filePath,
      format: "A4",
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
      printBackground: true,
    });

    await browser.close();

    // 5. Sauvegarder l'URL dans MongoDB
    const reportUrl = `/uploads/reports/${fileName}`;
    await analysis.updateOne({ reportUrl });
    // 6. Retourner l'URL au frontend
    return res.status(200).json({
      message: "Rapport généré avec succès",
      reportUrl: `http://localhost:5000${reportUrl}`,
    });
  } catch (error: any) {
    console.error("[reportController] Error:", error);
    return res.status(500).json({
      message: "Erreur génération PDF",
      error: error.message,
    });
  }
};