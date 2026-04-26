import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages publiques
import Home from './pages/Home';
import Connexion from './pages/Connexion';
import InscriptionMedecin from './pages/InscriptionMedecin';
import InscriptionPatient from './pages/InscriptionPatient';

// Pages médecin
import TableauDeBord from './pages/TableauDeBord';
import DossierPatient from './pages/DossierPatient';
import ECGAnalysis from './pages/ECGAnalysis';
import AnalyseECG from './pages/AnalyseECG';
import Articles from './pages/Articles';
import ChatbotIA from './pages/ChatbotIA';
import EcgRecus from './pages/EcgRecus';
import Notifications from './pages/Notifications';
import Parametres from './pages/Parametres';
import ListePatients from './pages/PatientDashboard';

// Pages patient
import Patient from './pages/Patient';
import RechercherMedecin from './pages/Recherchermedecin';
import EnvoyerECG from './pages/Envoyerecg';
import ProfilPatient from './pages/Profilpatient';

// Pages admin
import AdminDashboard from './pages/Admin';
import AdminVerification from './pages/AdminVerification';
import AdminArticles from './pages/AdminArticles';
import AdminNotifications from './pages/AdminNotifications';

export const router = createBrowserRouter([
  // Public
  { path: '/', element: <Home /> },
  { path: '/connexion', element: <Connexion /> },
  { path: '/inscription', element: <InscriptionMedecin /> },
  { path: '/inscription-patient', element: <InscriptionPatient /> },

  // Patient
  {
    path: '/patient/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <Patient />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/rechercher-medecin',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <RechercherMedecin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/envoyer-ecg/:medecinId',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <EnvoyerECG />
      </ProtectedRoute>
    ),
  },
  {
    path: '/patient/profil',
    element: (
      <ProtectedRoute allowedRoles={['patient']}>
        <ProfilPatient />
      </ProtectedRoute>
    ),
  },

  // Médecin
  {
    path: '/tableau-de-bord',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <TableauDeBord />
      </ProtectedRoute>
    ),
  },
  {
    path: '/mes-patients',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <ListePatients />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dossier-patient/:id',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <DossierPatient />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ecg-recus',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <EcgRecus />
      </ProtectedRoute>
    ),
  },

  // Garde les deux routes si ton projet utilise les deux URLs
  {
    path: '/ecg-analysis/:id',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <ECGAnalysis />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analyse-ecg/:id',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <AnalyseECG />
      </ProtectedRoute>
    ),
  },

  {
    path: '/articles',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <Articles />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chatbot',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <ChatbotIA />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute allowedRoles={['medecin']}>
        <ChatbotIA />
      </ProtectedRoute>
    ),
  },

  // Commun
  { path: '/notifications', element: <Notifications /> },
  { path: '/parametres', element: <Parametres /> },

  // Admin
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/verification',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminVerification />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/articles',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminArticles />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/notifications',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminNotifications />
      </ProtectedRoute>
    ),
  },

  // Fallback
  { path: '*', element: <Navigate to="/connexion" replace /> },
]);