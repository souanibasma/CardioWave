import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Heart,
  FileText,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  User
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Tableau de bord', path: '/tableau-de-bord', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Mes Patients', path: '/mes-patients', icon: <Users className="w-5 h-5" /> },
  { label: 'ECG Reçus', path: '/ecg-recus', icon: <Heart className="w-5 h-5" /> },
  { label: 'Articles', path: '/articles', icon: <FileText className="w-5 h-5" /> },
  { label: 'Chatbot IA', path: '/chatbot', icon: <MessageCircle className="w-5 h-5" /> },
  { label: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
  { label: 'Paramètres', path: '/parametres', icon: <Settings className="w-5 h-5" /> },
];

export function MedecinLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside 
        className="fixed left-0 top-0 h-full w-64 flex flex-col"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border-color)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-family-heading)', letterSpacing: '-0.02em' }}>
                CardioWave
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                AI Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'shadow-sm'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                background: isActive(item.path) ? 'var(--primary)' : 'transparent',
                color: isActive(item.path) ? '#FFFFFF' : 'var(--text-secondary)',
              }}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#E8F5F2' }}>
              <User className="w-5 h-5" style={{ color: 'var(--accent-ai)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                Dr. {user?.prenom} {user?.nom}
              </p>
              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                {user?.specialite}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 h-9"
            style={{ borderRadius: '8px', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <div className="max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
