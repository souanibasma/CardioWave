import { useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { assignDoctorToPatient, createPatientECG } from "../../services/api";

interface Medecin {
  _id: string;
  fullName: string;
  email: string;
  specialty?: string;
  hospitalOrClinic?: string;
}

export default function EnvoyerECG() {
  const navigate = useNavigate();
  const location = useLocation();
  const { medecinId } = useParams();

  const medecin: Medecin = location.state?.medecin ?? {
    _id: medecinId || "",
    fullName: "Dr. Médecin",
    email: "",
    specialty: "Cardiologue",
    hospitalOrClinic: "Établissement",
  };

  const [fichierECG, setFichierECG] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [urgence, setUrgence] = useState<"normale" | "urgente">("normale");
  const [submitted, setSubmitted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (file) setFichierECG(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async () => {
    if (!fichierECG || !medecin._id) return;

    try {
      setLoading(true);
      setError("");

      // 1) lier le patient au médecin choisi
      await assignDoctorToPatient(medecin._id);

      // 2) créer l'ECG en base
      await createPatientECG({
        title: fichierECG.name,
        urgency: urgence,
        notes: message,
        // Placeholder temporaire tant qu'on ne fait pas encore le vrai upload
        fileUrl: `/pending/${fichierECG.name}`,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Erreur lors de l'envoi de l'ECG"
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F0F6FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "3rem 2.5rem",
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 32px rgba(21,101,192,0.10)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1565C0, #42A5F5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            style={{
              color: "#0D47A1",
              fontSize: "1.4rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
            }}
          >
            ECG envoyé !
          </h2>

          <p
            style={{
              color: "#5C85C5",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            Votre ECG a été transmis à <strong>{medecin.fullName}</strong>.
            <br />
            Il/Elle vous contactera dès que possible.
          </p>

          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => navigate("/patient/rechercher-medecin")}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: "1.5px solid #E2EEFF",
                background: "#F8FBFF",
                color: "#1565C0",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Retour
            </button>

            <button
              onClick={() => navigate("/patient/dashboard")}
              style={{
                padding: "10px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0F6FF",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <nav
        style={{
          background: "#fff",
          borderBottom: "1px solid #E2EEFF",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 12h-4l-3 9L9 3l-3 9H2"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0D47A1" }}>
            CardioWave
          </span>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#1565C0",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          ← Retour
        </button>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#0D47A1",
              margin: 0,
            }}
          >
            Envoyer mon ECG
          </h1>
          <p
            style={{
              color: "#5C85C5",
              marginTop: "6px",
              fontSize: "0.92rem",
            }}
          >
            Transmission directe — sans rendez-vous préalable.
          </p>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "1.5rem",
            color: "#fff",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            {(medecin.fullName ?? "")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((n: string) => n[0])
              .join("")
              .toUpperCase() || "DR"}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>
              {medecin.fullName}
            </div>
            <div style={{ opacity: 0.85, fontSize: "0.85rem", marginTop: "2px" }}>
              {medecin.specialty || "Spécialité non renseignée"} ·{" "}
              {medecin.hospitalOrClinic || "Établissement non renseigné"}
            </div>
          </div>

          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <span
              style={{
                fontSize: "0.78rem",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.25)",
                fontWeight: 600,
              }}
            >
              Disponible
            </span>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "1.75rem",
            boxShadow: "0 2px 20px rgba(21,101,192,0.08)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#0D47A1",
                marginBottom: "10px",
                fontSize: "0.95rem",
              }}
            >
              Fichier ECG
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${
                  dragging ? "#1565C0" : fichierECG ? "#42A5F5" : "#C5D8F5"
                }`,
                borderRadius: "14px",
                padding: "2rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "#EEF4FF" : fichierECG ? "#F0F8FF" : "#FAFCFF",
                transition: "all 0.2s",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.dcm"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              {fichierECG ? (
                <div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ margin: "0 auto 8px", display: "block" }}
                  >
                    <path
                      d="M22 12h-4l-3 9L9 3l-3 9H2"
                      stroke="#1565C0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p style={{ color: "#1565C0", fontWeight: 600, margin: 0 }}>
                    {fichierECG.name}
                  </p>
                  <p
                    style={{
                      color: "#90A4AE",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    {(fichierECG.size / 1024).toFixed(1)} KB · Cliquer pour changer
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ margin: "0 auto 10px", display: "block" }}
                  >
                    <path
                      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="#90A4AE"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p style={{ color: "#5C85C5", fontWeight: 500, margin: 0 }}>
                    Glisser ou cliquer pour importer
                  </p>
                  <p
                    style={{
                      color: "#B0BEC5",
                      fontSize: "0.8rem",
                      marginTop: "4px",
                    }}
                  >
                    PDF, PNG, JPG, DICOM
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#0D47A1",
                marginBottom: "10px",
                fontSize: "0.95rem",
              }}
            >
              Niveau d'urgence
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              {(["normale", "urgente"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgence(u)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "10px",
                    border:
                      urgence === u
                        ? `2px solid ${u === "urgente" ? "#E53935" : "#1565C0"}`
                        : "1.5px solid #E2EEFF",
                    background:
                      urgence === u
                        ? u === "urgente"
                          ? "#FFF5F5"
                          : "#EEF4FF"
                        : "#FAFCFF",
                    color:
                      urgence === u
                        ? u === "urgente"
                          ? "#C62828"
                          : "#1565C0"
                        : "#90A4AE",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {u === "urgente" ? "⚡ Urgente" : "✓ Normale"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                color: "#0D47A1",
                marginBottom: "10px",
                fontSize: "0.95rem",
              }}
            >
              Message (optionnel)
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez vos symptômes ou observations..."
              rows={4}
              style={{
                width: "100%",
                borderRadius: "12px",
                border: "1.5px solid #E2EEFF",
                padding: "12px 14px",
                fontSize: "0.9rem",
                color: "#1A237E",
                resize: "vertical",
                outline: "none",
                background: "#FAFCFF",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "#FFF0F0",
                border: "1px solid #FFCDD2",
                color: "#C62828",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!fichierECG || loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background:
                fichierECG && !loading
                  ? "linear-gradient(135deg, #1565C0 0%, #1E88E5 100%)"
                  : "#CFD8DC",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: fichierECG && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "opacity 0.2s",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {loading ? "Envoi en cours..." : "Envoyer l'ECG"}
          </button>
        </div>
      </div>
    </div>
  );
}