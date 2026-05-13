import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Upload,
  Loader2,
  FileText,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  User,
  Activity,
  Search,
  HeartPulse,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadECG, getDoctorReceivedECGs } from '../../services/api';

interface ReceivedECG {
  ecgId: string;
  analysisId: string | null;
  patient: any;
  patientId: string | null;
  title: string;
  urgent: boolean;
  status: string;
  imageUrl: string;
  date: string;
  notes: string;
  reportUrl?: string;
  source?: 'Patient' | 'Direct';
}

const PRIMARY = '#4f46e5';
const PRIMARY_LIGHT = '#eef2ff';
const TEXT = '#1e293b';
const MUTED = '#64748b';
const DANGER = '#e11d48';
const SUCCESS = '#10b981';
const AMBER = '#f59e0b';

const StatusBadge = ({ status, urgent }: { status: string; urgent: boolean }) => {
  if (urgent) {
    return (
      <Badge
        style={{
          background: '#fff1f2',
          color: DANGER,
          border: '1px solid #ffe4e6',
          borderRadius: 999,
          fontWeight: 900,
          gap: 6,
        }}
      >
        <AlertTriangle className="w-3 h-3" /> Urgent
      </Badge>
    );
  }

  const config: Record<string, { label: string; bg: string; color: string; icon: any }> = {
    analyzed: { label: 'Analysé', bg: '#ecfdf5', color: SUCCESS, icon: CheckCircle2 },
    digitized: { label: 'Digitalisé', bg: PRIMARY_LIGHT, color: PRIMARY, icon: Activity },
    uploaded: { label: 'En attente', bg: '#fffbeb', color: AMBER, icon: Clock },
  };

  const { label, bg, color, icon: Icon } = config[status] || config.uploaded;

  return (
    <Badge
      style={{
        background: bg,
        color,
        border: 'none',
        borderRadius: 999,
        fontWeight: 900,
        gap: 6,
      }}
    >
      <Icon className="w-3 h-3" /> {label}
    </Badge>
  );
};

export default function EcgRecus() {
  const navigate = useNavigate();

  const [receivedECGs, setReceivedECGs] = useState<ReceivedECG[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'uploaded' | 'urgent' | 'analyzed' | 'digitized'
  >('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchECGs = async () => {
      try {
        setLoadingList(true);
        const data = await getDoctorReceivedECGs();

        const formatted = data.map((e: any) => ({
          ecgId: e._id,
          analysisId: null,
          patient: e.patient,
          patientId: e.patient?._id || null,
          title: e.title,
          urgent: e.urgent || false,
          status: e.status || 'uploaded',
          date: new Date(e.createdAt).toLocaleDateString('fr-FR'),
          source: e.patient ? 'Patient' : 'Direct',
          imageUrl: e.originalImage,
          notes: e.notes || '',
          reportUrl: e.reportUrl,
        }));

        setReceivedECGs(formatted);
      } catch (err) {
        setListError('Erreur lors du chargement des ECGs reçus');
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    };

    fetchECGs();
  }, []);

  const getPatientName = (patient: any) => {
    if (typeof patient === 'object' && patient !== null) {
      return patient.fullName || `${patient.prenom || ''} ${patient.nom || ''}`.trim();
    }

    return patient || 'Inconnu';
  };

  const filteredECGs = receivedECGs.filter((ecg) => {
    const patientName = getPatientName(ecg.patient).toLowerCase();

    const matchesSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      ecg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ecg.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'urgent' && ecg.urgent) ||
      (statusFilter !== 'urgent' && ecg.status === statusFilter && !ecg.urgent);

    return matchesSearch && matchesFilter;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const resetUploadForm = () => {
    setTitle('');
    setPatientName('');
    setPatientAge('');
    setPatientNotes('');
    setSelectedFile(null);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDirectUpload = async () => {
    if (!selectedFile) return;

    const finalTitle = patientName
      ? `${title || selectedFile.name} — ${patientName}${patientAge ? `, ${patientAge} ans` : ''}`
      : title || selectedFile.name;

    try {
      setUploading(true);

      const { analysis } = await uploadECG({
        file: selectedFile,
        title: finalTitle,
        patientId: null,
      });

      setShowUploadModal(false);
      resetUploadForm();
      navigate(`/ecg-analysis/${analysis._id}`);
    } catch (err) {
      console.error('Upload failed', err);
      alert("Erreur lors de l'envoi de l'ECG");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAnalysis = (ecg: ReceivedECG) => {
    const targetId = ecg.analysisId || ecg.ecgId;
    navigate(`/ecg-analysis/${targetId}`);
  };

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background: '#f8fafc',
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: TEXT,
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 24,
          }}
        >
          {/* HEADER */}
<div
  style={{
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 45%, #3730a3 100%)',
    borderRadius: 26,
    padding: '30px 30px',
    color: 'white',
    marginBottom: 28,
    boxShadow: '0 24px 60px rgba(79,70,229,0.22)',
  }}
>
  <div
    style={{
      position: 'absolute',
      top: -120,
      right: -80,
      width: 260,
      height: 260,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.10)',
      filter: 'blur(4px)',
    }}
  />

  <div
    style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    {/* TEXTE À GAUCHE */}
    <div>
      <h1
        style={{
          margin: 0,
          fontSize: 36,
          fontWeight: 950,
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
        }}
      >
        Gestion de mes ECG
      </h1>

      <p
        style={{
          margin: '14px 0 0',
          maxWidth: 560,
          color: 'rgba(255,255,255,0.82)',
          fontSize: 15,
          lineHeight: 1.7,
          fontWeight: 650,
        }}
      >
        Visualisez les ECG reçus, lancez les analyses IA et ajoutez
        rapidement un ECG direct.
      </p>
    </div>

    {/* IMAGE À DROITE */}
    <img
        src="/ecgPage3.png"
        alt="ECG Illustration"
        style={{
          position: 'absolute',
          right: 35,
          top: '-100%',
          transform: 'translateY(-33  %)',

          width: 580,
          height: 'auto',

          objectFit: 'contain',

          opacity: 0.95,

          filter:
            'drop-shadow(0 25px 45px rgba(0,0,0,0.22))',

          pointerEvents: 'none',

          zIndex: 2,
        }}
      />
  </div>
</div>
          {/* FILTRES + UPLOAD */}
<div
  style={{
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  }}
>
  {/* FILTRES */}
  <div
    style={{
      display: 'flex',
      gap: 5,
    }}
  >
    {[
      { label: 'Tous', value: 'all', color: PRIMARY },
      { label: 'En attente', value: 'uploaded', color: PRIMARY },
      { label: 'Analysés', value: 'analyzed', color: PRIMARY },
      { label: 'Urgents', value: 'urgent', color: PRIMARY },
    ].map((filter) => (
      <button
        key={filter.value}
        onClick={() => setStatusFilter(filter.value as any)}
        style={{
          border:
            statusFilter === filter.value
              ? `1px solid ${filter.color}`
              : '1px solid #f1f5f9',
          borderRadius: 999,
          padding: '12px 26px',
          background:
            statusFilter === filter.value
              ? filter.color
              : '#FFFFFF',
          color:
            statusFilter === filter.value
              ? 'white'
              : MUTED,
          fontSize: 13,
          fontWeight: 950,
          cursor: 'pointer',
          transition: '0.2s ease',
          boxShadow:
            statusFilter === filter.value
              ? `0 10px 24px ${filter.color}25`
              : 'none',
        }}
      >
        {filter.label}
      </button>
    ))}
  </div>

  {/* UPLOAD BUTTON */}
  <button
    onClick={() => setShowUploadModal(true)}
    style={{
      height: 60,
      border: 'none',
      borderRadius: 20,
      background: PRIMARY,
      color: 'white',
      padding: '0 34px',
      fontSize: 15,
      fontWeight: 950,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      boxShadow: '0 16px 35px rgba(79,70,229,0.26)',
      whiteSpace: 'nowrap',
    }}
  >
    <Upload size={20} />
    Upload ECG direct
  </button>
</div>
          {/* SEARCH LARGE */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 26,
              padding: 18,
              marginBottom: 16,
              boxShadow: '0 18px 45px rgba(79,70,229,0.06)',
              border: '1px solid #f1f5f9',
            }}
          >
            <div
              style={{
                height: 62,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#f8fafc',
                borderRadius: 20,
                padding: '0 22px',
                border: '1px solid #e2e8f0',
              }}
            >
              <Search size={22} color={PRIMARY} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par patient, titre ou statut..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  color: TEXT,
                  fontSize: 15,
                  fontWeight: 750,
                }}
              />
            </div>
          </div>

          

          {/* CONTENT */}
          {loadingList ? (
            <div
              style={{
                height: 300,
                background: 'white',
                borderRadius: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PRIMARY,
                fontWeight: 900,
              }}
            >
              <Loader2 className="w-7 h-7 animate-spin mr-2" />
              Chargement des ECG...
            </div>
          ) : listError ? (
            <div
              style={{
                background: '#fff1f2',
                color: DANGER,
                borderRadius: 24,
                padding: 24,
                textAlign: 'center',
                fontWeight: 800,
              }}
            >
              {listError}
            </div>
          ) : filteredECGs.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                padding: 56,
                textAlign: 'center',
                boxShadow: '0 16px 42px rgba(79,70,229,0.07)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 24,
                  background: PRIMARY_LIGHT,
                  color: PRIMARY,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <FileText size={34} />
              </div>

              <h2 style={{ margin: 0, color: TEXT, fontSize: 20, fontWeight: 950 }}>
                Aucun ECG reçu
              </h2>

              <p style={{ margin: '8px 0 0', color: MUTED, fontWeight: 650 }}>
                Les ECG envoyés par vos patients apparaîtront ici.
              </p>
            </div>
          ) : (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 16px 42px rgba(79,70,229,0.07)',
                border: '1px solid #f1f5f9',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1.4fr 1.5fr 1fr 1.1fr 1fr',
                  padding: '15px 20px',
                  background: '#f8faff',
                  borderBottom: '1px solid #f1f5f9',
                  color: MUTED,
                  fontSize: 11,
                  fontWeight: 950,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}
              >
                <div>Source</div>
                <div>Patient</div>
                <div>Titre</div>
                <div>Date</div>
                <div>Statut</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>

              {filteredECGs.map((ecg) => (
                <div
                  key={ecg.ecgId}
                  onClick={() => handleOpenAnalysis(ecg)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 1.4fr 1.5fr 1fr 1.1fr 1fr',
                    alignItems: 'center',
                    padding: '17px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: '0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8faff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  <div>
                    <Badge
                      style={{
                        background: ecg.source === 'Patient' ? PRIMARY_LIGHT : '#f5f3ff',
                        color: ecg.source === 'Patient' ? PRIMARY : '#7c3aed',
                        border: 'none',
                        borderRadius: 999,
                        fontWeight: 900,
                        gap: 6,
                        padding: '4px 10px',
                      }}
                    >
                      {ecg.source === 'Patient' ? <User size={12} /> : <Upload size={12} />}
                      {ecg.source}
                    </Badge>
                  </div>

                  <div style={{ color: TEXT, fontSize: 13, fontWeight: 900 }}>
                    {getPatientName(ecg.patient)}
                  </div>

                  <div style={{ color: '#475569', fontSize: 13, fontWeight: 750 }}>
                    {ecg.title}
                  </div>

                  <div style={{ color: MUTED, fontSize: 13, fontWeight: 700 }}>
                    {ecg.date}
                  </div>

                  <div>
                    <StatusBadge status={ecg.status} urgent={ecg.urgent} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    {ecg.reportUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`http://localhost:5000/${ecg.reportUrl}`, '_blank');
                        }}
                        style={{
                          border: 'none',
                          background: '#fff1f2',
                          color: DANGER,
                          width: 34,
                          height: 34,
                          borderRadius: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title="Télécharger le rapport PDF"
                      >
                        <FileText size={15} />
                      </button>
                    )}

                    <button
                      style={{
                        border: 'none',
                        background: PRIMARY_LIGHT,
                        color: PRIMARY,
                        height: 34,
                        borderRadius: 12,
                        padding: '0 12px',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 950,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {ecg.status === 'analyzed' ? 'Voir' : 'Lancer'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUploadModal(false);
              resetUploadForm();
            }
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 28,
              boxShadow: '0 35px 100px rgba(15, 23, 42, 0.25)',
              width: '100%',
              maxWidth: 520,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: PRIMARY,
                color: 'white',
                padding: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 950 }}>
                  Upload ECG direct
                </h2>
                <p style={{ margin: '5px 0 0', color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                  Analyse sans patient assigné
                </p>
              </div>

              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                style={{
                  width: 36,
                  height: 36,
                  border: 'none',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24, display: 'grid', gap: 16 }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: selectedFile ? `2px dashed ${PRIMARY}` : '2px dashed #e2e8f0',
                  background: selectedFile ? PRIMARY_LIGHT : '#f8fafc',
                  borderRadius: 22,
                  padding: 30,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  accept="image/*"
                />

                {selectedFile ? (
                  <>
                    <CheckCircle2 size={34} color={PRIMARY} style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0, color: PRIMARY, fontWeight: 900 }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 12 }}>
                      Cliquer pour changer
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={34} color={MUTED} style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0, color: TEXT, fontWeight: 850 }}>
                      Sélectionner une image ECG
                    </p>
                    <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 12 }}>
                      PNG, JPG jusqu’à 10MB
                    </p>
                  </>
                )}
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 900, color: MUTED }}>
                  Titre de l’analyse
                </label>
                <Input
                  placeholder="Ex: ECG du 26/04/2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ marginTop: 6, borderRadius: 12 }}
                />
              </div>

              <div
                style={{
                  border: '1px solid #f1f5f9',
                  borderRadius: 20,
                  padding: 16,
                  background: '#f8fafc',
                  display: 'grid',
                  gap: 12,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    fontWeight: 900,
                    color: MUTED,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <User size={14} />
                  Informations patient optionnelles
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input
                    placeholder="Nom complet"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    style={{ borderRadius: 12 }}
                  />

                  <Input
                    placeholder="Âge"
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    style={{ borderRadius: 12 }}
                  />
                </div>

                <Input
                  placeholder="Notes cliniques"
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  style={{ borderRadius: 12 }}
                />
              </div>
            </div>

            <div
              style={{
                padding: 20,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                gap: 12,
              }}
            >
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
              >
                Annuler
              </Button>

              <Button
                className="flex-1 gap-2 rounded-xl text-white"
                style={{ background: PRIMARY }}
                onClick={handleDirectUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Envoi...
                  </>
                ) : (
                  <>
                    <HeartPulse className="w-4 h-4" /> Analyser
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}