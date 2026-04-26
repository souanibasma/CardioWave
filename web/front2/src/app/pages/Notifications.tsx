import { useState } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Bell,
  Activity,
  Brain,
  AlertTriangle,
  CheckCheck,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';

type TypeNotif = 'ecg_recu' | 'ia_analyse' | 'alerte';
type StatutNotif = 'non_lu' | 'lu';

interface Notification {
  id: number;
  type: TypeNotif;
  titre: string;
  message: string;
  patient: string;
  date: string;
  heure: string;
  statut: StatutNotif;
}

const notificationsData: Notification[] = [
  { id: 1,  type: 'alerte',     titre: 'Alerte patient critique',       message: 'ECG anormal détecté — Fibrillation Auriculaire', patient: 'Marie Dubois',    date: "Aujourd'hui", heure: '14:30', statut: 'non_lu' },
  { id: 2,  type: 'ecg_recu',   titre: 'Nouvel ECG reçu',               message: 'Un nouveau fichier ECG a été envoyé',            patient: 'Robert Petit',    date: "Aujourd'hui", heure: '11:05', statut: 'non_lu' },
  { id: 3,  type: 'ia_analyse', titre: 'Analyse IA terminée',           message: "L'IA a terminé l'analyse de l'ECG",              patient: 'Pierre Lefebvre', date: "Aujourd'hui", heure: '09:45', statut: 'non_lu' },
  { id: 4,  type: 'ecg_recu',   titre: 'Nouvel ECG reçu',               message: 'Un nouveau fichier ECG a été envoyé',            patient: 'Jean Martin',     date: "Aujourd'hui", heure: '08:20', statut: 'non_lu' },
  { id: 5,  type: 'alerte',     titre: 'Alerte patient critique',       message: 'ECG anormal détecté — Tachycardie Ventriculaire',patient: 'Sophie Bernard',  date: 'Hier',        heure: '17:10', statut: 'lu' },
  { id: 6,  type: 'ia_analyse', titre: 'Analyse IA terminée',           message: "L'IA a terminé l'analyse de l'ECG",              patient: 'Anne Rousseau',   date: 'Hier',        heure: '15:30', statut: 'lu' },
  { id: 7,  type: 'ecg_recu',   titre: 'Nouvel ECG reçu',               message: 'Un nouveau fichier ECG a été envoyé',            patient: 'Marie Dubois',    date: 'Hier',        heure: '10:00', statut: 'lu' },
  { id: 8,  type: 'ia_analyse', titre: 'Analyse IA terminée',           message: "L'IA a terminé l'analyse de l'ECG",              patient: 'Robert Petit',    date: '30/03/2024',  heure: '14:20', statut: 'lu' },
  { id: 9,  type: 'ecg_recu',   titre: 'Nouvel ECG reçu',               message: 'Un nouveau fichier ECG a été envoyé',            patient: 'Pierre Lefebvre', date: '29/03/2024',  heure: '09:05', statut: 'lu' },
  { id: 10, type: 'alerte',     titre: 'Alerte patient critique',       message: 'ECG anormal détecté — Bradycardie Sinusale',     patient: 'Jean Martin',     date: '28/03/2024',  heure: '16:45', statut: 'lu' },
];

const typeConfig: Record<TypeNotif, { bg: string; color: string; border: string; icon: React.ReactNode; label: string }> = {
  ecg_recu:   { bg: '#EEF2FF', color: '#534AB7', border: '#C7D2FE', icon: <Activity className="w-4 h-4" />,    label: 'ECG reçu' },
  ia_analyse: { bg: '#E8F5F2', color: '#0F6E56', border: '#6EE7B7', icon: <Brain className="w-4 h-4" />,       label: 'Analyse IA' },
  alerte:     { bg: '#FEE2E2', color: '#A32D2D', border: '#FCA5A5', icon: <AlertTriangle className="w-4 h-4" />, label: 'Alerte' },
};

type Filtre = 'toutes' | TypeNotif;

export default function Notifications() {
  const [notifs, setNotifs]   = useState<Notification[]>(notificationsData);
  const [filtre, setFiltre]   = useState<Filtre>('toutes');

  const nonLus = notifs.filter((n) => n.statut === 'non_lu').length;

  const filtered = notifs.filter((n) => filtre === 'toutes' || n.type === filtre);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, statut: 'lu' as StatutNotif })));

  const markRead = (id: number) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, statut: 'lu' as StatutNotif } : n))
    );

  const deleteNotif = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  // Group by date
  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {});

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}
            >
              <Bell className="w-6 h-6" style={{ color: '#534AB7' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-3xl font-bold leading-none"
                  style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}
                >
                  Notifications
                </h1>
                {nonLus > 0 && (
                  <span
                    style={{
                      background: '#534AB7',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '20px',
                    }}
                  >
                    {nonLus} nouveau{nonLus > 1 ? 'x' : ''}
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                {notifs.length} notifications au total
              </p>
            </div>
          </div>

          {nonLus > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              style={{ borderRadius: '10px', fontSize: '13px', borderColor: 'var(--border-color)' }}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Filtres */}
        <div
          className="flex items-center gap-2 flex-wrap px-4 py-3 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1px solid var(--border-color)' }}
        >
          <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          {([
            { key: 'toutes',     label: 'Toutes' },
            { key: 'ecg_recu',   label: 'ECG reçus' },
            { key: 'ia_analyse', label: 'Analyses IA' },
            { key: 'alerte',     label: 'Alertes' },
          ] as { key: Filtre; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              style={{
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: filtre === f.key ? 500 : 400,
                border: filtre === f.key ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                background: filtre === f.key ? 'var(--primary)' : 'transparent',
                color: filtre === f.key ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste groupée par date */}
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              {/* Séparateur date */}
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {date}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>

              {/* Notifications du groupe */}
              <div
                style={{
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--surface)',
                  overflow: 'hidden',
                }}
              >
                {items.map((notif, idx) => {
                  const cfg    = typeConfig[notif.type];
                  const isLast = idx === items.length - 1;
                  const unread = notif.statut === 'non_lu';

                  return (
                    <div
                      key={notif.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
                        background: unread ? 'rgba(83,74,183,0.03)' : 'transparent',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--background)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = unread ? 'rgba(83,74,183,0.03)' : 'transparent')}
                    >
                      {/* Dot non-lu */}
                      <div
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: unread ? '#534AB7' : 'transparent',
                          flexShrink: 0,
                        }}
                      />

                      {/* Icône type */}
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: cfg.bg,
                          border: `1px solid ${cfg.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: cfg.color,
                          flexShrink: 0,
                        }}
                      >
                        {cfg.icon}
                      </div>

                      {/* Contenu */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: unread ? 600 : 400,
                              color: 'var(--text-primary)',
                            }}
                          >
                            {notif.titre}
                          </span>
                          <Badge
                            style={{
                              background: cfg.bg,
                              color: cfg.color,
                              border: 'none',
                              borderRadius: '20px',
                              fontSize: '10px',
                              padding: '1px 7px',
                            }}
                          >
                            {cfg.label}
                          </Badge>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1px' }}>
                          {notif.message}
                        </p>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                          {notif.patient}
                        </span>
                      </div>

                      {/* Heure */}
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', flexShrink: 0 }}>
                        {notif.heure}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {unread && (
                          <button
                            onClick={() => markRead(notif.id)}
                            title="Marquer comme lu"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              background: 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#534AB7',
                            }}
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          title="Supprimer"
                          style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#A32D2D',
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Aucune notification</p>
            </div>
          )}
        </div>
      </div>
    </MedecinLayout>
  );
}