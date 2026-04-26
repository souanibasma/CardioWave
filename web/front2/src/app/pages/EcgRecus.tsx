import { useEffect, useMemo, useState } from "react";
import { MedecinLayout } from "../components/MedecinLayout";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Activity,
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Filter,
  Calendar,
  FileText,
  SortAsc,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDoctorReceivedECGs } from "../../services/api";

type StatutEcg =
  | "En attente"
  | "En cours"
  | "Traité"
  | "Normal"
  | "Anormal";

interface EcgRecu {
  id: string;
  patientNom: string;
  patientAge: number;
  patientId: string;
  dateEnvoi: string;
  heureEnvoi: string;
  fichier: string;
  taille: string;
  statut: StatutEcg;
  fileUrl: string;
  analysisId: string;
}

const statutConfig: Record<
  StatutEcg,
  { bg: string; color: string; icon: React.ReactNode }
> = {
  "En attente": {
    bg: "#FEF3C7",
    color: "#854F0B",
    icon: <Clock className="w-3 h-3" />,
  },
  "En cours": {
    bg: "#EEF2FF",
    color: "#534AB7",
    icon: <Activity className="w-3 h-3" />,
  },
  Traité: {
    bg: "#E8F5F2",
    color: "#0F6E56",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  Normal: {
    bg: "#E8F5F2",
    color: "#0F6E56",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  Anormal: {
    bg: "#FCEBEB",
    color: "#A32D2D",
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

const avatarColors = [
  "#EEF2FF",
  "#E1F5EE",
  "#FCEBEB",
  "#FEF3C7",
  "#E6F1FB",
  "#FBEAF0",
];

const avatarTextColors = [
  "#534AB7",
  "#0F6E56",
  "#A32D2D",
  "#854F0B",
  "#185FA5",
  "#993556",
];

function getInitials(nom: string) {
  const parts = nom.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return nom.slice(0, 2).toUpperCase();
}

function normalizeStatus(status: string | undefined): StatutEcg {
  if (!status) return "En attente";

  const s = status.trim().toLowerCase();

  if (s === "en attente") return "En attente";
  if (s === "en cours") return "En cours";
  if (s === "traité" || s === "traite") return "Traité";
  if (s === "normal") return "Normal";
  if (s === "anormal") return "Anormal";

  return "En attente";
}

function parseFrenchDateTime(dateEnvoi: string, heureEnvoi: string) {
  const [day, month, year] = dateEnvoi.split("/");
  const [hour = "00", minute = "00"] = heureEnvoi.split(":");
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  ).getTime();
}

type FiltreStatut = "tous" | StatutEcg;

export default function EcgRecus() {
  const [ecgsRecus, setEcgsRecus] = useState<EcgRecu[]>([]);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState<FiltreStatut>("tous");
  const [triDate, setTriDate] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchECGs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctorReceivedECGs();

        const normalized: EcgRecu[] = (Array.isArray(data) ? data : []).map(
      (item: any) => ({
        id: String(item.id ?? item._id ?? ""),
        analysisId: String(item.analysisId ?? ""),
        patientNom: item.patientNom ?? "Patient inconnu",
        patientAge: Number(item.patientAge ?? 0),
        patientId: String(item.patientId ?? ""),
        dateEnvoi: item.dateEnvoi ?? "",
        heureEnvoi: item.heureEnvoi ?? "",
        fichier: item.fichier ?? "ECG",
        taille: item.taille ?? "",
        statut: normalizeStatus(item.statut ?? item.status),
        fileUrl: item.fileUrl ?? "",
      })
    );

        setEcgsRecus(normalized);
      } catch (err: any) {
        console.error("Erreur chargement ECG reçus :", err);
        setError(
          err?.response?.data?.message ||
            "Erreur lors du chargement des ECG reçus"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchECGs();
  }, []);

  const enAttente = ecgsRecus.filter((e) => e.statut === "En attente").length;
  const normaux = ecgsRecus.filter((e) => e.statut === "Normal").length;
  const anormaux = ecgsRecus.filter((e) => e.statut === "Anormal").length;

  const filtered = useMemo(() => {
    return ecgsRecus
      .filter((e) => {
        const matchSearch =
          e.patientNom.toLowerCase().includes(search.toLowerCase()) ||
          e.fichier.toLowerCase().includes(search.toLowerCase());

        const matchStatut =
          filtreStatut === "tous" || e.statut === filtreStatut;

        return matchSearch && matchStatut;
      })
      .sort((a, b) => {
        const da = parseFrenchDateTime(a.dateEnvoi, a.heureEnvoi);
        const db = parseFrenchDateTime(b.dateEnvoi, b.heureEnvoi);
        return triDate === "desc" ? db - da : da - db;
      });
  }, [ecgsRecus, search, filtreStatut, triDate]);

  const handleDownload = (ecg: EcgRecu) => {
    if (!ecg.fileUrl) return;

    const a = document.createElement("a");
    a.href = `http://localhost:5000${ecg.fileUrl}`;
    a.download = ecg.fichier || "ecg";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}
          >
            <Inbox className="w-6 h-6" style={{ color: "#534AB7" }} />
          </div>
          <div>
            <h1
              className="text-3xl font-bold leading-none mb-1"
              style={{
                fontFamily: "var(--font-family-heading)",
                color: "var(--text-primary)",
              }}
            >
              ECG Reçus
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
              Boîte de réception · {ecgsRecus.length} fichiers au total
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              En attente
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {enAttente}
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              ECG normaux
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {normaux}
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="text-xs mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              ECG anormaux
            </div>
            <div
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {anormaux}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-2xl"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="relative"
            style={{ minWidth: "180px", flex: 1, maxWidth: "280px" }}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "var(--text-secondary)" }}
            />
            <Input
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8"
              style={{ borderRadius: "8px", fontSize: "13px" }}
            />
          </div>

          <div
            className="w-px h-5"
            style={{ background: "var(--border-color)" }}
          />

          <div className="flex items-center gap-1.5">
            <Filter
              className="w-3.5 h-3.5"
              style={{ color: "var(--text-secondary)" }}
            />
            {(
              ["tous", "En attente", "Normal", "Anormal"] as FiltreStatut[]
            ).map((f) => (
              <button
                key={f}
                onClick={() => setFiltreStatut(f)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: filtreStatut === f ? 500 : 400,
                  border:
                    filtreStatut === f
                      ? "1.5px solid var(--primary)"
                      : "1px solid var(--border-color)",
                  background:
                    filtreStatut === f ? "var(--primary)" : "transparent",
                  color:
                    filtreStatut === f ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {f === "tous" ? "Tous" : f}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTriDate((t) => (t === "desc" ? "asc" : "desc"))}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              border: "1px solid var(--border-color)",
              background: "transparent",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginLeft: "auto",
            }}
          >
            <SortAsc className="w-3 h-3" />
            {triDate === "desc" ? "Plus récents" : "Plus anciens"}
          </button>
        </div>

        <div
          style={{
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            background: "var(--surface)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.1fr 0.9fr auto",
              padding: "10px 20px",
              background: "var(--background)",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            {[
              "Patient / Fichier ECG",
              "Date de réception",
              "Statut",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div
              className="text-center py-14"
              style={{ color: "var(--text-secondary)" }}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-25" />
              <p className="text-sm">Chargement des ECG...</p>
            </div>
          ) : error ? (
            <div className="text-center py-14" style={{ color: "#C62828" }}>
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-sm">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-14"
              style={{ color: "var(--text-secondary)" }}
            >
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-25" />
              <p className="text-sm">Aucun ECG trouvé</p>
            </div>
          ) : (
            filtered.map((ecg, idx) => {
              const statut = statutConfig[ecg.statut];
              const initials = getInitials(ecg.patientNom);
              const avatarIndex =
                Number(String(ecg.patientId).slice(-1)) || idx % avatarColors.length;
              const avatarBg = avatarColors[avatarIndex % avatarColors.length];
              const avatarTxt =
                avatarTextColors[avatarIndex % avatarTextColors.length];
              const isLast = idx === filtered.length - 1;

              return (
                <div
                  key={ecg.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.1fr 0.9fr auto",
                    alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid var(--border-color)",
                    background: "transparent",
                    transition: "background 0.12s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--background)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <div
                      style={{
                        width: "3px",
                        height: "38px",
                        borderRadius: "2px",
                        background: "var(--border-color)",
                        flexShrink: 0,
                      }}
                    />
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                      style={{ background: avatarBg, color: avatarTxt }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {ecg.patientNom}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {ecg.patientAge} ans
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: "var(--text-secondary)" }}
                        />
                        <span
                          className="text-xs truncate"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {ecg.fichier}
                        </span>
                        {ecg.taille && (
                          <span
                            className="text-xs flex-shrink-0"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            · {ecg.taille}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar
                        className="w-3 h-3"
                        style={{ color: "var(--text-secondary)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {ecg.dateEnvoi}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 pl-0.5"
                      style={{ paddingLeft: "1.1rem" }}
                    >
                      <Clock
                        className="w-3 h-3"
                        style={{ color: "var(--text-secondary)" }}
                      />
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {ecg.heureEnvoi}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Badge
                      style={{
                        background: statut.bg,
                        color: statut.color,
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "11px",
                        padding: "4px 10px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {statut.icon}
                      {ecg.statut}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      style={{
                        borderRadius: "8px",
                        fontSize: "12px",
                        padding: "0 10px",
                        height: "32px",
                        borderColor: "var(--border-color)",
                      }}
                      onClick={() => handleDownload(ecg)}
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      Télécharger
                    </Button>

                    <Link to={`/ecg-analysis/${ecg.analysisId}`}>
                      <Button
                        size="sm"
                        style={{
                          borderRadius: "8px",
                          fontSize: "12px",
                          padding: "0 12px",
                          height: "32px",
                          background: "var(--primary)",
                          color: "white",
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Analyser
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </MedecinLayout>
  );
}