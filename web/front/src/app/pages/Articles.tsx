import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  ChevronRight,
  Clock,
  User,
  ExternalLink,
  Sparkles,
  Heart,
  Activity,
  Brain,
  History,
  TrendingUp,
  Stethoscope,
} from 'lucide-react';
import API from '../../services/api';

interface Article {
  _id: string;
  titre: string;
  contenu: string;
  categorie: string;
  createdAt: string;
  image?: string;
  auteur?: string;
  lectureMinutes?: number;
}

const PRIMARY = '#4f46e5';
const PRIMARY_LIGHT = '#eef2ff';
const TEXT = '#1e293b';
const MUTED = '#64748b';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('/articles');
        // Filter out malformed records to prevent runtime crashes
        setArticles((res.data || []).filter((a: any) => a && a._id));
      } catch (error) {
        console.error('Erreur articles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = useMemo(() => {
    const cats = articles.map((a) => a.categorie).filter(Boolean);
    return ['Tous', ...Array.from(new Set(cats))];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        (a.titre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.contenu || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Tous' || a.categorie === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [articles, searchTerm, selectedCategory]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background: '#f8fafc',
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: TEXT,
        }}
      >
        <div
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.92)',
            borderRadius: 34,
            boxShadow: '0 40px 110px rgba(79,70,229,0.12)',
            padding: 28,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',

              background:
                'linear-gradient(135deg, #4f46e5 0%, #4338ca 45%, #3730a3 100%)',

              borderRadius: 30,

              padding: '38px 34px',

              minHeight: 220,

              color: 'white',

              marginBottom: 30,

              boxShadow:
                '0 28px 80px rgba(79,70,229,0.22)',
            }}
          >
            {/* BG EFFECTS */}
            <div
              style={{
                position: 'absolute',
                top: -110,
                right: -80,

                width: 320,
                height: 320,

                borderRadius: '50%',

                background:
                  'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 72%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: -70,
                left: -50,

                width: 220,
                height: 220,

                borderRadius: '50%',

                background:
                  'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 72%)',
              }}
            />

            {/* ILLUSTRATION */}
            <img
              src="/pageArticle.png"
              alt="Articles Illustration"

              style={{
                position: 'absolute',

                right: 80,

                top: '50%',

                transform: 'translateY(-50%)',

                width: 360, // ← AJUSTE ICI
                height: 'auto',

                objectFit: 'contain',

                pointerEvents: 'none',

                zIndex: 1,

                opacity: 0.98,

                filter:
                  'drop-shadow(0 30px 50px rgba(0,0,0,0.20))',
              }}
            />

            {/* CONTENT */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,

                maxWidth: 760,
              }}
            >
              <h1
                style={{
                  margin: 0,

                  fontSize: 46,

                  fontWeight: 950,

                  letterSpacing: '-1.5px',

                  lineHeight: 1.02,
                }}
              >
                Articles 
              </h1>

              <p
                style={{
                  margin: '18px 0 0',

                  maxWidth: 620,

                  color: 'rgba(255,255,255,0.82)',

                  fontSize: 16,

                  lineHeight: 1.8,

                  fontWeight: 500,
                }}
              >
                Découvrez les dernières avancées en cardiologie,
                les guides de lecture ECG et l'utilisation clinique de l'IA.
              </p>
            </div>
          </div>

          {/* FILTERS & SEARCH */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 58,
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #f1f5f9',
                boxShadow: '0 12px 30px rgba(79,70,229,0.04)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                gap: 14,
              }}
            >
              <Search size={20} color={PRIMARY} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un article, un guide..."
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  color: TEXT,
                  fontSize: 14,
                  fontWeight: 650,
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                padding: 6,
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #f1f5f9',
                boxShadow: '0 12px 30px rgba(79,70,229,0.04)',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 14,
                    border: 'none',
                    background: selectedCategory === cat ? PRIMARY : 'transparent',
                    color: selectedCategory === cat ? 'white' : MUTED,
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: '0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ARTICLES GRID */}
          {loading ? (
            <div
              style={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: PRIMARY,
                fontWeight: 900,
              }}
            >
              <Activity className="animate-spin mr-2" />
              Chargement de la bibliothèque...
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 26,
                padding: 60,
                textAlign: 'center',
                boxShadow: '0 16px 42px rgba(79,70,229,0.07)',
              }}
            >
              <BookOpen size={48} color={PRIMARY} style={{ margin: '0 auto 16px' }} />
              <h2 style={{ fontSize: 20, fontWeight: 950, color: TEXT }}>Aucun article trouvé</h2>
              <p style={{ color: MUTED, fontWeight: 600, marginTop: 8 }}>
                Essayez d'autres mots clés ou une autre catégorie.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: 26,
              }}
            >
              {filtered.map((a) => (
                <div
                  key={a._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 26,
                    overflow: 'hidden',
                    boxShadow: '0 16px 42px rgba(79,70,229,0.06)',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      height: 200,
                      background: `linear-gradient(135deg, ${PRIMARY_LIGHT} 0%, #f1f5f9 100%)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.titre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Activity size={40} color={PRIMARY} style={{ opacity: 0.3 }} />
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                      }}
                    >
                      <Badge
                        style={{
                          background: 'rgba(255,255,255,0.95)',
                          color: PRIMARY,
                          border: 'none',
                          borderRadius: 10,
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '6px 12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        }}
                      >
                        {(a.categorie || '').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12,
                        color: MUTED,
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={14} />
                        {a.lectureMinutes || 5} MIN
                      </span>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <History size={14} />
                        {formatDate(a.createdAt)}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: 18,
                        fontWeight: 950,
                        color: TEXT,
                        lineHeight: 1.4,
                        marginBottom: 12,
                      }}
                    >
                      {a.titre}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: '#475569',
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: 20,
                      }}
                    >
                      {a.contenu}
                    </p>

                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: 20,
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: PRIMARY_LIGHT,
                            color: PRIMARY,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 950,
                          }}
                        >
                          {(a.auteur || 'CardioWave').charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 750, color: TEXT }}>
                          {a.auteur || 'CardioWave'}
                        </span>
                      </div>

                      <button
                        style={{
                          border: 'none',
                          background: 'none',
                          color: PRIMARY,
                          fontSize: 13,
                          fontWeight: 950,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'pointer',
                        }}
                      >
                        Lire plus
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}