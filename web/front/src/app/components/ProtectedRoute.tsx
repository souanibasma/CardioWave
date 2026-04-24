import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // ✅ Redirection selon le rôle réel — évite la boucle infinie
    if (user.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
    return <Navigate to="/tableau-de-bord" replace />;
  }

  return <>{children}</>;
}