// src/app/pages/Connexion.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Connexion() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (savedUser?.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (savedUser?.role === 'admin') {
      navigate('/admin/dashboard'); 
      }else {
        navigate('/tableau-de-bord');
      }
    } catch {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      {/* background blobs — same as inscription */}
      <div style={s.bg}>
        <div className="cw-blob" style={{ ...s.blob, width:500, height:500, background:'#c8e2ff', top:-130, left:-110 }} />
        <div className="cw-blob" style={{ ...s.blob, width:380, height:380, background:'#e3f0ff', top:'35%', right:-90, animationDelay:'4s' }} />
        <div className="cw-blob" style={{ ...s.blob, width:300, height:300, background:'#dbeafe', bottom:-80, left:'32%', animationDelay:'8s' }} />
      </div>

      {/* ── Navbar — same structure as inscription ── */}
      <nav style={s.nav}>
        <Link to="/" style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span style={s.logoText}>CardioWave</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:'.9rem', color:'#6b7a99' }}>Pas encore de compte ?</span>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                document.getElementById('pourqui')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            style={{ color:'#1a5fc8', fontWeight:600, textDecoration:'none', background:'none', border:'none', cursor:'pointer', fontSize:'.88rem' }}
          >
            Créer un compte
          </button>
        </div>
      </nav>

      {/* ── Page content — same layout as inscription right panel ── */}
      <div style={s.pageContent}>

        {/* Header */}
        <div className="cw-fadeup" style={s.header}>
          <h1 style={s.pageTitle}>Connectez-vous</h1>
          <p style={s.pageSubtitle}>
            Accédez à votre espace CardioWave
          </p>
        </div>

        {/* Form card */}
        <div className="cw-fadeup" style={s.card}>

          {/* Section label */}
          <div style={s.sectionLabel}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round"><path d="M10 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0"/></svg>
            Identité d'utilisateur
          </div>
          

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>

            {/* Email */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <div style={{ position:'relative' }}>
                <span style={s.inputIcon}>
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#9bacc8" strokeWidth="1.7" strokeLinecap="round">
                    <rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 4l8 7 8-7"/>
                  </svg>
                </span>
                <input
                  className="cw-input"
                  type="email"
                  placeholder="dr.dupont@hopital.fr"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft:44 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={s.fieldGroup}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label style={s.label}>Mot de passe</label>
                <Link to="/mot-de-passe-oublie" style={s.forgotLink}>Mot de passe oublié ?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <span style={s.inputIcon}>
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#9bacc8" strokeWidth="1.7" strokeLinecap="round">
                    <rect x="4" y="8" width="12" height="10" rx="2"/><path d="M7 8V6a3 3 0 0 1 6 0v2"/>
                  </svg>
                </span>
                <input
                  className="cw-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft:44, paddingRight:46 }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={s.eyeBtn}>
                  {showPass
                    ? <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 10c-.46-2.54-2.88-5-7.94-5S2.52 7.46 2.06 10c.46 2.54 2.88 5 7.94 5s7.48-2.46 7.94-5z"/><circle cx="10" cy="10" r="3"/><line x1="3" y1="3" x2="17" y2="17"/></svg>
                    : <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 10c-.46-2.54-2.88-5-7.94-5S2.52 7.46 2.06 10c.46 2.54 2.88 5 7.94 5s7.48-2.46 7.94-5z"/><circle cx="10" cy="10" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={s.errorBox}>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink:0 }}>
                  <circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><circle cx="10" cy="14" r=".5" fill="#dc2626"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="cw-btn" disabled={isLoading} style={{ marginTop:6 }}>
              {isLoading
                ? <span style={{ display:'flex', alignItems:'center', gap:9 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'cw-spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Connexion…
                  </span>
                : 'Se connecter →'
              }
            </button>

          </form>

          {/* Demo accounts */}
          
          
          {/* Footer link */}
          <p style={{ textAlign:'center', fontSize:'.88rem', color:'#6b7a99', marginTop:22 }}>
            Pas encore de compte ?{' '}
            <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                document.getElementById('pourqui')?.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }}
            style={{ color:'#1a5fc8', fontWeight:600, textDecoration:'none', background:'none', border:'none', cursor:'pointer', fontSize:'.88rem' }}
          >
            Créer un compte
          </button>
          </p>

        </div>
      </div>
    </div>
  );
}

/* ─── CSS (same classes as inscription) ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  @keyframes cw-blob   { from{transform:translate(0,0) scale(1)} to{transform:translate(24px,16px) scale(1.08)} }
  @keyframes cw-fadeup { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cw-spin   { to{transform:rotate(360deg)} }

  .cw-blob   { animation:cw-blob 14s ease-in-out infinite alternate; }
  .cw-fadeup { animation:cw-fadeup .65s ease both; }

  .cw-input {
    width:100%; padding:13px 16px;
    border:1.5px solid rgba(200,220,255,.7); border-radius:12px;
    font-size:.94rem; font-family:'DM Sans',sans-serif; color:#1a1e2e;
    background:#fff; outline:none; box-sizing:border-box;
    transition:border-color .2s,box-shadow .2s;
  }
  .cw-input:focus  { border-color:#1a5fc8; box-shadow:0 0 0 4px rgba(26,95,200,.09); }
  .cw-input::placeholder { color:#b0bcd0; }

  .cw-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    padding:15px 28px; background:#1a5fc8; color:white; border:none;
    border-radius:50px; font-size:.97rem; font-weight:600;
    font-family:'DM Sans',sans-serif; cursor:pointer;
    box-shadow:0 6px 20px rgba(26,95,200,.28);
    transition:background .2s,transform .15s,box-shadow .2s;
  }
  .cw-btn:hover:not(:disabled) { background:#1550b0; transform:translateY(-2px); box-shadow:0 10px 28px rgba(26,95,200,.36); }
  .cw-btn:disabled { opacity:.6; cursor:not-allowed; }

  .demo-row { transition:background .15s; }
  .demo-row:hover { background:rgba(26,95,200,0.06) !important; border-radius:10px; }
`;

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {

  root: {
    minHeight:'100vh', position:'relative', overflow:'hidden',
    fontFamily:"'DM Sans','Segoe UI',sans-serif",
    background:'rgba(232, 245, 255, 0.1)',
    display:'flex', flexDirection:'column',
  },

  bg:   { position:'fixed', inset:0, zIndex:0, pointerEvents:'none' },
  blob: { position:'absolute', borderRadius:'50%', filter:'blur(85px)', opacity:.20 },

  /* Navbar — identical to inscription */
  nav: {
    position:'sticky', top:0, zIndex:100,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'16px 56px',
    background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)',
    borderBottom:'1px solid rgba(200,220,255,0.35)',
    boxShadow:'0 1px 20px rgba(26,95,200,0.05)',
  },
  logoWrap: { display:'flex', alignItems:'center', gap:10, textDecoration:'none' },
  logoIcon: {
    width:34, height:34, background:'#1a5fc8', borderRadius:9,
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 4px 12px rgba(26,95,200,0.25)',
  },
  logoText: {
    fontFamily:"'Playfair Display',Georgia,serif",
    fontSize:'1.3rem', fontWeight:700, color:'#1a5fc8',
  },
  navCta: {
    background:'#1a5fc8', color:'white', padding:'10px 24px',
    borderRadius:50, textDecoration:'none', fontSize:'.87rem', fontWeight:600,
    boxShadow:'0 4px 12px rgba(26,95,200,0.22)',
  },

  /* Page */
  pageContent: {
    position:'relative', zIndex:1, flex:1,
    display:'flex', flexDirection:'column', alignItems:'center',
    padding:'56px 24px 60px',
  },

  header: { textAlign:'center', marginBottom:36 },
  pageTitle: {
    fontFamily:  "'Outfit', sans-serif",
    fontSize:'2.6rem', fontWeight:700, color:'#1a1e2e',
    marginBottom:10, lineHeight:1.18,
  },
  pageSubtitle: { fontSize:'1rem', color:'#6b7a99', lineHeight:1.7 },

  /* Card — same as inscription */
  card: {
    width:'100%', maxWidth:460,
    background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)',
    borderRadius:28, padding:'36px 36px',  // ← réduit de 40px 44px
    border:'1.5px solid rgba(200,220,255,0.5)',
    boxShadow:'0 20px 60px rgba(26,95,200,0.09)',
  },

  sectionLabel: {
    display:'flex', alignItems:'center', gap:8,
    fontSize:'.78rem', fontWeight:700, color:'#1a5fc8',
    textTransform:'uppercase', letterSpacing:'.5px',
    marginBottom:22,
  },

  fieldGroup: { display:'flex', flexDirection:'column', gap:7 },
  label:      { fontSize:'.83rem', fontWeight:600, color:'#4a556e', letterSpacing:'.2px' },

  inputIcon: {
    position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
    display:'flex', alignItems:'center', zIndex:1, pointerEvents:'none',
  },
  eyeBtn: {
    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
    background:'none', border:'none', cursor:'pointer',
    color:'#8899bb', display:'flex', padding:3,
  },
  forgotLink: {
    fontSize:'.82rem', color:'#1a5fc8', textDecoration:'none', fontWeight:500,
  },

  errorBox: {
    display:'flex', alignItems:'center', gap:8,
    background:'#fef2f2', border:'1px solid rgba(220,38,38,.2)',
    color:'#dc2626', borderRadius:10, padding:'11px 14px', fontSize:'.88rem',
  },

  /* Demo box */
  demoBox: {
    background:'rgba(26,95,200,0.05)', border:'1px solid rgba(26,95,200,0.12)',
    borderRadius:16, padding:'16px 18px', marginTop:24,
  },
  demoTitle: {
    fontSize:'.77rem', fontWeight:700, color:'#1a5fc8',
    textTransform:'uppercase', letterSpacing:'.5px', marginBottom:10,
  },
  demoRow: {
    display:'flex', alignItems:'center', gap:10,
    padding:'8px 10px', cursor:'pointer', borderRadius:10,
  },
};