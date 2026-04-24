import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { useLocation } from "react-router-dom";
import {
  Activity,
  Heart,
  CheckCircle,
  FileText,
  Loader2,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getECGAnalysisDetails,
  digitizeECGAnalysis,
  analyzeECGWithAI,
  saveDoctorNotes,
  getImageUrl,
} from '../../services/api';

interface ECGAnalysisData {
  _id: string;
  ecg: {
    _id: string;
    title: string;
    originalImage: string;
    patient?: { fullName?: string };
    createdAt?: string;
  };
  plot12leads?: string;
  plotFullLeadII?: string;
  plotImage?: string;
  npyFile?: string;
  aiResult?: any;
  doctorNotes?: string;
  status: 'uploaded' | 'digitized' | 'analyzed';
  createdAt?: string;
}

/* ── Inline styles ── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px',
    background: '#F0F4F8',
    minHeight: '100vh',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '12px',
    marginBottom: '28px',
  },
  headerLeft: {},
  pageTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  pageSub: {
    fontSize: '14px',
    color: '#64748B',
    marginTop: '4px',
  },

  /* Status badges */
  badgeUploaded: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: '#FEF3C7',
    color: '#92400E',
    border: '1px solid #F59E0B',
  },
  badgeDigitized: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: '#EFF6FF',
    color: '#1D4ED8',
    border: '1px solid #3B82F6',
  },
  badgeAnalyzed: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: '#ECFDF5',
    color: '#065F46',
    border: '1px solid #10B981',
  },

  /* Two-column grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },

  /* Cards */
  card: {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px 14px',
    borderBottom: '1px solid #F1F5F9',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
  },
  cardSub: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '3px',
  },
  cardBody: {
    padding: '20px 24px',
  },

  /* ECG image container */
  ecgImageWrap: {
    background: '#0F172A',
    borderRadius: '10px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  ecgImage: {
    width: '100%',
    borderRadius: '6px',
    maxHeight: '520px',
    objectFit: 'contain' as const,
    background: 'white',
  },

  /* Digitized section sub-label */
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94A3B8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.8px',
    marginBottom: '8px',
  },
  digitizedImg: {
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    maxHeight: '400px',
    objectFit: 'contain' as const,
    background: '#fff',
  },

  /* Metrics grid */
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  metricCard: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#94A3B8',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.7px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#0F172A',
    lineHeight: 1.1,
    fontVariantNumeric: 'tabular-nums',
  },
  metricUnit: {
    fontSize: '11px',
    color: '#94A3B8',
    marginTop: '1px',
  },
  metricNormal: { color: '#059669' },
  metricWarning: { color: '#D97706' },
  metricAnomaly: { color: '#DC2626' },

  /* AI result sections */
  aiSection: {
    marginBottom: '16px',
  },
  aiSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155',
    marginBottom: '8px',
  },
  aiDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  aiContent: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#334155',
    lineHeight: 1.6,
  },
  aiLabel: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  aiLabelNormal: {
    background: '#ECFDF5',
    color: '#065F46',
  },
  aiLabelAnomaly: {
    background: '#FEF2F2',
    color: '#991B1B',
  },
  aiLabelWarning: {
    background: '#FFFBEB',
    color: '#92400E',
  },

  /* Divider */
  divider: {
    border: 'none',
    borderTop: '1px solid #F1F5F9',
    margin: '16px 0',
  },

  /* Action buttons */
  btnPrimary: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s',
  },
  btnPurple: {
    background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    color: '#fff',
  },
  btnBlue: {
    background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    color: '#fff',
  },
  btnOutline: {
    background: '#fff',
    color: '#334155',
    border: '1px solid #CBD5E1',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  /* Step progress */
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 0',
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '12px',
    fontWeight: 700,
  },
  stepCircleActive: {
    background: '#EEF2FF',
    color: '#4F46E5',
    border: '2px solid #6366F1',
  },
  stepCircleDone: {
    background: '#ECFDF5',
    color: '#059669',
    border: '2px solid #10B981',
  },
  stepCirclePending: {
    background: '#F8FAFC',
    color: '#CBD5E1',
    border: '2px solid #E2E8F0',
  },
  stepText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  stepTextMuted: {
    color: '#CBD5E1',
  },

  /* Error / info boxes */
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#991B1B',
    marginTop: '8px',
  },
  infoBox: {
    background: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#0C4A6E',
  },

  /* Textarea */
  textarea: {
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#334155',
    resize: 'vertical' as const,
    background: '#F8FAFC',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },

  /* Left column */
  leftCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },

  /* Spacer */
  spacer: { height: '16px' },

  /* Loading / error screens */
  centered: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '12px',
  },
};

/* ── Helper: extract metrics from aiResult ── */
function extractMetrics(aiResult: any) {
  if (!aiResult) return null;
  const flat = typeof aiResult === 'object' ? aiResult : {};
  return {
    hr: flat.heart_rate ?? flat.hr ?? flat.HR ?? null,
    pr: flat.pr_interval ?? flat.pr ?? flat.PR ?? null,
    qrs: flat.qrs_duration ?? flat.qrs ?? flat.QRS ?? null,
    qtc: flat.qtc ?? flat.QTc ?? flat.QTC ?? null,
    rhythm: flat.rhythm ?? flat.Rhythm ?? null,
    diagnosis: flat.diagnosis ?? flat.prediction ?? flat.label ?? null,
    deterministic: flat.deterministic ?? flat.rule_based ?? null,
  };
}

function MetricCard({
  label,
  value,
  unit,
  status,
}: {
  label: string;
  value: string | number | null;
  unit?: string;
  status?: 'normal' | 'warning' | 'anomaly';
}) {
  const valueColor =
    status === 'normal'
      ? styles.metricNormal
      : status === 'warning'
      ? styles.metricWarning
      : status === 'anomaly'
      ? styles.metricAnomaly
      : {};
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={{ ...styles.metricValue, ...valueColor }}>
        {value !== null && value !== undefined ? value : '—'}
      </span>
      {unit && <span style={styles.metricUnit}>{unit}</span>}
    </div>
  );
}

/* ── Main component ── */
export default function ECGAnalysis() {
  const { id } = useParams<{ id: string }>();

  const [analysis, setAnalysis] = useState<ECGAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const [digitizing, setDigitizing] = useState(false);
  const [digitizeError, setDigitizeError] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  /* ─────── Fetch analysis details ─────── */
  const fetchAnalysis = async () => {
    if (!id) {
      setError("ID d'analyse manquant");
      setLoading(false);
      return;
    }
    try {
      console.log('[ECGAnalysis] Fetching analysis id=', id);
      setLoading(true);
      setError(null);
      const data = await getECGAnalysisDetails(id);
      console.log('[ECGAnalysis] Analysis data:', data);
      setAnalysis(data);
      setNotes(data.doctorNotes || '');
    } catch (err: any) {
      console.error('[ECGAnalysis] fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ─────── Digitize ─────── */
  const handleDigitize = async () => {
    if (!id || !analysis) return;
    try {
      setDigitizing(true);
      setDigitizeError(null);
      console.log('[ECGAnalysis] Calling digitize for', id);
      const res = await digitizeECGAnalysis(id);
      console.log('[ECGAnalysis] Digitize result:', res);
      await fetchAnalysis();
    } catch (err: any) {
      console.error('[ECGAnalysis] digitize error:', err);
      setDigitizeError(err.response?.data?.message || err.message || 'Erreur digitalisation');
    } finally {
      setDigitizing(false);
    }
  };

  /* ─────── Analyze (AI) ─────── */
  const handleAnalyze = async () => {
    if (!id || !analysis) return;
    try {
      setAnalyzing(true);
      setAnalyzeError(null);
      console.log('[ECGAnalysis] Calling AI analyze for', id);
      const res = await analyzeECGWithAI(id);
      console.log('[ECGAnalysis] AI result:', res);
      await fetchAnalysis();
    } catch (err: any) {
      console.error('[ECGAnalysis] analyze error:', err);
      setAnalyzeError(err.response?.data?.message || err.message || 'Erreur analyse IA');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ─────── Notes ─────── */
  const handleSaveNotes = async () => {
    if (!id) return;
    try {
      setSavingNotes(true);
      await saveDoctorNotes(id, notes);
      console.log('[ECGAnalysis] Notes saved');
    } catch (err) {
      console.error('[ECGAnalysis] notes save error:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  /* ─────── Loading ─────── */
  if (loading) {
    return (
      <DashboardLayout>
        <div style={styles.centered}>
          <Loader2
            style={{ width: 36, height: 36, color: '#2563EB', animation: 'spin 1s linear infinite' }}
          />
          <p style={{ color: '#64748B', fontSize: '14px' }}>Chargement de l'analyse…</p>
        </div>
      </DashboardLayout>
    );
  }

  /* ─────── Error ─────── */
  if (error || !analysis) {
    return (
      <DashboardLayout>
        <div style={styles.centered}>
          <AlertCircle style={{ width: 44, height: 44, color: '#DC2626' }} />
          <p style={{ color: '#0F172A', fontWeight: 600 }}>{error || 'Analyse introuvable'}</p>
        </div>
      </DashboardLayout>
    );
  }

  const isDigitized = analysis.status === 'digitized' || analysis.status === 'analyzed';
  const isAnalyzed = analysis.status === 'analyzed';

  const rawUrl = analysis?.ecg?.originalImage || '';
  const imageUrl =
    location.state?.imageUrl ? getImageUrl(location.state.imageUrl) : getImageUrl(rawUrl);

  console.log("ANALYSIS =", JSON.stringify(analysis, null, 2));

  const metrics = extractMetrics(analysis.aiResult);

  /* status badge */
  const StatusBadge = () => {
    if (analysis.status === 'analyzed')
      return (
        <span style={styles.badgeAnalyzed}>
          <CheckCircle style={{ width: 12, height: 12 }} />
          Analysé par IA
        </span>
      );
    if (analysis.status === 'digitized')
      return <span style={styles.badgeDigitized}><Activity style={{ width: 12, height: 12 }} />Digitalisé</span>;
    return <span style={styles.badgeUploaded}>À digitaliser</span>;
  };

  return (
    <DashboardLayout>
      <div style={styles.page}>

        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>Analyse ECG</h1>
            <p style={styles.pageSub}>
              {analysis.ecg?.patient?.fullName || 'Patient inconnu'}
              {' · '}
              {analysis.ecg?.title || 'ECG'}
              {analysis.ecg?.createdAt && (
                <>
                  {' · '}
                  {new Date(analysis.ecg.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </>
              )}
            </p>
          </div>
          <StatusBadge />
        </div>

        {/* ── Two-column layout ── */}
        <div style={styles.grid}>

          {/* ── LEFT column ── */}
          <div style={styles.leftCol}>

            {/* ECG Original */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <ImageIcon style={{ width: 16, height: 16, color: '#2563EB' }} />
                  ECG Original
                </h2>
                <p style={styles.cardSub}>Image uploadée du tracé ECG</p>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.ecgImageWrap}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="ECG original" style={styles.ecgImage} />
                  ) : (
                    <p style={{ color: '#64748B', fontSize: '13px' }}>Image non disponible</p>
                  )}
                </div>
              </div>
            </div>

            {/* Digitized signals */}
            {isDigitized && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <Activity style={{ width: 16, height: 16, color: '#7C3AED' }} />
                    Signal ECG Digitalisé
                  </h2>
                  <p style={styles.cardSub}>Tracés extraits et reconstruits</p>
                </div>
                <div style={styles.cardBody}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {analysis.plot12leads && (
                      <div>
                        <p style={styles.sectionLabel}>Tracé 12 dérivations</p>
                        <img
                          src={getImageUrl(analysis.plot12leads.replace('http://localhost:8000', ''))}
                          alt="12 Leads"
                          style={styles.digitizedImg}
                        />
                      </div>
                    )}
                    {analysis.plotFullLeadII && (
                      <div>
                        <p style={styles.sectionLabel}>Lead II Complet</p>
                        <img
                          src={getImageUrl(analysis.plotFullLeadII.replace('http://localhost:8000', ''))}
                          alt="Full Lead II"
                          style={styles.digitizedImg}
                        />
                      </div>
                    )}
                    {analysis.plotImage && (
                      <div>
                        <p style={styles.sectionLabel}>Tracé 4 dérivations</p>
                        <img
                          src={getImageUrl(analysis.plotImage)}
                          alt="Plot 4 leads"
                          style={styles.digitizedImg}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* AI Result - rendered nicely */}
            {isAnalyzed && analysis.aiResult && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <Sparkles style={{ width: 16, height: 16, color: '#059669' }} />
                    Résultat de l'analyse IA
                  </h2>
                  <p style={styles.cardSub}>Prédiction automatique du modèle</p>
                </div>
                <div style={styles.cardBody}>

                  {/* AI Diagnosis */}
                  {metrics?.diagnosis && (
                    <div style={styles.aiSection}>
                      <div style={styles.aiSectionTitle}>
                        <span style={{ ...styles.aiDot, background: '#6366F1' }} />
                        Diagnostic IA
                      </div>
                      <div style={styles.aiContent}>
                        <span
                          style={{
                            ...styles.aiLabel,
                            ...(String(metrics.diagnosis).toLowerCase().includes('normal')
                              ? styles.aiLabelNormal
                              : styles.aiLabelAnomaly),
                          }}
                        >
                          {String(metrics.diagnosis)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Deterministic Diagnosis */}
                  {metrics?.deterministic && (
                    <div style={styles.aiSection}>
                      <div style={styles.aiSectionTitle}>
                        <span style={{ ...styles.aiDot, background: '#F59E0B' }} />
                        Diagnostic Déterministe
                      </div>
                      <div style={styles.aiContent}>
                        {typeof metrics.deterministic === 'object'
                          ? Object.entries(metrics.deterministic).map(([k, v]) => (
                              <div key={k} style={{ marginBottom: '4px' }}>
                                <span style={{ fontWeight: 600, color: '#475569' }}>{k}: </span>
                                <span>{String(v)}</span>
                              </div>
                            ))
                          : String(metrics.deterministic)}
                      </div>
                    </div>
                  )}

                  {/* Rhythm */}
                  {metrics?.rhythm && (
                    <div style={styles.aiSection}>
                      <div style={styles.aiSectionTitle}>
                        <span style={{ ...styles.aiDot, background: '#EC4899' }} />
                        Rythme
                      </div>
                      <div style={styles.aiContent}>{String(metrics.rhythm)}</div>
                    </div>
                  )}

                  {/* Raw fallback if no structured keys found */}
                  {!metrics?.diagnosis && !metrics?.deterministic && !metrics?.rhythm && (
                    <pre
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '14px',
                        fontSize: '12px',
                        color: '#334155',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        overflowX: 'auto',
                      }}
                    >
                      {JSON.stringify(analysis.aiResult, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT column ── */}
          <div style={styles.rightCol}>

            {/* ECG Metrics */}
            {isAnalyzed && metrics && (
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>
                    <Heart style={{ width: 16, height: 16, color: '#DC2626' }} />
                    Paramètres ECG
                  </h2>
                  <p style={styles.cardSub}>Mesures extraites automatiquement</p>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.metricsGrid}>
                    <MetricCard
                      label="Fréq. cardiaque"
                      value={metrics.hr}
                      unit="bpm"
                      status={
                        metrics.hr === null ? undefined
                          : Number(metrics.hr) >= 60 && Number(metrics.hr) <= 100 ? 'normal'
                          : Number(metrics.hr) > 100 ? 'warning'
                          : 'anomaly'
                      }
                    />
                    <MetricCard
                      label="Intervalle PR"
                      value={metrics.pr}
                      unit="ms"
                      status={
                        metrics.pr === null ? undefined
                          : Number(metrics.pr) >= 120 && Number(metrics.pr) <= 200 ? 'normal'
                          : 'warning'
                      }
                    />
                    <MetricCard
                      label="Durée QRS"
                      value={metrics.qrs}
                      unit="ms"
                      status={
                        metrics.qrs === null ? undefined
                          : Number(metrics.qrs) <= 120 ? 'normal'
                          : 'anomaly'
                      }
                    />
                    <MetricCard
                      label="QTc"
                      value={metrics.qtc}
                      unit="ms"
                      status={
                        metrics.qtc === null ? undefined
                          : Number(metrics.qtc) <= 440 ? 'normal'
                          : Number(metrics.qtc) <= 470 ? 'warning'
                          : 'anomaly'
                      }
                    />
                  </div>

                  {/* Color legend */}
                  <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                      { color: '#059669', label: 'Normal' },
                      { color: '#D97706', label: 'Attention' },
                      { color: '#DC2626', label: 'Anomalie' },
                    ].map(({ color, label }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'block' }} />
                        <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Workflow steps */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Étapes du traitement</h2>
                <p style={styles.cardSub}>Progression de l'analyse</p>
              </div>
              <div style={{ ...styles.cardBody, padding: '16px 24px' }}>
                {[
                  { n: 1, label: 'Téléchargement', done: true },
                  { n: 2, label: 'Digitalisation', done: isDigitized },
                  { n: 3, label: 'Analyse IA', done: isAnalyzed },
                ].map(({ n, label, done }) => {
                  const isNext =
                    (n === 2 && !isDigitized) || (n === 3 && isDigitized && !isAnalyzed);
                  return (
                    <div key={n} style={styles.stepRow}>
                      <div
                        style={{
                          ...styles.stepCircle,
                          ...(done
                            ? styles.stepCircleDone
                            : isNext
                            ? styles.stepCircleActive
                            : styles.stepCirclePending),
                        }}
                      >
                        {done ? <CheckCircle style={{ width: 14, height: 14 }} /> : n}
                      </div>
                      <span
                        style={{
                          ...styles.stepText,
                          ...(!done && !isNext ? styles.stepTextMuted : {}),
                        }}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ ...styles.cardBody, paddingTop: 0 }}>
                <hr style={styles.divider} />

                {/* Digitize button */}
                <button
                  onClick={handleDigitize}
                  disabled={digitizing || isDigitized}
                  style={{
                    ...styles.btnPrimary,
                    ...styles.btnPurple,
                    ...(digitizing || isDigitized ? styles.btnDisabled : {}),
                    marginBottom: '10px',
                  }}
                >
                  {digitizing ? (
                    <>
                      <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                      Digitalisation en cours…
                    </>
                  ) : isDigitized ? (
                    <>
                      <CheckCircle style={{ width: 15, height: 15 }} />
                      Déjà digitalisé
                    </>
                  ) : (
                    <>
                      <Activity style={{ width: 15, height: 15 }} />
                      Digitaliser l'ECG
                    </>
                  )}
                </button>
                {digitizeError && <div style={styles.errorBox}>{digitizeError}</div>}

                {/* Analyze button */}
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !isDigitized || isAnalyzed}
                  style={{
                    ...styles.btnPrimary,
                    ...styles.btnBlue,
                    ...(analyzing || !isDigitized || isAnalyzed ? styles.btnDisabled : {}),
                    marginTop: '4px',
                  }}
                >
                  {analyzing ? (
                    <>
                      <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                      Analyse en cours…
                    </>
                  ) : isAnalyzed ? (
                    <>
                      <CheckCircle style={{ width: 15, height: 15 }} />
                      Déjà analysé
                    </>
                  ) : (
                    <>
                      <Heart style={{ width: 15, height: 15 }} />
                      Analyser avec l'IA
                    </>
                  )}
                </button>

                {!isDigitized && (
                  <div style={{ ...styles.infoBox, marginTop: '10px' }}>
                    Vous devez d'abord digitaliser l'ECG avant de lancer l'analyse IA.
                  </div>
                )}
                {analyzeError && <div style={{ ...styles.errorBox, marginTop: '8px' }}>{analyzeError}</div>}
              </div>
            </div>

            {/* Doctor notes */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  <FileText style={{ width: 16, height: 16, color: '#0EA5E9' }} />
                  Notes du médecin
                </h2>
                <p style={styles.cardSub}>Observations et conclusions cliniques</p>
              </div>
              <div style={styles.cardBody}>
                <textarea
                  placeholder="Saisissez vos observations cliniques ici…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  style={styles.textarea}
                />
                <div style={{ height: '12px' }} />
                <button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  style={{
                    ...styles.btnPrimary,
                    ...styles.btnOutline,
                    ...(savingNotes ? styles.btnDisabled : {}),
                  }}
                >
                  {savingNotes ? (
                    <>
                      <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                      Enregistrement…
                    </>
                  ) : (
                    <>
                      <FileText style={{ width: 15, height: 15 }} />
                      Enregistrer les notes
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}