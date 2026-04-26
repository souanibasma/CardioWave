import { MedecinLayout } from '../components/MedecinLayout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  User,
  Search,
  Download,
  Activity,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Filter,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Severity = 'high' | 'medium' | 'low';
type EcgStatus = 'Anormal' | 'Normal' | 'En attente';

interface ECG {
  id: string;
  date: string;
  statut: EcgStatus;
  type: string;
  fichier: string;
  fileUrl: string;
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  email: string;
  telephone: string;
  derniereActivite: string;
  nombreEcg: number;
  statutDernier: EcgStatus;
  severity: Severity;
  ecgs: ECG[];
}

const severityConfig: Record<Severity, { bg: string; border: string; dot: string; label: string }> = {
  high:   { bg: '#FEF2F2', border: '#FCA5A5', dot: '#E24B4A', label: 'Critique' },
  medium: { bg: '#FEFCE8', border: '#FCD34D', dot: '#BA7517', label: 'Modéré' },
  low:    { bg: '#F0FDF4', border: '#86EFAC', dot: '#0F6E56', label: 'Normal' },
};

const statutConfig: Record<EcgStatus, { bg: string; color: string }> = {
  'Anormal':    { bg: '#FEE2E2', color: '#A32D2D' },
  'Normal':     { bg: '#E8F5F2', color: '#0F6E56' },
  'En attente': { bg: '#FEF3C7', color: '#854F0B' },
};

function getInitials(prenom: string, nom: string) {
  const first = prenom?.[0] || 'P';
  const second = nom?.[0] || 'X';
  return `${first}${second}`.toUpperCase();
}

const avatarColors = ['#EEF2FF', '#E1F5EE', '#FCEBEB', '#FEF3C7', '#E6F1FB', '#FBEAF0'];
const avatarTextColors = ['#534AB7', '#0F6E56', '#A32D2D', '#854F0B', '#185FA5', '#993556'];

const API_BASE_URL = 'http://localhost:5000';

export default function ListePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [filtre, setFiltre] = useState<'tous' | EcgStatus>('tous');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/api/doctor/patients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer les patients');
        }

        const data = await response.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error('fetchPatients error:', err);
        setError('Erreur lors du chargement des patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    const fullName = `${p.prenom} ${p.nom}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());

    const matchFiltre = filtre === 'tous' || p.statutDernier === filtre;
    return matchSearch && matchFiltre;
  });

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}
            >
              Patients
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {patients.length} patients suivis • {patients.filter((p) => p.statutDernier === 'Anormal').length} avec ECG anormal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1" style={{ minWidth: '220px', maxWidth: '360px' }}>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-secondary)' }}
            />
            <Input
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
            {(['tous', 'Normal', 'Anormal', 'En attente'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFiltre(f)}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: filtre === f ? 500 : 400,
                  border: filtre === f ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                  background: filtre === f ? 'var(--primary)' : 'var(--surface)',
                  color: filtre === f ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {f === 'tous' ? 'Tous' : f}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
            Chargement des patients...
          </div>
        )}

        {error && (
          <div className="text-center py-16" style={{ color: '#A32D2D' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
                <User className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Aucun patient trouvé</p>
              </div>
            )}

            {filtered.map((patient, idx) => {
              const sev = severityConfig[patient.severity];
              const isOpen = expanded === patient.id;
              const initials = getInitials(patient.prenom, patient.nom);
              const avatarBg = avatarColors[idx % avatarColors.length];
              const avatarText = avatarTextColors[idx % avatarTextColors.length];

              return (
                <Card
                  key={patient.id}
                  style={{
                    borderRadius: '14px',
                    border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: 'var(--surface)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <CardContent className="p-0">
                    <div
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-opacity-50 transition-all"
                      style={{ background: isOpen ? 'var(--background)' : 'transparent' }}
                      onClick={() => setExpanded(isOpen ? null : patient.id)}
                    >
                      <div
                        className="w-1 self-stretch rounded-full flex-shrink-0"
                        style={{ background: sev.dot, minHeight: '40px' }}
                      />

                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                        style={{ background: avatarBg, color: avatarText }}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p
                            className="font-medium"
                            style={{ color: 'var(--text-primary)', fontSize: '15px' }}
                          >
                            {patient.prenom} {patient.nom}
                          </p>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            • {patient.age} ans
                          </span>
                          <Badge
                            style={{
                              background: sev.bg,
                              color: sev.dot,
                              border: `1px solid ${sev.border}`,
                              borderRadius: '20px',
                              fontSize: '10px',
                              padding: '1px 8px',
                            }}
                          >
                            {sev.label}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <Phone className="w-3 h-3" />
                            {patient.telephone || 'Non renseigné'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center hidden sm:block">
                          <p
                            className="text-lg font-semibold"
                            style={{ color: 'var(--text-primary)', lineHeight: 1 }}
                          >
                            {patient.nombreEcg}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            ECG envoyés
                          </p>
                        </div>

                        <div className="text-center hidden md:block">
                          <Badge
                            style={{
                              background: statutConfig[patient.statutDernier].bg,
                              color: statutConfig[patient.statutDernier].color,
                              borderRadius: '8px',
                              border: 'none',
                              fontSize: '11px',
                              padding: '3px 10px',
                            }}
                          >
                            {patient.statutDernier}
                          </Badge>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {patient.derniereActivite}
                          </p>
                        </div>

                        <ChevronRight
                          className="w-4 h-4 transition-transform"
                          style={{
                            color: 'var(--text-secondary)',
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                          }}
                        />
                      </div>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          borderTop: '1px solid var(--border-color)',
                          background: 'var(--background)',
                          padding: '16px 20px',
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p
                            className="text-sm font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Dossier ECG — {patient.prenom} {patient.nom}
                          </p>

                          <Link to={`/patient/${patient.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ fontSize: '12px', borderRadius: '8px' }}
                            >
                              Voir dossier complet
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>

                        <div
                          className="flex gap-4 flex-wrap mb-4 p-3 rounded-xl"
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            Dernière activité : {patient.derniereActivite}
                          </span>
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Activity className="w-3.5 h-3.5" />
                            {patient.nombreEcg} ECG au total
                          </span>
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {patient.email}
                          </span>
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            {patient.telephone || 'Non renseigné'}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {patient.ecgs.map((ecg) => (
                            <div
                              key={ecg.id}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{
                                border: '1px solid var(--border-color)',
                                background: 'var(--surface)',
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: '#EEF2FF' }}
                              >
                                <Activity className="w-4 h-4" style={{ color: '#534AB7' }} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-medium"
                                  style={{ color: 'var(--text-primary)' }}
                                >
                                  {ecg.type}
                                </p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                  {ecg.date}
                                </p>
                              </div>

                              <Badge
                                style={{
                                  background: statutConfig[ecg.statut].bg,
                                  color: statutConfig[ecg.statut].color,
                                  borderRadius: '8px',
                                  border: 'none',
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                }}
                              >
                                {ecg.statut}
                              </Badge>

                              <Link to={`/ecg-analysis/${ecg.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  style={{ borderRadius: '8px', padding: '4px 10px', fontSize: '12px' }}
                                >
                                  Voir
                                </Button>
                              </Link>

                              <Button
                                size="sm"
                                variant="outline"
                                style={{
                                  borderRadius: '8px',
                                  padding: '4px 10px',
                                  fontSize: '12px',
                                  borderColor: 'var(--border-color)',
                                }}
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = `${API_BASE_URL}${ecg.fileUrl}`;
                                  a.download = ecg.fichier;
                                  a.target = '_blank';
                                  a.click();
                                }}
                              >
                                <Download className="w-3.5 h-3.5 mr-1" />
                                Télécharger
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MedecinLayout>
  );
}