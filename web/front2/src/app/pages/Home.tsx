// src/app/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';


/* ─── scroll-reveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('revealed'); } }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── solution cards data ─── */
const CARDS = [
  {  title: 'Surveillance ECG en temps réel', desc: 'Acquisition et visualisation instantanée du signal ECG avec détection automatique des anomalies.' },
  { title: 'Analyse par intelligence artificielle', desc: 'Modèles IA entraînés sur des millions d\'ECG pour une classification précise et rapide.' },
  {title: 'Analyse morphologique', desc: 'Étude détaillée des ondes P, QRS et T pour un diagnostic morphologique complet.' },
  {  title: 'Analyse rythmique', desc: 'Détection automatique de la fibrillation auriculaire, tachycardie, bradycardie et plus.' },
  {  title: 'Dashboard médecin intuitif', desc: 'Interface claire et ergonomique permettant au médecin de gérer ses patients et résultats.' },
  { title: 'Alertes intelligentes', desc: 'Notifications prioritaires en cas d\'anomalie critique pour une réaction médicale immédiate.' },
];

/* ─── for-who blocks ─── */
const FOR_WHO = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1a5fc8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        <path d="M21 21v-2a4 4 0 0 0-3-3.87"/>
      </svg>
    ),
    label: 'Médecins',
    link: '/inscription',
    color: '#1a5fc8',
    bg: 'rgba(26,95,200,0.07)',
    border: 'rgba(26,95,200,0.15)',
    desc: 'Accédez à une analyse rapide et fiable de chaque ECG. Notre IA vous apporte une aide au diagnostic pour réduire votre charge cognitive et améliorer la qualité de soins.',
    tags: ['Aide au diagnostic', 'Gain de temps', 'Précision'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#4d6edb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    label: 'Patients',
    link: '/inscription-patient',   
    
    color: '#1a5fc8',
    bg: 'rgba(26,95,200,0.07)',
    border: 'rgba(26,95,200,0.15)',
    desc: 'Suivez votre santé cardiaque de façon simple et visuelle. Recevez des rapports clairs et des alertes personnalisées pour rester informé en toute tranquillité.',
    tags: ['Suivi personnel', 'Alertes', 'Rapports clairs'],
  },
];

export default function Home() {
  const navigate = useNavigate();
  useReveal();

  return (
    <div style={styles.root}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        html { scroll-behavior: smooth; }

        /* ── keyframes ── */
        @keyframes heartbeat {
          0%,100% { transform:scale(1);    filter:drop-shadow(0 8px 24px rgba(92, 81, 197, 0.3)); }
          10%     { transform:scale(1.28); filter:drop-shadow(0 14px 40px rgba(59, 71, 175, 0.58)); }
          20%     { transform:scale(1.05); filter:drop-shadow(0 8px 24px rgba(97, 77, 231, 0.3)); }
          35%     { transform:scale(1.18); filter:drop-shadow(0 10px 32px rgba(120, 128, 211, 0.46)); }
          55%     { transform:scale(1);    filter:drop-shadow(0 8px 24px rgba(43, 97, 158, 0.3)); }
        }
        @keyframes expandRing {
          0%   { transform:scale(.65); opacity:.65; }
          100% { transform:scale(1.22); opacity:0; }
        }
        @keyframes drawECG {
          0%   { stroke-dashoffset:600; opacity:1; }
          65%  { stroke-dashoffset:0;   opacity:1; }
          100% { stroke-dashoffset:0;   opacity:0; }
        }
        @keyframes pulseDot {
          0%,100% { box-shadow:0 0 0 3px rgba(34,197,94,.2); }
          50%     { box-shadow:0 0 0 7px rgba(34,197,94,.07); }
        }
        @keyframes blobDrift {
          from { transform:translate(0,0) scale(1); }
          to   { transform:translate(28px,18px) scale(1.09); }
        }
        @keyframes blueGlow {
          0%,100% { opacity:.38; transform:scale(1); }
          50%     { opacity:.56; transform:scale(1.08); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }

        /* ── animation classes ── */
        .heart-beat  { animation:heartbeat 1.5s ease-in-out infinite; }
        .ring-1 { animation:expandRing 2.8s ease-out infinite 0s; }
        .ring-2 { animation:expandRing 2.8s ease-out infinite .95s; }
        .ring-3 { animation:expandRing 2.8s ease-out infinite 1.9s; }
        .ecg-line {
          stroke:rgba(26,95,200,.5); stroke-width:2; fill:none;
          stroke-dasharray:600; animation:drawECG 3.2s linear infinite;
        }
        .badge-dot {
          width:7px;height:7px;border-radius:50%;background:#22c55e;
          box-shadow:0 0 0 3px rgba(34,197,94,.2);
          animation:pulseDot 2s infinite;flex-shrink:0;display:inline-block;
        }
        .blob-bg  { animation:blobDrift 14s ease-in-out infinite alternate; }
        .blue-glow-br { animation:blueGlow 4s ease-in-out infinite; }

        /* ── scroll reveal ── */
        .reveal { opacity:0; transform:translateY(28px); transition:opacity .65s ease, transform .65s ease; }
        .reveal.revealed { opacity:1; transform:translateY(0); }
        .reveal-delay-1 { transition-delay:.1s; }
        .reveal-delay-2 { transition-delay:.2s; }
        .reveal-delay-3 { transition-delay:.3s; }
        .reveal-delay-4 { transition-delay:.4s; }
        .reveal-delay-5 { transition-delay:.5s; }

        /* ── solution card hover ── */
        .sol-card {
          background:#fff; border:1px solid rgba(200,220,255,.5);
          border-radius:20px; padding:32px 28px; cursor:default;
          box-shadow:0 4px 18px rgba(26,95,200,.06);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .sol-card:hover {
          transform:translateY(-6px);
          box-shadow:0 14px 40px rgba(26,95,200,.13);
          border-color:rgba(26,95,200,.25);
        }

        /* ── for-who card hover ── */
        .who-card {
          border-radius:24px; padding:40px 32px;
          transition:transform .25s ease, box-shadow .25s ease;
        }
        .who-card:hover { transform:translateY(-5px); box-shadow:0 16px 44px rgba(26,95,200,.10); }

        /* ── contact form inputs ── */
        .cw-input {
          width:100%; padding:14px 18px;
          border:1.5px solid rgba(200,220,255,.7);
          border-radius:12px; font-size:.95rem;
          font-family:'DM Sans',sans-serif; color:#1a1e2e;
          background:#fff; outline:none;
          transition:border-color .2s, box-shadow .2s;
        }
        .cw-input:focus {
          border-color:#1a5fc8;
          box-shadow:0 0 0 4px rgba(26,95,200,.10);
        }
        .cw-input::placeholder { color:#aab4cc; }

        /* ── section divider ── */
        .section-divider {
          width:60px; height:4px; border-radius:2px;
          background:linear-gradient(90deg,#1a5fc8,#93c5fd);
          margin:0 auto 20px;
        }

        /* ── tag pill ── */
        .tag-pill {
          display:inline-block; padding:4px 12px;
          border-radius:50px; font-size:.74rem; font-weight:600;
          background:rgba(26,95,200,.08); color:#1a5fc8;
          border:1px solid rgba(26,95,200,.15);
        }
      `}</style>

      {/* ── BACKGROUND ── */}
      <div style={styles.bgCanvas}>
        <div className="blob-bg" style={{ ...styles.blob, ...styles.blob1 }} />
        <div className="blob-bg" style={{ ...styles.blob, ...styles.blob2, animationDelay:'4s' }} />
        <div className="blob-bg" style={{ ...styles.blob, ...styles.blob3, animationDelay:'8s' }} />
      </div>

      {/* ════════════════════════════════════
          NAVBAR
      ════════════════════════════════════ */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          CardioWave
        </div>
        <div style={styles.navLinks}>
          <a href="#hero"      style={styles.navLink}>Accueil</a>
          <a href="#solution"  style={styles.navLink}>Fonctionnalités</a>
          <a href="#pourqui"   style={styles.navLink}>Pour qui ?</a>
          <a href="#apropos"   style={styles.navLink}>À propos</a>
          <a href="#contact"   style={styles.navLink}>Contact</a>
          <button onClick={() => navigate('/connexion')} style={styles.navCta}>Connectez</button>
        </div>
      </nav>

      {/* ════════════════════════════════════
          HERO
      ════════════════════════════════════ */}
      <main id="hero" style={styles.hero}>
        <div style={styles.heroLeft}>
          <span style={styles.badge}>
            <span className="badge-dot" />
            Technologie Cardiaque
          </span>
          <h1 style={styles.title}>
            Rapide, Efficace<br />
            et <span style={{ color:'#1a5fc8' }}>Productif</span><br />
            pour votre cœur
          </h1>
          <p style={styles.subtitle}>
            CardioWave surveille votre rythme cardiaque en temps réel avec une précision médicale.
            Prenez soin de vous avec une technologie pensée pour votre santé.
          </p>
          <div style={styles.actions}>
            <button
            onClick={() => document.getElementById('pourqui')?.scrollIntoView({ behavior: 'smooth' })}
            style={styles.btnPrimary}
                      >
              Commencer gratuitement
            </button>
            <button onClick={() => navigate('/connexion')} style={styles.btnGhost}>
              <span style={styles.playIcon}>
                <svg viewBox="0 0 12 14" width="13" height="13" fill="#1a5fc8" style={{ marginLeft:2 }}>
                  <path d="M1 1l10 6-10 6V1z"/>
                </svg>
              </span>
              Voir la démo
            </button>
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}><span style={styles.statVal}>98%</span><span style={styles.statLabel}>Précision</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statVal}>50k+</span><span style={styles.statLabel}>Utilisateurs</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statVal}>24/7</span><span style={styles.statLabel}>Monitoring</span></div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.heartScene}>
            <div className="blue-glow-br" style={styles.blueGlowBR} />
            <div style={styles.videoLabel}><span style={styles.liveDot} />Cardio Live</div>
            <div style={styles.ringsWrap}>
              <div className="ring-1" style={{ ...styles.ring, width:170, height:170 }} />
              <div className="ring-2" style={{ ...styles.ring, width:255, height:255 }} />
              <div className="ring-3" style={{ ...styles.ring, width:345, height:345 }} />
            </div>
            <div className="heart-beat" style={{ zIndex:2 }}>
              <svg width="170" height="157" viewBox="0 0 100 92">
                <defs>
                  <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#242293"/>
                    <stop offset="100%" stopColor="#2f5d87"/>
                  </linearGradient>
                  <radialGradient id="hshine" cx="38%" cy="30%" r="52%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.38)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                  </radialGradient>
                </defs>
                <path d="M50 85 C50 85 5 52 5 28 C5 14 16 5 28 5 C36 5 44 9 50 16 C56 9 64 5 72 5 C84 5 95 14 95 28 C95 52 50 85 50 85Z" fill="url(#hg)"/>
                <path d="M50 85 C50 85 5 52 5 28 C5 14 16 5 28 5 C36 5 44 9 50 16 C56 9 64 5 72 5 C84 5 95 14 95 28 C95 52 50 85 50 85Z" fill="url(#hshine)"/>
              </svg>
            </div>
            <div style={styles.ecgOverlay}>
              <svg viewBox="0 0 400 44" style={{ width:'100%', height:44, overflow:'visible' }}>
                <path className="ecg-line" d="M0,22 L60,22 L75,6 L85,38 L95,6 L108,38 L118,22 L170,22 L185,6 L195,38 L205,6 L218,38 L228,22 L280,22 L295,6 L305,38 L315,6 L328,38 L338,22 L400,22"/>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════
          SECTION 1 — SOLUTION
      ════════════════════════════════════ */}
      <section id="solution" style={styles.section}>
        <div style={styles.sectionInner}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <div className="section-divider" />
            <h2 style={styles.sectionTitle}>Une solution complète pour<br/>l'analyse cardiaque</h2>
            <p style={styles.sectionSubtitle}>
              Chaque fonctionnalité est pensée pour répondre aux exigences du diagnostic médical moderne.
            </p>
          </div>

          <div style={styles.cardsGrid}>
            {CARDS.map((c, i) => (
              <div key={i} className={`sol-card reveal reveal-delay-${i % 3 + 1}`}>
                <h3 style={styles.cardTitle}>{c.title}</h3>
                <p style={styles.cardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 2 — POUR QUI
      ════════════════════════════════════ */}
      <section id="pourqui" style={{ ...styles.section, background:'linear-gradient(180deg,#f8fbff 0%,#ffffff 100%)' }}>
        <div style={styles.sectionInner}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:56 }}>
            <div className="section-divider" />
            <h2 style={styles.sectionTitle}>Une plateforme adaptée<br/>à chaque utilisateur</h2>
            <p style={styles.sectionSubtitle}>
              Que vous soyez médecin, patient ou responsable clinique, CardioWave s'adapte à vos besoins.
            </p>
          </div>

          <div style={styles.whoGrid}>
            {FOR_WHO.map((w, i) => (
        <div
          key={i}
          className={`who-card reveal reveal-delay-${i + 1}`}
          style={{ background: w.bg, border:`1.5px solid ${w.border}`, boxShadow:`0 4px 20px ${w.border}` }}
        >
          <div style={{ ...styles.whoIconWrap, background:`${w.bg}`, border:`1.5px solid ${w.border}` }}>
            {w.icon}
          </div>
          <h3 style={{ ...styles.whoLabel, color: w.color }}>{w.label}</h3>
          <p style={styles.whoDesc}>{w.desc}</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:20 }}>
            {w.tags.map((t, ti) => (
              <span key={ti} className="tag-pill" style={{ color: w.color, background:`${w.bg}`, borderColor: w.border }}>
                {t}
              </span>
            ))}
          </div>
          {/* ← NOUVEAU : bouton en bas à droite */}
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:24 }}>
            <button
              onClick={() => navigate(w.link)}
              style={{
                background: w.color, color: 'white', border: 'none',
                padding: '10px 22px', borderRadius: 50, fontSize: '.85rem',
                fontWeight: 600, cursor: 'pointer',
                boxShadow: `0 4px 14px ${w.border}`,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              Commencer →
            </button>
          </div>
        </div>
      ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 3 — À PROPOS
      ════════════════════════════════════ */}
      <section id="apropos" style={styles.section}>
        <div style={styles.sectionInner}>
          <div style={styles.aboutGrid}>

            {/* Text */}
            <div className="reveal" style={{ display:'flex', flexDirection:'column', gap:24, justifyContent:'center' }}>
              <div>
                <div style={{ ...styles.sectionDividerLeft }} />
                <h2 style={{ ...styles.sectionTitle, textAlign:'left', marginBottom:16 }}>
                  À propos de CardioWave
                </h2>
              </div>
              <p style={styles.aboutText}>
                CardioWave est une plateforme de cardiologie alimentée par l'intelligence artificielle, conçue pour améliorer l'analyse ECG et le suivi des patients. Elle combine précision médicale et innovation technologique pour transformer le diagnostic cardiaque.
              </p>
              <p style={styles.aboutText}>
                Développée dans le cadre d'un projet de recherche en médecine et IA, CardioWave s'appuie sur des algorithmes de deep learning entraînés sur de larges bases de données cliniques validées.
              </p>
              <div style={styles.missionBox}>
                <div>
                  <div style={styles.missionLabel}>Notre mission</div>
                  <p style={styles.missionText}>
                    Rendre le diagnostic cardiaque plus rapide, plus accessible et plus fiable pour chaque patient, partout dans le monde.
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {['IA médicale', 'Recherche clinique', 'Open innovation', 'Précision 98%'].map((tag, i) => (
                  <span key={i} className="tag-pill">{tag}</span>
                ))}
              </div>
            </div>

            {/* Illustration */}
            <div className="reveal reveal-delay-2" style={styles.aboutVisual}>
              {/* Abstract ECG card */}
              <div style={styles.aboutCard}>
                <div style={styles.aboutCardHeader}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e' }} />
                    <span style={{ fontSize:'.8rem', fontWeight:600, color:'#1a5fc8' }}>Analyse en cours</span>
                  </div>
                  <span style={{ fontSize:'.75rem', color:'#aab4cc' }}>Patient #3821</span>
                </div>
                <svg viewBox="0 0 320 80" style={{ width:'100%', margin:'16px 0' }}>
                  <polyline
                    points="0,40 30,40 42,12 52,68 62,12 74,68 86,40 120,40 132,12 142,68 152,12 164,68 176,40 210,40 222,12 232,68 242,12 254,68 266,40 320,40"
                    fill="none" stroke="#1a5fc8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                  />
                </svg>
                <div style={styles.aboutCardStats}>
                  {[['BPM','72'],['QRS','98ms'],['QTc','420ms'],['RR','830ms']].map(([l,v]) => (
                    <div key={l} style={styles.aboutStat}>
                      <span style={styles.aboutStatVal}>{v}</span>
                      <span style={styles.aboutStatLabel}>{l}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.aiTag}>
                  <span style={{ fontSize:'1rem' }}>🤖</span>
                  <span style={{ fontSize:'.8rem', fontWeight:600, color:'#15803d' }}>Rythme sinusal normal — Aucune anomalie détectée</span>
                </div>
              </div>

              {/* Floating badges */}
              <div style={{ ...styles.floatBadge, top:0, right:-16 }}>
                <span>98%</span><span style={{ fontSize:'.72rem', color:'#6b7a99' }}>Précision IA</span>
              </div>
              <div style={{ ...styles.floatBadge, bottom:24, left:-20 }}>
                <span>24/7</span><span style={{ fontSize:'.72rem', color:'#6b7a99' }}>Monitoring</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          SECTION 4 — CONTACT
      ════════════════════════════════════ */}
      <section id="contact" style={{ ...styles.section, background:'linear-gradient(180deg,#f8fbff 0%,#eef5ff 100%)' }}>
        <div style={styles.sectionInner}>
          <div className="reveal" style={{ textAlign:'center', marginBottom:48 }}>
            <div className="section-divider" />
            <h2 style={styles.sectionTitle}>Contactez-nous</h2>
            <p style={styles.sectionSubtitle}>
              Une question, un partenariat ou une démonstration ? Notre équipe vous répond sous 24h.
            </p>
          </div>

          <div className="reveal reveal-delay-1" style={styles.contactWrap}>
            <form
              style={styles.contactForm}
              onSubmit={e => e.preventDefault()}
            >
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nom complet</label>
                  <input className="cw-input" type="text" placeholder="Dr. Jean Dupont" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Adresse email</label>
                  <input className="cw-input" type="email" placeholder="jean.dupont@hopital.fr" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  className="cw-input"
                  rows={5}
                  placeholder="Décrivez votre besoin ou votre question..."
                  style={{ resize:'vertical', lineHeight:1.6 }}
                />
              </div>
              <button type="submit" style={styles.submitBtn}>
                Envoyer le message
                <svg viewBox="0 0 20 20" width="18" height="18" fill="white" style={{ marginLeft:8 }}>
                  <path d="M2.94 3.06a.5.5 0 0 1 .63-.06l14 8a.5.5 0 0 1 0 .87l-14 8A.5.5 0 0 1 3 19.5l2.5-9.5-2.5-9.5a.5.5 0 0 1 .44-.44z"/>
                </svg>
              </button>

              <p style={styles.contactEmail}>
                Ou écrivez-nous directement à{' '}
                <a href="mailto:contact@cardiowave.io" style={{ color:'#1a5fc8', fontWeight:600 }}>
                  contact@cardiowave.io
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FOOTER
      ════════════════════════════════════ */}
      <footer style={styles.footer}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ ...styles.logoIcon, width:28, height:28 }}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span style={{ ...styles.footerText, fontWeight:600, color:'#1a5fc8' }}>CardioWave</span>
        </div>
        <div style={{ display:'flex', gap:28 }}>
          <a href="#solution" style={styles.footerLink}>Fonctionnalités</a>
          <a href="#pourqui"  style={styles.footerLink}>Pour qui ?</a>
          <a href="#apropos"  style={styles.footerLink}>À propos</a>
          <a href="#contact"  style={styles.footerLink}>Contact</a>
        </div>
        <span style={styles.footerText}>© 2026 CardioWave — Tous droits réservés</span>
      </footer>

    </div>
  );
}

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const styles: Record<string, React.CSSProperties> = {

  root: {
    position:'relative', minHeight:'100vh',
    display:'flex', flexDirection:'column',
    fontFamily:"'DM Sans','Segoe UI',sans-serif",
    background:'#ffffff',
  },

  bgCanvas: { position:'fixed', inset:0, zIndex:0, background:'#ffffff', pointerEvents:'none' },
  blob: { position:'absolute', borderRadius:'50%', filter:'blur(90px)', opacity:0.20 },
  blob1: { width:520, height:520, background:'#93c5fd', top:-130, left:-110 },
  blob2: { width:400, height:400, background:'#bfdbfe', top:'30%', right:-90 },
  blob3: { width:320, height:320, background:'#dbeafe', bottom:-90, left:'32%' },

  /* Navbar */
  nav: {
    position:'sticky', top:0, zIndex:100,
    display:'flex', alignItems:'center', justifyContent:'space-between',
    padding:'18px 56px',
    background:'rgba(255, 255, 255, 0)', backdropFilter:'blur(20px)',
    borderBottom:'1px solid rgba(200,220,255,0.35)',
    boxShadow:'0 1px 24px rgba(26,95,200,0.05)',
  },
  logo: {
    display:'flex', alignItems:'center', gap:10,
    fontFamily:"'Outfit', sans-serif",
    fontSize:'1.45rem', fontWeight:700, color:'#1a5fc8',
  },
  logoIcon: {
    width:36, height:36, background:'#1a5fc8', borderRadius:10,
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  navLinks: { display:'flex', alignItems:'center', gap:28 },
  navLink: { textDecoration:'none', color:'#6b7a99', fontSize:'0.88rem', fontWeight:500 },
  navCta: {
    background:'#1a5fc8', color:'white', padding:'10px 24px',
    borderRadius:50, border:'none', cursor:'pointer',
    fontSize:'0.88rem', fontWeight:600,
    boxShadow:'0 4px 14px rgba(26,95,200,0.22)',
  },

  /* Hero */
  hero: {
    position:'relative', zIndex:1, flex:1,
    display:'grid', gridTemplateColumns:'1fr 1fr',
    alignItems:'center', gap:48,
    padding:'70px 56px 90px',
    maxWidth:1280, margin:'0 auto', width:'100%',
  },
  heroLeft: { display:'flex', flexDirection:'column', gap:28 },
  badge: {
    display:'inline-flex', alignItems:'center', gap:8,
    background:'rgba(26,95,200,0.07)', border:'1px solid rgba(26,95,200,0.18)',
    color:'#1a5fc8', fontSize:'0.76rem', fontWeight:600,
    padding:'6px 16px', borderRadius:50, width:'fit-content',
    textTransform:'uppercase', letterSpacing:'0.5px',
  },
  title: { 
    fontFamily: "Georgia",
    fontSize: '3.2rem',
    fontWeight: 700,
    lineHeight: 1.18,
    color: '#1a1e2e',
    },
  subtitle: { fontSize:'1.05rem', color:'#6b7a99', lineHeight:1.75, maxWidth:440, fontWeight:400 },
  actions: { display:'flex', alignItems:'center', gap:18 },
  btnPrimary: {
    background:'#1a5fc8', color:'white', padding:'14px 34px',
    borderRadius:50, border:'none', cursor:'pointer',
    fontSize:'0.95rem', fontWeight:600,
    boxShadow:'0 6px 20px rgba(26,95,200,0.28)',
  },
  btnGhost: {
    display:'flex', alignItems:'center', gap:10,
    background:'none', border:'none', cursor:'pointer',
    fontSize:'0.92rem', fontWeight:500, color:'#1a1e2e',
  },
  playIcon: {
    width:42, height:42, background:'white', borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    boxShadow:'0 4px 16px rgba(26,95,200,0.12)',
    border:'1px solid rgba(200,220,255,0.6)',
  },
  statsRow: { display:'flex', alignItems:'center', gap:32, paddingTop:8 },
  stat: { display:'flex', flexDirection:'column', gap:2 },
  statVal: { fontFamily:"'Outfit', sans-serif", fontSize:'1.65rem', fontWeight:700, color:'#1a1e2e' },
  statLabel: { fontSize:'0.78rem', color:'#6b7a99' },
  statDivider: { width:1, height:42, background:'rgba(200,220,255,0.5)' },
  heroRight: { display:'flex', justifyContent:'center', alignItems:'center' },
  heartScene: { position:'relative', width:520, height:440, display:'flex', alignItems:'center', justifyContent:'center' },
  blueGlowBR: {
    position:'absolute', bottom:-20, right:10, width:240, height:240,
    borderRadius:'50%',
    background:'radial-gradient(circle,rgba(59,130,246,0.42) 0%,rgba(147,197,253,0.20) 50%,transparent 78%)',
    filter:'blur(30px)', zIndex:0, pointerEvents:'none',
  },
  videoLabel: {
    position:'absolute', top:16, left:16,
    background:'rgba(255,255,255,0.92)', border:'1px solid rgba(200,225,255,0.8)',
    borderRadius:50, padding:'6px 14px', fontSize:'0.76rem', fontWeight:600, color:'#1a5fc8',
    display:'flex', alignItems:'center', gap:6, zIndex:10,
    boxShadow:'0 2px 10px rgba(26,95,200,0.08)',
  },
  liveDot: { width:6, height:6, borderRadius:'50%', background:'#4e6a9f67' },
  ringsWrap: { position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1 },
  ring: { position:'absolute', borderRadius:'50%', border:'1.5px solid rgba(52, 72, 163, 0.22)' },
  ecgOverlay: { position:'absolute', bottom:20, left:10, right:10, zIndex:10 },

  /* Sections */
  section: {
    position:'relative', zIndex:1,
    padding:'96px 56px',
    background:'#ffffff',
  },
  sectionInner: { maxWidth:1200, margin:'0 auto', width:'100%' },
  sectionTitle: {
    fontFamily:"'Outfit', sans-serif",
    fontSize:'2.4rem', fontWeight:700, color:'#1a1e2e',
    lineHeight:1.22, marginBottom:16,
  },
  sectionSubtitle: { fontSize:'1.05rem', color:'#6b7a99', lineHeight:1.7, maxWidth:560, margin:'0 auto' },
  sectionDividerLeft: { width:48, height:4, borderRadius:2, background:'linear-gradient(90deg,#1a5fc8,#93c5fd)', marginBottom:16 },

  /* Solution cards */
  cardsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 },
  cardIcon: { fontSize:'2rem', marginBottom:16 },
  cardTitle: { fontSize:'1.05rem', fontWeight:700, color:'#4056ab', marginBottom:10 },
  cardDesc: { fontSize:'0.9rem', color:'#6b7a99', lineHeight:1.65 },

  /* For who */
  whoGrid: {
    display:'flex',
    gap:28,
    justifyContent:'center',
  },
  whoIconWrap: { width:68, height:68, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 },
  whoLabel: { fontSize:'1.3rem', fontWeight:700, marginBottom:12 },
  whoDesc: { fontSize:'0.93rem', color:'#6b7a99', lineHeight:1.7 },

  /* About */
  aboutGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' },
  aboutText: { fontSize:'1rem', color:'#4a556e', lineHeight:1.78 },
  missionBox: {
    display:'flex', gap:16, alignItems:'flex-start',
    background:'rgba(26,95,200,0.05)', border:'1px solid rgba(26,95,200,0.12)',
    borderRadius:16, padding:'20px 22px',
  },
  missionIcon: { fontSize:'1.4rem', flexShrink:0, marginTop:2 },
  missionLabel: { fontSize:'0.78rem', fontWeight:700, color:'#1a5fc8', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 },
  missionText: { fontSize:'0.93rem', color:'#4a556e', lineHeight:1.65 },
  aboutVisual: { position:'relative', display:'flex', alignItems:'center', justifyContent:'center' },
  aboutCard: {
    background:'#ffffff', borderRadius:24, padding:'28px 28px 20px',
    border:'1.5px solid rgba(200,220,255,0.6)',
    boxShadow:'0 20px 60px rgba(26,95,200,0.10)',
    width:'100%', maxWidth:460,
  },
  aboutCardHeader: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  aboutCardStats: { display:'flex', justifyContent:'space-between', padding:'16px 0 8px' },
  aboutStat: { display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  aboutStatVal: { fontFamily:"'Playfair Display',serif", fontSize:'1.3rem', fontWeight:700, color:'#1a1e2e' },
  aboutStatLabel: { fontSize:'0.72rem', color:'#6b7a99', textTransform:'uppercase', letterSpacing:'0.4px' },
  aiTag: {
    display:'flex', alignItems:'center', gap:8, marginTop:10,
    background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)',
    borderRadius:50, padding:'8px 14px',
  },
  floatBadge: {
    position:'absolute',
    display:'flex', flexDirection:'column', alignItems:'center', gap:2,
    background:'white', borderRadius:14, padding:'10px 16px',
    boxShadow:'0 8px 28px rgba(26,95,200,0.12)',
    border:'1px solid rgba(200,220,255,0.5)',
    fontFamily:"'Playfair Display',serif",
    fontSize:'1.2rem', fontWeight:700, color:'#1a1e2e',
  },

  /* Contact */
  contactWrap: { display:'flex', justifyContent:'center' },
  contactForm: {
    width:'100%', maxWidth:680,
    background:'#ffffff', borderRadius:28, padding:'48px 48px 40px',
    border:'1.5px solid rgba(200,220,255,0.5)',
    boxShadow:'0 16px 50px rgba(26,95,200,0.08)',
    display:'flex', flexDirection:'column', gap:22,
  },
  formRow: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 },
  formGroup: { display:'flex', flexDirection:'column', gap:8 },
  label: { fontSize:'0.83rem', fontWeight:600, color:'#4a556e', letterSpacing:'0.2px' },
  submitBtn: {
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'#1a5fc8', color:'white', border:'none',
    padding:'15px 36px', borderRadius:50, cursor:'pointer',
    fontSize:'1rem', fontWeight:600, alignSelf:'center',
    boxShadow:'0 6px 20px rgba(26,95,200,0.3)',
    marginTop:4,
  },
  contactEmail: { textAlign:'center', fontSize:'0.87rem', color:'#6b7a99', marginTop:4 },

  /* Footer */
  footer: {
    position:'relative', zIndex:1,
    background:'rgba(255,255,255,0.98)',
    borderTop:'1px solid rgba(200,220,255,0.35)',
    padding:'22px 56px',
    display:'flex', alignItems:'center', justifyContent:'space-between',
  },
  footerText: { fontSize:'0.83rem', color:'#6b7a99' },
  footerLink: { textDecoration:'none', color:'#6b7a99', fontSize:'0.83rem' },
};