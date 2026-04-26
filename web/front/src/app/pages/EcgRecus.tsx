import { useState, useRef, useEffect } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Upload, Loader2, Inbox, FileText, ChevronRight,
  AlertTriangle, Clock, CheckCircle2, X, User, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadECG, getDoctorReceivedECGs } from '../../services/api';

interface ReceivedECG {
  ecgId: string;
  analysisId: string | null;
  patient: string;
  patientId: string | null;
  title: string;
  urgent: boolean;
  status: string;
  imageUrl: string;
  date: string;
  notes: string;
  reportUrl?: string;
  source?: "Patient" | "Direct";
}

const StatusBadge = ({ status, urgent }: { status: string; urgent: boolean }) => {
  if (urgent) return (
    <Badge className="bg-red-50 text-red-600 border-red-200 gap-1 font-600">
      <AlertTriangle className="w-3 h-3" /> Urgent
    </Badge>
  );
  
  const config: Record<string, { label: string; color: string; icon: any }> = {
    analyzed: { label: 'Analysé', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
    digitized: { label: 'Digitalisé', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Activity },
    uploaded: { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  };

  const { label, color, icon: Icon } = config[status] || config.uploaded;

  return (
    <Badge variant="outline" className={`${color} gap-1 font-600`}>
      <Icon className="w-3 h-3" /> {label}
    </Badge>
  );
};

export default function EcgRecus() {
  const navigate = useNavigate();

  // ── Liste ECGs reçus ──
  const [receivedECGs, setReceivedECGs] = useState<ReceivedECG[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  // ── Upload direct médecin ──
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Charger la liste au montage ──
  useEffect(() => {
    const fetchECGs = async () => {
      try {
        setLoadingList(true);
        const data = await getDoctorReceivedECGs();
        setReceivedECGs(data);
      } catch (err) {
        setListError("Erreur lors du chargement des ECGs reçus");
        console.error(err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchECGs();
  }, []);

  // ── Upload direct médecin ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDirectUpload = async () => {
    if (!selectedFile) return;

    // Construire le titre avec infos patient optionnelles
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
      console.error("Upload failed", err);
      alert("Erreur lors de l'envoi de l'ECG");
    } finally {
      setUploading(false);
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

  const handleOpenAnalysis = (ecg: ReceivedECG) => {
    // Si l'analyse existe déjà, on utilise son ID, sinon on utilise l'ID de l'ECG
    // Le backend créera l'analyse automatiquement si nécessaire.
    const targetId = ecg.analysisId || ecg.ecgId;
    navigate(`/ecg-analysis/${targetId}`);
  };

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100">
              <Inbox className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion de mes ECG</h1>
              <p className="text-gray-500 text-sm">
                {receivedECGs.length > 0
                  ? `${receivedECGs.length} examen${receivedECGs.length > 1 ? 's' : ''} (Reçus & Directs)`
                  : 'Gérez les ECG de vos patients et vos scans directs'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowUploadModal(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="w-4 h-4" />
            Upload ECG direct
          </Button>
        </div>

        {/* ── Liste ECGs reçus ── */}
        {loadingList ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        ) : listError ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600">
            {listError}
          </div>
        ) : receivedECGs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-1">Aucun ECG reçu</h2>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              Les ECGs envoyés par vos patients apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-600 text-gray-500 uppercase tracking-wide">
              <div className="col-span-1">Source</div>
              <div className="col-span-2">Patient</div>
              <div className="col-span-3">Titre</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Statut</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            {receivedECGs.map((ecg) => (
              <div
                key={ecg.ecgId}
                className="grid grid-cols-12 px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/30 transition-colors items-center cursor-pointer group"
                onClick={() => handleOpenAnalysis(ecg)}
              >
                {/* Source */}
                <div className="col-span-1">
                  {ecg.source === "Patient" ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 gap-1 font-500">
                      <User className="w-3 h-3" /> Patient
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100 gap-1 font-500">
                      <Upload className="w-3 h-3" /> Direct
                    </Badge>
                  )}
                </div>

                {/* Patient */}
                <div className="col-span-2 flex items-center gap-3">
                  <span className="font-500 text-gray-900 text-sm truncate">{ecg.patient}</span>
                </div>

                {/* Titre */}
                <div className="col-span-3">
                  <span className="text-sm text-gray-700 truncate block font-medium">{ecg.title}</span>
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <span className="text-sm text-gray-500">{ecg.date}</span>
                </div>

                {/* Statut */}
                <div className="col-span-2">
                  <StatusBadge status={ecg.status} urgent={ecg.urgent} />
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2">
                  {ecg.reportUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`http://localhost:5000/${ecg.reportUrl}`, '_blank');
                      }}
                      title="Télécharger le rapport PDF"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs font-600"
                  >
                    {ecg.status === 'analyzed' ? 'Voir' : 'Lancer'} <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Upload Direct Médecin ── */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowUploadModal(false); resetUploadForm(); } }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-700 text-gray-900 text-lg">Upload ECG direct</h2>
                <p className="text-sm text-gray-500">Analyse sans patient assigné</p>
              </div>
              <button
                onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">

              {/* Zone upload fichier */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                }`}
                onClick={() => fileInputRef.current?.click()}
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
                    <CheckCircle2 className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
                    <p className="text-sm font-500 text-indigo-700">{selectedFile.name}</p>
                    <p className="text-xs text-indigo-400 mt-1">Cliquer pour changer</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Cliquer pour sélectionner une image ECG</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 10MB</p>
                  </>
                )}
              </div>

              {/* Titre */}
              <div>
                <label className="text-xs font-600 text-gray-500 uppercase tracking-wide block mb-1.5">
                  Titre de l'analyse
                </label>
                <Input
                  placeholder="Ex: ECG du 26/04/2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Infos patient optionnelles */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                <p className="text-xs font-600 text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  Informations patient <span className="normal-case font-400 text-gray-400">(optionnel)</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Nom complet</label>
                    <Input
                      placeholder="Jean Dupont"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Âge</label>
                    <Input
                      placeholder="65"
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Notes cliniques</label>
                  <Input
                    placeholder="Antécédents, motif..."
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    className="bg-white text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowUploadModal(false); resetUploadForm(); }}
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2"
                onClick={handleDirectUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</>
                  : <><Upload className="w-4 h-4" /> Analyser</>
                }
              </Button>
            </div>
          </div>
        </div>
      )}
    </MedecinLayout>
  );
}