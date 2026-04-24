// src/app/pages/InscriptionMedecin.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InscriptionMedecin() {
  const [nom, setNom]                         = useState('');
  const [prenom, setPrenom]                   = useState('');
  const [specialite, setSpecialite]           = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [carteMedicale, setCarteMedicale]     = useState<File | null>(null);
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [dragOver, setDragOver]               = useState(false);
  const [error, setError]                     = useState('');
  const [isLoading, setIsLoading]             = useState(false);
  const [isSubmitted, setIsSubmitted]         = useState(false);
  const [step, setStep]                       = useState(1);
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const handleFileChange = (file: File | null) => {
    if (file && file.size <= 5 * 1024 * 1024) setCarteMedicale(file);
    else if (file) setError('Fichier trop volumineux (max 5 MB)');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!carteMedicale)               return setError('Veuillez télécharger votre carte médicale.');
    if (password !== confirmPassword) return setError('Les mots de passe ne correspondent pas.');
    if (password.length < 6)          return setError('Le mot de passe doit contenir au moins 6 caractères.');
    setIsLoading(true);
    try {
      await signup({
      nom,
      prenom,
      specialite,
      email,
      password,
      carteMedicale,
      role: 'medecin',
    });
      setIsSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── SUCCESS STATE ── */
  if (isSubmitted) {
    return (
      <div style={s.root}>
        <style>{CSS}</style>
        <div style={s.bg}>
          <div className="cw-blob" style={{ ...s.blob, width:480, height:480, background:'#93c5fd', top:-100, left:-100 }} />
          <div className="cw-blob" style={{ ...s.blob, width:340, height:340, background:'#bfdbfe', bottom:-60, right:-60, animationDelay:'5s' }} />
        </div>
        <div style={{ position:'relative', zIndex:1, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
          <div className="cw-fadeup" style={s.successCard}>
            <div style={s.successIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 style={s.successTitle}>Demande envoyée !</h2>
            <p style={s.successText}>Votre compte sera activé après vérification de votre carte médicale par l'administrateur. Vous recevrez un email de confirmation sous 24h.</p>
            <div style={s.successInfo}>
              <span style={{ fontSize:'1.1rem' }}>📋</span>
              <span style={{ fontSize:'.88rem', color:'#1a5fc8', fontWeight:500 }}>Vérification en cours · Délai estimé : 24h</span>
            </div>
            <Link to="/connexion" style={s.successBtn}>Retour à la connexion</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.root}>
      <style>{CSS}</style>

      <div style={s.splitWrap}>

        {/* ══════════════════════════════════════
            LEFT PANEL — Organic blob design
        ══════════════════════════════════════ */}
        <div style={s.leftPanel}>

          {/* ── Animated organic blobs ── */}
          <div className="blob-org b1" style={s.bOrg1} />
          <div className="blob-org b2" style={s.bOrg2} />
          <div className="blob-org b3" style={s.bOrg3} />
          <div className="blob-org b4" style={s.bOrg4} />
          <div className="blob-org b5" style={s.bOrg5} />
          <div className="blob-org b6" style={s.bOrg6} />

          {/* ── Logo ── */}
          <Link to="/" style={s.leftLogo}>
            <div style={s.leftLogoIcon}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span style={s.leftLogoText}>CardioWave</span>
          </Link>

          {/* ── Center text ── */}
          <div style={s.leftContent}>
          <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', // 👈 un peu en haut
                alignItems: 'center',         // 👈 centré horizontalement
                height: '100%',
                paddingTop: '80px',           // 👈 espace premium en haut
                textAlign: 'center',
                marginBottom: '30px'

              }}
            >
              <h1
                style={{
                  ...s.leftTitle,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '30px'
                }}
              >
                <span  style={{
                  fontFamily:  "'Outfit', sans-serif",
                }}>L'intelligence artificielle au</span>
                <span style={s.leftTitleAccent}>service du cœur.</span>
              </h1>
            </div>

            <p style={s.leftDesc}>
              Analysez vos ECG en temps réel, détectez les anomalies cardiaques et améliorez
              vos diagnostics grâce à notre IA médicale de pointe.
            </p>

            {/* Feature list */}
            <div style={s.featureList}>
              {[
                { text:'Surveillance ECG en temps réel' },
                {text:'Diagnostic assisté par IA' },
                {  text:'Alertes intelligentes 24/7' },
              ].map(f => (
                <div
                  key={f.text}
                  style={s.featureItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(31, 64, 230, 0.18)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(31, 64, 230, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={s.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom stats ── */}
          

        </div>{/* end leftPanel */}

        {/* ══════════════════════════════════════
            RIGHT PANEL — Original form (unchanged)
        ══════════════════════════════════════ */}
        <div style={s.rightPanel}>
          <div style={s.bg}>
            <div className="cw-blob" style={{ ...s.blob, width:500, height:500, background:'#93c5fd', top:-120, left:-100 }} />
            <div className="cw-blob" style={{ ...s.blob, width:380, height:380, background:'#bfdbfe', top:'40%', right:-80, animationDelay:'4s' }} />
            <div className="cw-blob" style={{ ...s.blob, width:280, height:280, background:'#dbeafe', bottom:-70, left:'35%', animationDelay:'8s' }} />
          </div>

          <div style={s.pageWrap}>

            <nav style={s.nav}>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 16,
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '.88rem', color: '#6b7a99' }}>
                  Déjà un compte ?
                </span>

                <Link to="/connexion" style={s.navCta}>
                  Se connecter
                </Link>
              </div>
            </nav>

            <div style={s.formArea}>

              <div className="cw-fadeup" style={{ textAlign:'center', marginBottom:36 }}>
                <h1 style={s.pageTitle}>Créez votre compte médecin</h1>
                <p style={s.pageSubtitle}>Rejoignez CardioWave et accédez à l'analyse ECG propulsée par l'IA</p>
              </div>

              <div className="cw-fadeup" style={s.stepRow}>
                {[{ n:1, label:'Informations' }, { n:2, label:'Sécurité & Document' }].map(st => (
                  <div key={st.n} style={s.stepItem}>
                    <div style={{
                      ...s.stepCircle,
                      background: step >= st.n ? '#1a5fc8' : 'rgba(200,220,255,0.4)',
                      color: step >= st.n ? 'white' : '#6b7a99',
                      boxShadow: step === st.n ? '0 4px 14px rgba(26,95,200,0.3)' : 'none',
                    }}>
                      {step > st.n
                        ? <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="2 7 5.5 10.5 12 3"/></svg>
                        : st.n}
                    </div>
                    <span style={{ fontSize:'.8rem', fontWeight: step === st.n ? 600 : 400, color: step === st.n ? '#1a5fc8' : '#6b7a99' }}>{st.label}</span>
                    {st.n < 2 && <div style={s.stepLine} />}
                  </div>
                ))}
              </div>

              <div className="cw-fadeup" style={s.card}>
                <form onSubmit={handleSubmit}>

                  {step === 1 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                      <div style={s.sectionLabel}>
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round"><path d="M10 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0"/></svg>
                        Identité du médecin
                      </div>
                      <div style={s.row2}>
                        <Field label="Prénom" icon="user"><input className="cw-input" type="text" placeholder="Jean" value={prenom} onChange={e=>setPrenom(e.target.value)} required style={{ paddingLeft:44 }}/></Field>
                        <Field label="Nom" icon="user"><input className="cw-input" type="text" placeholder="Dupont" value={nom} onChange={e=>setNom(e.target.value)} required style={{ paddingLeft:44 }}/></Field>
                      </div>
                      <Field label="Spécialité médicale" icon="stethoscope"><input className="cw-input" type="text" placeholder="Cardiologie, Médecine interne…" value={specialite} onChange={e=>setSpecialite(e.target.value)} required style={{ paddingLeft:44 }}/></Field>
                      <Field label="Email professionnel" icon="email"><input className="cw-input" type="email" placeholder="dr.dupont@hopital.fr" value={email} onChange={e=>setEmail(e.target.value)} required style={{ paddingLeft:44 }}/></Field>
                      {error && <ErrBox msg={error}/>}
                      <button type="button" className="cw-btn" onClick={() => { if (!prenom||!nom||!specialite||!email) { setError('Veuillez remplir tous les champs.'); return; } setError(''); setStep(2); }} style={{ marginTop:8 }}>
                        Continuer
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M4 10h12M12 4l6 6-6 6"/></svg>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                      <div style={s.sectionLabel}>
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round"><rect x="4" y="8" width="12" height="10" rx="2"/><path d="M7 8V6a3 3 0 0 1 6 0v2"/></svg>
                        Sécurité du compte
                      </div>
                      <div style={s.row2}>
                        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                          <label style={s.label}>Mot de passe</label>
                          <div style={{ position:'relative' }}>
                            <IconLock/>
                            <input className="cw-input" type={showPass?'text':'password'} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required style={{ paddingLeft:44, paddingRight:44 }}/>
                            <EyeBtn show={showPass} toggle={()=>setShowPass(p=>!p)}/>
                          </div>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                          <label style={s.label}>Confirmer</label>
                          <div style={{ position:'relative' }}>
                            <IconLock/>
                            <input className="cw-input" type={showConfirm?'text':'password'} placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required style={{ paddingLeft:44, paddingRight:44 }}/>
                            <EyeBtn show={showConfirm} toggle={()=>setShowConfirm(p=>!p)}/>
                          </div>
                        </div>
                      </div>
                      {password && <PasswordStrength pwd={password}/>}
                      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                        <label style={s.label}>
                          Carte médicale <span style={{ color:'#e74d7f' }}>*</span>
                          <span style={{ color:'#aab4cc', fontWeight:400, marginLeft:8 }}>PDF, JPG ou PNG · max 5 MB</span>
                        </label>
                        <div
                          className={dragOver ? 'cw-drop-active' : 'cw-drop'}
                          onClick={() => document.getElementById('carte-upload')?.click()}
                          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
                        >
                          {carteMedicale ? (
                            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                              <div style={s.fileIcon}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                              <div>
                                <p style={{ fontWeight:600, fontSize:'.9rem', color:'#1a1e2e' }}>{carteMedicale.name}</p>
                                <p style={{ fontSize:'.78rem', color:'#6b7a99' }}>{(carteMedicale.size/1024).toFixed(1)} KB · Prêt à envoyer</p>
                              </div>
                              <button type="button" onClick={e=>{e.stopPropagation();setCarteMedicale(null);}} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#e74d7f', fontSize:'.8rem', fontWeight:600 }}>✕ Retirer</button>
                            </div>
                          ) : (
                            <>
                              <div style={s.uploadIcon}><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#1a5fc8" strokeWidth="1.6" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                              <p style={{ fontWeight:600, color:'#1a1e2e', fontSize:'.95rem' }}>Glissez ou cliquez pour télécharger</p>
                              <p style={{ fontSize:'.82rem', color:'#6b7a99', marginTop:4 }}>Votre carte médicale professionnelle</p>
                            </>
                          )}
                          <input id="carte-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>handleFileChange(e.target.files?.[0]??null)} style={{ display:'none' }}/>
                        </div>
                      </div>
                      <div style={s.infoBanner}>
                        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#1a5fc8" strokeWidth="1.7" strokeLinecap="round" style={{ flexShrink:0 }}><circle cx="10" cy="10" r="8"/><line x1="10" y1="7" x2="10" y2="10"/><circle cx="10" cy="13" r=".5" fill="#1a5fc8"/></svg>
                        Votre compte sera activé après vérification par l'administrateur. Délai estimé : 24h.
                      </div>
                      {error && <ErrBox msg={error}/>}
                      <div style={{ display:'flex', gap:12, marginTop:4 }}>
                        <button type="button" className="cw-btn-ghost" onClick={() => { setError(''); setStep(1); }}>← Retour</button>
                        <button type="submit" className="cw-btn" disabled={isLoading} style={{ flex:1 }}>
                          {isLoading
                            ? <span style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation:'cw-spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                                Envoi en cours…
                              </span>
                            : 'Soumettre ma demande'}
                        </button>
                      </div>
                    </div>
                  )}

                </form>
              </div>

              

            </div>
          </div>
        </div>{/* end rightPanel */}

      </div>
    </div>
  );
}

/* ─── sub-components (original, untouched) ─── */
function Field({ label, icon, children }: { label:string; icon:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <label style={{ fontSize:'.83rem', fontWeight:600, color:'#4a556e', letterSpacing:'.2px' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center', zIndex:1, pointerEvents:'none' }}>
          {icon==='user'        && <IconUser/>}
          {icon==='stethoscope' && <IconSteth/>}
          {icon==='email'       && <IconMail/>}
        </span>
        {children}
      </div>
    </div>
  );
}
function PasswordStrength({ pwd }: { pwd:string }) {
  const score = [/.{8,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(pwd)).length;
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#15803d'];
  const labels = ['Très faible','Faible','Moyen','Fort','Très fort'];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', gap:4 }}>
        {[0,1,2,3].map(i=><div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<score?colors[score]:'rgba(200,220,255,0.5)', transition:'background .3s' }}/>)}
      </div>
      <span style={{ fontSize:'.74rem', color:colors[score], fontWeight:600 }}>{labels[score]}</span>
    </div>
  );
}
function EyeBtn({ show, toggle }: { show:boolean; toggle:()=>void }) {
  return (
    <button type="button" onClick={toggle} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8899bb', padding:4, display:'flex' }}>
      {show
        ? <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 10c-.46-2.54-2.88-5-7.94-5S2.52 7.46 2.06 10c.46 2.54 2.88 5 7.94 5s7.48-2.46 7.94-5z"/><circle cx="10" cy="10" r="3"/><line x1="3" y1="3" x2="17" y2="17"/></svg>
        : <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 10c-.46-2.54-2.88-5-7.94-5S2.52 7.46 2.06 10c.46 2.54 2.88 5 7.94 5s7.48-2.46 7.94-5z"/><circle cx="10" cy="10" r="3"/></svg>}
    </button>
  );
}
function ErrBox({ msg }: { msg:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fef2f2', border:'1px solid rgba(220,38,38,.2)', color:'#dc2626', borderRadius:10, padding:'11px 14px', fontSize:'.88rem' }}>
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink:0 }}><circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><circle cx="10" cy="14" r=".5" fill="#dc2626"/></svg>
      {msg}
    </div>
  );
}
const IconUser  = () => <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#8899bb" strokeWidth="1.6" strokeLinecap="round"><path d="M10 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0"/></svg>;
const IconSteth = () => <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#8899bb" strokeWidth="1.6" strokeLinecap="round"><path d="M5 3v7a5 5 0 0 0 10 0V3"/><circle cx="15" cy="15" r="2"/><path d="M15 13v-2"/></svg>;
const IconMail  = () => <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#8899bb" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 4l8 7 8-7"/></svg>;
const IconLock  = () => (
  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', display:'flex', alignItems:'center', zIndex:1, pointerEvents:'none' }}>
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#8899bb" strokeWidth="1.6" strokeLinecap="round"><rect x="4" y="8" width="12" height="10" rx="2"/><path d="M7 8V6a3 3 0 0 1 6 0v2"/></svg>
  </span>
);

/* ─── CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* original */
  @keyframes cw-blob   { from{transform:translate(0,0) scale(1)} to{transform:translate(24px,16px) scale(1.08)} }
  @keyframes cw-fadeup { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cw-spin   { to{transform:rotate(360deg)} }
  @keyframes cw-pulse  { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 7px rgba(34,197,94,.06)} }
  .cw-blob   { animation:cw-blob 14s ease-in-out infinite alternate; }
  .cw-fadeup { animation:cw-fadeup .65s ease both; }

  /* ── Organic blob animations ── */
  @keyframes ob1 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate(-30px, 20px) scale(1.08)} }
  @keyframes ob2 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate( 24px,-28px) scale(1.06)} }
  @keyframes ob3 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate(-20px, 30px) scale(1.10)} }
  @keyframes ob4 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate( 28px,-22px) scale(1.07)} }
  @keyframes ob5 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate(-24px, 18px) scale(1.05)} }
  @keyframes ob6 { 0%,100%{transform:translate(0,0)   scale(1)   } 50%{transform:translate( 18px, 26px) scale(1.09)} }

  .blob-org { position:absolute; border-radius:50%; filter:blur(52px); pointer-events:none; }
  .b1 { animation:ob1 11s ease-in-out infinite; }
  .b2 { animation:ob2  9s ease-in-out infinite; }
  .b3 { animation:ob3 13s ease-in-out infinite; }
  .b4 { animation:ob4 10s ease-in-out infinite; }
  .b5 { animation:ob5 14s ease-in-out infinite; }
  .b6 { animation:ob6  8s ease-in-out infinite; }

  /* original inputs */
  .cw-input {
    width:100%; padding:13px 16px;
    border:1.5px solid rgba(200,220,255,.7); border-radius:12px;
    font-size:.94rem; font-family:'DM Sans',sans-serif; color:#1a1e2e;
    background:#fff; outline:none; box-sizing:border-box;
    transition:border-color .2s,box-shadow .2s;
  }
  .cw-input:focus { border-color:#1a5fc8; box-shadow:0 0 0 4px rgba(26,95,200,.09); }
  .cw-input::placeholder { color:#b0bcd0; }

  .cw-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:8px;
    padding:14px 28px; background:#1a5fc8; color:white; border:none;
    border-radius:50px; font-size:.97rem; font-weight:600;
    font-family:'DM Sans',sans-serif; cursor:pointer;
    box-shadow:0 6px 20px rgba(26,95,200,.28);
    transition:background .2s,transform .15s,box-shadow .2s;
  }
  .cw-btn:hover:not(:disabled) { background:#1550b0; transform:translateY(-2px); box-shadow:0 10px 28px rgba(26,95,200,.36); }
  .cw-btn:disabled { opacity:.6; cursor:not-allowed; }

  .cw-btn-ghost {
    padding:14px 22px; background:transparent; color:#6b7a99;
    border:1.5px solid rgba(200,220,255,.7); border-radius:50px;
    font-size:.94rem; font-weight:500; font-family:'DM Sans',sans-serif;
    cursor:pointer; transition:border-color .2s,color .2s; white-space:nowrap;
  }
  .cw-btn-ghost:hover { border-color:#1a5fc8; color:#1a5fc8; }

  .cw-drop {
    border:2px dashed rgba(200,220,255,.8); border-radius:16px;
    padding:28px 24px; text-align:center; cursor:pointer;
    background:rgba(248,251,255,.8);
    transition:border-color .2s,background .2s;
    display:flex; flex-direction:column; align-items:center; gap:8px;
  }
  .cw-drop:hover { border-color:#1a5fc8; background:rgba(26,95,200,.04); }
  .cw-drop-active {
    border:2px dashed #1a5fc8; border-radius:16px; padding:28px 24px;
    text-align:center; cursor:pointer; background:rgba(26,95,200,.05);
    display:flex; flex-direction:column; align-items:center; gap:8px;
  }
`;

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {

  root: { minHeight:'100vh', fontFamily:"'DM Sans','Segoe UI',sans-serif", display:'flex' },

  splitWrap: { display:'grid', gridTemplateColumns:'1fr 1fr', width:'100%', minHeight:'100vh' },

  /* ════ LEFT ════ */
  leftPanel: {
    position:'relative', overflow:'hidden',
    /* Soft white-blue base — blobs float on top */
    background:'linear-gradient(155deg, #f0f7ff 0%, #e8f3ff 40%, #dbeafe 70%, #eff6ff 100%)',
    display:'flex', flexDirection:'column',
    alignItems:'flex-start', justifyContent:'space-between',
    padding:'44px 48px 40px',
  },

  /* Organic blobs — blue palette, varied sizes */
  bOrg1: { width:340, height:300, background:'rgba(198, 223, 255, 0.55)',  top:-80,  left:-60,  borderRadius:'62% 38% 55% 45% / 48% 52% 48% 52%' },
  bOrg2: { width:260, height:280, background:'rgba(198, 225, 255, 0.6)', top:80,   right:-50, borderRadius:'45% 55% 38% 62% / 55% 45% 55% 45%' },
  bOrg3: { width:220, height:240, background:'rgba(191,219,254,0.65)', top:'38%',left:'18%', borderRadius:'55% 45% 62% 38% / 42% 58% 42% 58%' },
  bOrg4: { width:300, height:260, background:'rgba(143, 186, 255, 0.3)',  bottom:60, right:20,  borderRadius:'38% 62% 45% 55% / 58% 42% 58% 42%' },
  bOrg5: { width:200, height:220, background:'rgba(224,242,254,0.80)', bottom:-40,left:-30,  borderRadius:'50% 50% 62% 38% / 45% 55% 45% 55%' },
  bOrg6: { width:160, height:160, background:'rgba(255, 255, 255, 0.7)', top:'55%', right:'15%',borderRadius:'62% 38% 50% 50% / 55% 45% 55% 45%' },

  leftLogo:     { display:'flex', alignItems:'center', gap:10, textDecoration:'none', zIndex:2, position:'relative' },
  leftLogoIcon: { width:36, height:36, background:'#1a5fc8', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(26,95,200,0.30)' },
  leftLogoText: { fontFamily:"'Outfit', sans-serif", fontSize:'1.3rem', fontWeight:700, color:'#1a1e2e' },

  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    marginTop:'-40px',
    gap: '22px',
    marginBottom:'50px'
  },
  leftBadge: {
    display:'inline-flex', alignItems:'center', gap:8,
    background:'rgba(26,95,200,0.09)', border:'1px solid rgba(26,95,200,0.20)',
    color:'#1a5fc8', fontSize:'.74rem', fontWeight:700,
    padding:'6px 14px', borderRadius:50, width:'fit-content',
    textTransform:'uppercase', letterSpacing:'.5px',
  },
  leftBadgeDot: { width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 0 3px rgba(34,197,94,0.20)', flexShrink:0 },

  leftTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '4.2rem',
    fontWeight: 700,
    lineHeight: 1.12,
    color: '#171a2b',
    textAlign: 'center',
    margin: 0
  },
  leftTitleAccent: { color:'#1a5fc8' },

  leftDesc: {
    fontSize: '1.1rem',
    color: '#0c1e47',
    lineHeight: 1.75,
    maxWidth: '780px',
    textAlign: 'center',
    margin: 0, 
    marginTop:'-40px',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    width: '100%',
    maxWidth: '650px',
    marginTop: '8px'

  
  },
  featurefeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 18px',
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.42)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 24px rgba(31, 64, 230, 0.08)',
    transition: 'all 0.25s ease',
    marginTop:'10px'

  },
  Item: { display:'flex', alignItems:'center', gap:12 },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 22px',
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.35)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.35)',
    boxShadow: '0 8px 24px rgba(31, 64, 230, 0.08)'
  },
  featureText: {
    fontSize: '1.08rem',
    fontWeight: 600,
    color: '#1f2940',
    letterSpacing: '-0.01em',
    lineHeight: 1.4
  },
  leftStats: {
    display:'flex', gap:0, zIndex:2, position:'relative',
    background:'rgba(255,255,255,0.60)', backdropFilter:'blur(16px)',
    border:'1px solid rgba(255,255,255,0.85)', borderRadius:18,
    padding:'16px 28px', boxShadow:'0 4px 24px rgba(26,95,200,0.08)',
    width:'100%', justifyContent:'space-around',
  },
  statItem:  { display:'flex', flexDirection:'column', alignItems:'center', gap:3 },
  statVal:   { fontFamily:"'Outfit', sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#1a1e2e' },
  statLabel: { fontSize:'.72rem', color:'#6b7a99', letterSpacing:'.3px' },

  /* ════ RIGHT (original) ════ */
  rightPanel: { position:'relative', background:'#ffffff', display:'flex', flexDirection:'column', overflow:'auto' },

  bg:   { position:'fixed', inset:0, zIndex:0, pointerEvents:'none' },
  blob: { position:'absolute', borderRadius:'50%', filter:'blur(85px)', opacity:.18 },

  pageWrap: { position:'relative', zIndex:1, minHeight:'100vh', display:'flex', flexDirection:'column', width:'100%' },

  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 56px', background:'rgba(167, 197, 219, 0)', backdropFilter:'blur(20px)', position:'sticky', top:0, zIndex:100 },
  logoWrap: { display:'flex', alignItems:'center', gap:10, textDecoration:'none' },
  logoIcon: { width:36, height:36, background:'#1a5fc8', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(26,95,200,0.25)' },
  logoText: { fontFamily:"'Outfit', sans-serif", fontSize:'1.4rem', fontWeight:700, color:'#1a5fc8' },
  navCta:   { background:'#1a5fc8', color:'white', padding:'9px 22px', borderRadius:50, textDecoration:'none', fontSize:'.87rem', fontWeight:600, boxShadow:'0 4px 12px rgba(26,95,200,0.22)' },

  formArea: { flex:1, display:'flex', flexDirection:'column', alignItems:'center',   padding:'20px 80px 20px', maxWidth:680, marginLeft:'auto', marginRight:'0', width:'100%', marginTop:'-20px'},

  badge:    { display:'inline-flex', alignItems:'center', gap:8, background:'rgba(26,95,200,0.07)', border:'1px solid rgba(26,95,200,0.18)', color:'#1a5fc8', fontSize:'.75rem', fontWeight:600, padding:'6px 16px', borderRadius:50, width:'fit-content', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:16 },
  badgeDot: { width:7, height:7, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 0 3px rgba(34,197,94,0.2)', animation:'cw-pulse 2s infinite', display:'inline-block', flexShrink:0 },

  pageTitle:    { fontFamily:"'Outfit', sans-serif", fontSize:'2.3rem', fontWeight:700, color:'#1a1e2e', marginBottom:10, lineHeight:1.2 },
  pageSubtitle: { fontSize:'1rem', color:'#6b7a99', lineHeight:1.7 },

  stepRow:    { display:'flex', alignItems:'center', gap:0, marginBottom:32, width:'100%', justifyContent:'center' },
  stepItem:   { display:'flex', alignItems:'center', gap:10 },
  stepCircle: { width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.88rem', fontWeight:700, transition:'background .3s,box-shadow .3s', flexShrink:0 },
  stepLine:   { width:80, height:2, background:'rgba(200,220,255,0.5)', margin:'0 10px' },

  card: { width:'100%', background:'#ffffff', borderRadius:28, padding:'40px 44px', border:'1.5px solid rgba(200,220,255,0.5)', boxShadow:'0 20px 60px rgba(26,95,200,0.08)' },
  sectionLabel: { display:'flex', alignItems:'center', gap:8, fontSize:'.8rem', fontWeight:700, color:'#1a5fc8', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 },
  row2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 },
  label: { fontSize:'.83rem', fontWeight:600, color:'#4a556e', letterSpacing:'.2px' },
  fileIcon:   { width:46, height:46, background:'rgba(26,95,200,0.08)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  uploadIcon: { width:56, height:56, background:'rgba(26,95,200,0.07)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 },
  infoBanner: { display:'flex', alignItems:'flex-start', gap:10, background:'rgba(26,95,200,0.06)', border:'1px solid rgba(26,95,200,0.15)', borderRadius:12, padding:'13px 16px', fontSize:'.86rem', color:'#1a5fc8', lineHeight:1.6 },

  successCard:  { background:'#fff', borderRadius:28, padding:'56px 48px', maxWidth:480, width:'100%', textAlign:'center', border:'1.5px solid rgba(200,220,255,0.5)', boxShadow:'0 24px 64px rgba(26,95,200,0.10)' },
  successIcon:  { width:72, height:72, background:'rgba(34,197,94,0.1)', border:'2px solid rgba(34,197,94,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' },
  successTitle: { fontFamily:"'Playfair Display',serif", fontSize:'1.9rem', fontWeight:700, color:'#1a1e2e', marginBottom:14 },
  successText:  { fontSize:'.97rem', color:'#6b7a99', lineHeight:1.75, marginBottom:22 },
  successInfo:  { display:'flex', alignItems:'center', gap:10, justifyContent:'center', background:'rgba(26,95,200,0.06)', border:'1px solid rgba(26,95,200,0.15)', borderRadius:12, padding:'12px 18px', marginBottom:28 },
  successBtn:   { display:'block', background:'#1a5fc8', color:'white', padding:'14px 36px', borderRadius:50, textDecoration:'none', fontWeight:600, fontSize:'.97rem', boxShadow:'0 6px 20px rgba(26,95,200,0.28)' },
};