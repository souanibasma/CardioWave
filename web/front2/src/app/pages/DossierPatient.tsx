import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MedecinLayout } from '../components/MedecinLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, Mail, Phone, MapPin, Calendar, Activity, FileText, Eye } from 'lucide-react';

// Mock patient data
const patientData = {
  id: '1',
  nom: 'Dubois',
  prenom: 'Marie',
  age: 62,
  dateNaissance: '15/03/1962',
  email: 'marie.dubois@email.fr',
  telephone: '+33 6 12 34 56 78',
  adresse: '15 Rue de la République, 75001 Paris',
  numeroSecu: '2 62 03 75 123 456 78',
  groupeSanguin: 'A+',
  antecedents: [
    'Hypertension artérielle',
    'Diabète de type 2',
    'Hypercholestérolémie'
  ],
  traitements: [
    'Ramipril 5mg - 1 fois/jour',
    'Metformine 850mg - 2 fois/jour',
    'Atorvastatine 20mg - 1 fois/jour'
  ]
};

const ecgHistorique = [
  { 
    id: 1, 
    date: '02/04/2024', 
    heure: '14:30',
    resultat: 'Anormal', 
    diagnostic: 'Fibrillation Auriculaire',
    frequence: '145 bpm',
    statut: 'Analysé'
  },
  { 
    id: 2, 
    date: '15/03/2024', 
    heure: '10:15',
    resultat: 'Normal', 
    diagnostic: 'Sinus Rhythm',
    frequence: '72 bpm',
    statut: 'Analysé'
  },
  { 
    id: 3, 
    date: '28/02/2024', 
    heure: '16:45',
    resultat: 'Normal', 
    diagnostic: 'Sinus Rhythm',
    frequence: '68 bpm',
    statut: 'Analysé'
  },
  { 
    id: 4, 
    date: '10/01/2024', 
    heure: '09:30',
    resultat: 'Normal', 
    diagnostic: 'Sinus Rhythm',
    frequence: '75 bpm',
    statut: 'Analysé'
  },
];

const notesMedicales = [
  {
    id: 1,
    date: '02/04/2024',
    auteur: 'Dr. Sophie Martin',
    contenu: 'Détection de fibrillation auriculaire. Patient orienté vers consultation cardiologique urgente. Traitement anticoagulant à envisager.'
  },
  {
    id: 2,
    date: '15/03/2024',
    auteur: 'Dr. Sophie Martin',
    contenu: 'Contrôle de routine. ECG normal. Bonne observance du traitement. Prochain contrôle dans 3 mois.'
  }
];

export default function DossierPatient() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('informations');

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
        {/* Header Patient */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#E8F5F2' }}>
                <User className="w-10 h-10" style={{ color: 'var(--accent-ai)' }} />
              </div>
              <div>
                <h1 className="text-4xl mb-2" style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)' }}>
                  {patientData.prenom} {patientData.nom}
                </h1>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>{patientData.age} ans</span>
                  <span>•</span>
                  <span>Né(e) le {patientData.dateNaissance}</span>
                  <span>•</span>
                  <span>Groupe {patientData.groupeSanguin}</span>
                </div>
              </div>
            </div>
            <Button style={{ background: 'var(--primary)', borderRadius: '10px' }}>
              <Activity className="w-4 h-4 mr-2" />
              Nouveau ECG
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={{ background: 'var(--surface)', borderRadius: '12px', padding: '4px' }}>
            <TabsTrigger 
              value="informations" 
              style={{ 
                borderRadius: '8px',
                fontFamily: 'var(--font-family-body)',
                fontSize: '14px'
              }}
            >
              Informations
            </TabsTrigger>
            <TabsTrigger 
              value="historique" 
              style={{ 
                borderRadius: '8px',
                fontFamily: 'var(--font-family-body)',
                fontSize: '14px'
              }}
            >
              Historique ECG
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              style={{ 
                borderRadius: '8px',
                fontFamily: 'var(--font-family-body)',
                fontSize: '14px'
              }}
            >
              Notes médicales
            </TabsTrigger>
          </TabsList>

          {/* Informations Tab */}
          <TabsContent value="informations" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '18px' }}>
                    Coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Email</p>
                      <p style={{ color: 'var(--text-primary)' }}>{patientData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Téléphone</p>
                      <p style={{ color: 'var(--text-primary)' }}>{patientData.telephone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Adresse</p>
                      <p style={{ color: 'var(--text-primary)' }}>{patientData.adresse}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 mt-0.5" style={{ color: 'var(--text-secondary)' }} />
                    <div>
                      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>N° Sécurité Sociale</p>
                      <p style={{ color: 'var(--text-primary)' }}>{patientData.numeroSecu}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
                <CardHeader>
                  <CardTitle style={{ fontFamily: 'var(--font-family-heading)', color: 'var(--text-primary)', fontSize: '18px' }}>
                    Antécédents médicaux
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Pathologies</p>
                    <div className="space-y-2">
                      {patientData.antecedents.map((antecedent, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-ai)' }} />
                          <p style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{antecedent}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Traitements en cours</p>
                    <div className="space-y-2">
                      {patientData.traitements.map((traitement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }} />
                          <p style={{ color: 'var(--text-primary)', fontSize: '15px' }}>{traitement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Historique ECG Tab */}
          <TabsContent value="historique" className="mt-6">
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {ecgHistorique.map((ecg) => (
                    <div 
                      key={ecg.id}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{ background: 'var(--background)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                          <Activity className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              ECG - {ecg.date}
                            </p>
                            <Badge 
                              style={{ 
                                background: ecg.resultat === 'Normal' ? '#E8F5F2' : '#FEE2E2',
                                color: ecg.resultat === 'Normal' ? 'var(--accent-ai)' : 'var(--error)',
                                borderRadius: '6px',
                                border: 'none'
                              }}
                            >
                              {ecg.resultat}
                            </Badge>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {ecg.diagnostic} • FC: {ecg.frequence} • {ecg.heure}
                          </p>
                        </div>
                      </div>
                      <Link to={`/analyse-ecg/${ecg.id}`}>
                        <Button size="sm" variant="outline" style={{ borderRadius: '8px', borderColor: 'var(--border-color)' }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir l'analyse
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes médicales Tab */}
          <TabsContent value="notes" className="mt-6">
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border-color)' }}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {notesMedicales.map((note) => (
                    <div 
                      key={note.id}
                      className="p-5 rounded-xl"
                      style={{ background: 'var(--background)', border: '1px solid var(--border-color)' }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {note.auteur}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {note.date}
                          </p>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
                        {note.contenu}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MedecinLayout>
  );
}
