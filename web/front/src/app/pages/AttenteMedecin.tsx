import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';

export default function AttenteMedecin() {
  const { user, pendingUser, isPending, logout } = useAuth();
  const pendingDoctor = pendingUser || user;

  // If not pending, redirect away
  if (!isPending || !pendingDoctor || pendingDoctor.role !== 'medecin') {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* Background blobs */}
      <div style={s.bgLayer}>
        <div className="am-blob b1" />
        <div className="am-blob b2" />
        <div className="am-blob b3" />
      </div>

      {/* Top nav */}
      <nav style={s.nav}>
        <Link to="/" style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span style={s.logoText}>CardioWave</span>
        </Link>
      </nav>

      {/* Main card */}
      <div style={s.center}>
        <div className="am-fadein" style={s.card}>

          {/* Animated clock icon */}
          <div style={s.iconWrap}>
            <div className="am-pulse" style={s.iconCircle}>
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 style={s.title}>Compte en cours de validation</h1>
          <p style={s.subtitle}>
            Bonjour <strong>{pendingDoctor.prenom}</strong>, votre inscription a bien été enregistrée.
          </p>

          {/* Status banner */}
          <div style={s.statusBanner}>
            <div style={s.statusDot} />
            <span style={s.statusText}>En attente de vérification par l'administrateur</span>
          </div>

          {/* Info card */}
          <div style={s.infoCard}>
            <h3 style={s.infoTitle}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="10" cy="10" r="8"/><line x1="10" y1="7" x2="10" y2="10"/><circle cx="10" cy="13" r=".5" fill="#1a5fc8"/>
              </svg>
              Comment ça marche ?
            </h3>
            <div style={s.stepsList}>
              {[
                { n: '1', text: 'Votre numéro d\'inscription est vérifié par notre équipe', done: true },
                { n: '2', text: 'Un administrateur valide votre profil médecin', done: false },
                { n: '3', text: 'Vous recevez l\'accès complet au dashboard', done: false },
              ].map((step) => (
                <div key={step.n} style={s.stepRow}>
                  <div style={{
                    ...s.stepCircle,
                    background: step.done ? '#dcfce7' : '#f1f5f9',
                    color: step.done ? '#15803d' : '#94a3b8',
                    border: step.done ? '2px solid #86efac' : '2px solid #e2e8f0',
                  }}>
                    {step.done ? (
                      <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="2 7 5.5 10.5 12 3"/></svg>
                    ) : step.n}
                  </div>
                  <span style={{ fontSize: '.9rem', color: step.done ? '#15803d' : '#475569', fontWeight: step.done ? 600 : 400 }}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User info summary */}
          <div style={s.userInfo}>
            <div style={s.userRow}>
              <span style={s.userLabel}>Email</span>
              <span style={s.userValue}>{pendingDoctor.email}</span>
            </div>
            <div style={s.userRow}>
              <span style={s.userLabel}>Spécialité</span>
              <span style={s.userValue}>{pendingDoctor.specialite || '—'}</span>
            </div>
          </div>

          {/* Reassurance */}
          <div style={s.reassurance}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M10 18s-7-4.35-7-10V4l7-2 7 2v4c0 5.65-7 10-7 10z"/>
            </svg>
            <span style={{ fontSize: '.85rem', color: '#475569', lineHeight: 1.6 }}>
              Vos données sont sécurisées. Vous serez notifié dès que votre compte sera activé.
            </span>
          </div>

          {/* Actions */}
          <div style={s.actions}>
            <button onClick={logout} style={s.logoutBtn}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M7 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/><polyline points="11 15 15 10 11 5"/><line x1="15" y1="10" x2="5" y2="10"/>
              </svg>
              Se déconnecter
            </button>
            <Link to="/" style={s.homeLink}>
              Retour à l'accueil
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── CSS animations ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Outfit:wght@400;600;700&display=swap');

  @keyframes am-fadein { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes am-pulse { 0%,100% { box-shadow:0 0 0 0 rgba(245,158,11,0.25) } 50% { box-shadow:0 0 0 16px rgba(245,158,11,0) } }
  @keyframes am-blob1 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(-30px,20px) scale(1.08) } }
  @keyframes am-blob2 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(24px,-28px) scale(1.06) } }
  @keyframes am-blob3 { 0%,100% { transform:translate(0,0) scale(1) } 50% { transform:translate(-18px,26px) scale(1.10) } }

  .am-fadein { animation: am-fadein .7s ease both; }
  .am-pulse { animation: am-pulse 2.5s ease-in-out infinite; }
  .am-blob { position:absolute; border-radius:50%; filter:blur(60px); pointer-events:none; }
  .am-blob.b1 { width:400px; height:400px; background:rgba(198,223,255,0.45); top:-120px; left:-80px; animation:am-blob1 12s ease-in-out infinite; }
  .am-blob.b2 { width:300px; height:300px; background:rgba(253,230,138,0.30); bottom:-60px; right:-40px; animation:am-blob2 10s ease-in-out infinite; }
  .am-blob.b3 { width:200px; height:200px; background:rgba(191,219,254,0.40); top:40%; right:10%; animation:am-blob3 14s ease-in-out infinite; }
`;

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: 'linear-gradient(155deg, #f8faff 0%, #f0f4ff 40%, #fefce8 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  bgLayer: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' },

  nav: {
    position: 'relative', zIndex: 10,
    display: 'flex', alignItems: 'center',
    padding: '20px 40px',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoIcon: {
    width: 36, height: 36, background: '#1a5fc8', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(26,95,200,0.30)',
  },
  logoText: { fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#1a1e2e' },

  center: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 'calc(100vh - 80px)', padding: '20px 24px',
  },

  card: {
    background: '#ffffff', borderRadius: 28,
    padding: '48px 44px', maxWidth: 520, width: '100%',
    border: '1.5px solid rgba(200,220,255,0.5)',
    boxShadow: '0 24px 64px rgba(26,95,200,0.08)',
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
    gap: 24,
  },

  iconWrap: { marginBottom: 4 },
  iconCircle: {
    width: 72, height: 72, borderRadius: '50%',
    background: 'rgba(245,158,11,0.10)', border: '2px solid rgba(245,158,11,0.25)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  title: {
    fontFamily: "'Outfit', sans-serif", fontSize: '1.7rem', fontWeight: 700,
    color: '#1a1e2e', textAlign: 'center' as const, margin: 0, lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '.95rem', color: '#64748b', textAlign: 'center' as const,
    lineHeight: 1.6, margin: 0, marginTop: -8,
  },

  statusBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: 12, padding: '12px 20px', width: '100%',
  },
  statusDot: {
    width: 10, height: 10, borderRadius: '50%', background: '#f59e0b',
    boxShadow: '0 0 0 4px rgba(245,158,11,0.15)', flexShrink: 0,
  },
  statusText: { fontSize: '.88rem', fontWeight: 600, color: '#92400e' },

  infoCard: {
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16,
    padding: '20px 22px', width: '100%',
  },
  infoTitle: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: '.85rem', fontWeight: 700, color: '#1a5fc8',
    textTransform: 'uppercase' as const, letterSpacing: '.4px',
    marginBottom: 16, margin: 0, marginBottom: 16,
  },
  stepsList: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  stepRow: { display: 'flex', alignItems: 'center', gap: 12 },
  stepCircle: {
    width: 28, height: 28, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '.75rem', fontWeight: 700, flexShrink: 0,
  },

  userInfo: {
    width: '100%', display: 'flex', flexDirection: 'column' as const, gap: 0,
    border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden',
  },
  userRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 18px', borderBottom: '1px solid #f1f5f9',
  },
  userLabel: { fontSize: '.82rem', color: '#94a3b8', fontWeight: 500 },
  userValue: { fontSize: '.88rem', color: '#1e293b', fontWeight: 600 },

  reassurance: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)',
    borderRadius: 12, padding: '13px 16px', width: '100%',
  },

  actions: {
    display: 'flex', flexDirection: 'column' as const, gap: 12,
    width: '100%', marginTop: 4,
  },
  logoutBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px 24px', background: '#fff', color: '#dc2626',
    border: '1.5px solid rgba(220,38,38,0.25)', borderRadius: 50,
    fontSize: '.93rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer', transition: 'all .2s',
  },
  homeLink: {
    textAlign: 'center' as const, fontSize: '.88rem', color: '#64748b',
    textDecoration: 'none', fontWeight: 500,
  },
};
