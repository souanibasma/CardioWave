import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AdminLayout from "./AdminLayout";
import API from "../../services/api";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes fadeup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .adm-fade { animation: fadeup 0.45s ease both; }

  .notif-row { transition: background 0.15s; cursor: default; }
  .notif-row:hover { background: #F8FAFF !important; }

  .notif-action {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; background: #EFF6FF; color: #1D4ED8;
    border: 1px solid #BFDBFE; border-radius: 20px; font-size: 0.78rem; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .notif-action:hover { background: #DBEAFE; }

  .notif-read {
    display: inline-flex; align-items: center;
    padding: 7px 14px; background: #F1F5F9; color: #94A3B8;
    border: 1px solid #E2E8F0; border-radius: 20px; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .notif-read:hover { background: #E2E8F0; }

  .notif-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #3B82F6; flex-shrink: 0;
  }
`;

interface Notif {
  _id: string;
  type: "verification" | "inscription" | "ecg" | "systeme";
  titre: string;
  desc: string;
  date: string;
  lue: boolean;
  actionLabel?: string;
  actionPath?: string;
}

const typeIcon = (type: Notif["type"]) => {
  const configs = {
    verification: {
      bg: "#EFF6FF",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
          <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
      ),
    },
    inscription: {
      bg: "#F0FDF4",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
        </svg>
      ),
    },
    ecg: {
      bg: "#FFFBEB",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
    },
    systeme: {
      bg: "#F8FAFC",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <circle cx="12" cy="16" r="1" fill="#64748B"/>
        </svg>
      ),
    },
  };

  return configs[type];
};

const formatRelativeDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  const diffMs = Date.now() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffH < 1) return "Il y a moins d'1h";
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD}j`;

  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminNotifications() {
  const navigate = useNavigate();

  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [filter, setFilter] = useState<"toutes" | "non_lues">("toutes");
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [markingOneId, setMarkingOneId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/notifications");
      setNotifs(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const nonLues = useMemo(() => notifs.filter((n) => !n.lue).length, [notifs]);

  const filtered = useMemo(
    () => (filter === "non_lues" ? notifs.filter((n) => !n.lue) : notifs),
    [filter, notifs]
  );

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      await API.patch("/admin/notifications/read-all");

      setNotifs((prev) => prev.map((n) => ({ ...n, lue: true })));
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de marquer toutes les notifications comme lues."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      setMarkingOneId(id);
      await API.patch(`/admin/notifications/${id}/read`);

      setNotifs((prev) =>
        prev.map((n) => (n._id === id ? { ...n, lue: true } : n))
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Impossible de marquer la notification comme lue."
      );
    } finally {
      setMarkingOneId(null);
    }
  };

  const handleActionClick = async (notif: Notif) => {
    if (!notif.lue) {
      await markRead(notif._id);
    }

    if (notif.actionPath) {
      navigate(notif.actionPath);
    }
  };

  return (
    <AdminLayout>
      <style>{CSS}</style>
      <div style={{ padding: "2rem 2.5rem" }}>
        <div
          className="adm-fade"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              Notifications
              {nonLues > 0 && (
                <span
                  style={{
                    marginLeft: "12px",
                    background: "#EF4444",
                    color: "#fff",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "2px 10px",
                    verticalAlign: "middle",
                  }}
                >
                  {nonLues} nouvelles
                </span>
              )}
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                color: "#64748B",
                fontSize: "0.88rem",
              }}
            >
              {notifs.length} notifications au total
            </p>
          </div>

          {nonLues > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              style={{
                background: "none",
                border: "1.5px solid #E2E8F0",
                borderRadius: "8px",
                padding: "8px 16px",
                color: "#64748B",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: markingAll ? "not-allowed" : "pointer",
                opacity: markingAll ? 0.6 : 1,
              }}
            >
              {markingAll ? "Mise à jour..." : "Tout marquer comme lu"}
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "10px",
              padding: "10px 16px",
              marginBottom: "1.25rem",
              color: "#991B1B",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          {([
            ["toutes", "Toutes", notifs.length],
            ["non_lues", "Non lues", nonLues],
          ] as const).map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "8px 18px",
                borderRadius: "30px",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                background: filter === key ? "#1E293B" : "#F1F5F9",
                color: filter === key ? "#fff" : "#64748B",
              }}
            >
              {label}
              <span
                style={{
                  marginLeft: "8px",
                  padding: "1px 7px",
                  borderRadius: "20px",
                  fontSize: "0.72rem",
                  background:
                    filter === key ? "rgba(255,255,255,0.2)" : "#E2E8F0",
                  color: filter === key ? "#fff" : "#64748B",
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#94A3B8",
                fontSize: "0.9rem",
              }}
            >
              Chargement des notifications...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#94A3B8",
                fontSize: "0.9rem",
              }}
            >
              Aucune notification.
            </div>
          ) : (
            filtered.map((n, i) => {
              const { bg, icon } = typeIcon(n.type);

              return (
                <div
                  key={n._id}
                  className="notif-row"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "1.25rem 1.5rem",
                    borderBottom:
                      i < filtered.length - 1 ? "1px solid #F1F5F9" : "none",
                    background: n.lue ? "#fff" : "#FAFCFF",
                  }}
                >
                  <div style={{ paddingTop: "4px", flexShrink: 0 }}>
                    {!n.lue ? (
                      <div className="notif-dot" />
                    ) : (
                      <div style={{ width: 8, height: 8 }} />
                    )}
                  </div>

                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "10px",
                      background: bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: n.lue ? 500 : 700,
                        fontSize: "0.9rem",
                        color: "#1E293B",
                        marginBottom: "3px",
                      }}
                    >
                      {n.titre}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "#64748B",
                        lineHeight: 1.5,
                      }}
                    >
                      {n.desc}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                        marginTop: "6px",
                      }}
                    >
                      {formatRelativeDate(n.date)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {n.actionLabel && n.actionPath && (
                      <button
                        className="notif-action"
                        onClick={() => handleActionClick(n)}
                      >
                        {n.actionLabel} →
                      </button>
                    )}

                    {!n.lue && (
                      <button
                        className="notif-read"
                        onClick={() => markRead(n._id)}
                        disabled={markingOneId === n._id}
                      >
                        {markingOneId === n._id ? "..." : "Lue"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}