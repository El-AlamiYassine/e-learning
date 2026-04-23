import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherStats } from '../../api/teacherApi';

export default function TeacherDashboardOverview() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0,
    activeCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getTeacherStats();
        setStats(res.data);
      } catch (err) {
        console.error('Erreur stats teacher', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="td-loading">
        <div className="td-loader" />
        <span>Chargement des statistiques…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
          .td-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .td-loader { width:34px; height:34px; border:3px solid #fde68a; border-top-color:#f59e0b; border-radius:50%; animation:td-spin .8s linear infinite; }
          @keyframes td-spin { to { transform:rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Mes cours',
      value: stats.totalCourses,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'amber',
    },
    {
      label: 'Élèves inscrits',
      value: stats.totalStudents,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'sky',
    },
    {
      label: 'Note moyenne',
      value: `${stats.averageRating || '—'}`,
      suffix: stats.averageRating ? '/ 5' : '',
      icon: (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      color: 'violet',
    },
    {
      label: 'Cours actifs',
      value: stats.activeCourses,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'emerald',
    },
  ];

  return (
    <div className="td-root">
      <style>{css}</style>

      {/* Header */}
      <header className="td-header">
        <div>
          <p className="td-eyebrow">Vue d'ensemble</p>
          <h1 className="td-title">Tableau de bord <em>Enseignant</em></h1>
        </div>
        <Link to="/teacher/courses/create" className="td-create-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau cours
        </Link>
      </header>

      {/* Stats */}
      <div className="td-stats">
        {statCards.map((card, i) => (
          <div key={card.label} className={`td-stat td-stat--${card.color}`} style={{ animationDelay: `${i * 70}ms` }}>
            <div className="td-stat-icon">{card.icon}</div>
            <div className="td-stat-body">
              <span className="td-stat-label">{card.label}</span>
              <div className="td-stat-value-row">
                <span className="td-stat-value">{card.value}</span>
                {card.suffix && <span className="td-stat-suffix">{card.suffix}</span>}
              </div>
            </div>
            <div className="td-stat-bg-shape" />
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="td-grid">
        {/* Last courses panel */}
        <div className="td-panel" style={{ animationDelay: '320ms' }}>
          <div className="td-panel-head">
            <h2 className="td-panel-title">Derniers cours ajoutés</h2>
            <Link to="/teacher/courses" className="td-link-all">Voir tout →</Link>
          </div>

          {stats.totalCourses === 0 ? (
            <div className="td-empty">
              <div className="td-empty-icon">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p>Vous n'avez pas encore publié de cours.</p>
              <Link to="/teacher/courses/create" className="td-create-btn td-create-btn--sm">
                Créer mon premier cours
              </Link>
            </div>
          ) : (
            <div className="td-course-hint">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Consultez l'onglet <strong>Mes Cours</strong> pour voir la liste complète.
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="td-panel td-actions-panel" style={{ animationDelay: '390ms' }}>
          <h2 className="td-panel-title" style={{ marginBottom: '20px' }}>Actions rapides</h2>
          <div className="td-actions-list">
            <Link to="/teacher/courses/create" className="td-action-item">
              <span className="td-action-icon td-action-icon--amber">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <span>Créer un cours</span>
              <svg className="td-action-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/teacher/courses" className="td-action-item">
              <span className="td-action-icon td-action-icon--sky">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </span>
              <span>Mes cours</span>
              <svg className="td-action-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/teacher/students" className="td-action-item">
              <span className="td-action-icon td-action-icon--violet">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span>Mes élèves</span>
              <svg className="td-action-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --td-ink:    #111117;
    --td-ink-2:  #52525b;
    --td-ink-3:  #a1a1aa;
    --td-bg:     #f5f5f8;
    --td-card:   #ffffff;
    --td-border: rgba(0,0,0,0.07);
    --td-ease:   cubic-bezier(0.22, 1, 0.36, 1);
    --td-r:      18px;
    --td-font:   'Sora', system-ui, sans-serif;
    --td-serif:  'Lora', Georgia, serif;

    /* palette per card */
    --amber-bg:   #fffbeb; --amber-icon: #f59e0b; --amber-ring: rgba(245,158,11,.15);
    --sky-bg:     #f0f9ff; --sky-icon:   #0ea5e9; --sky-ring:   rgba(14,165,233,.15);
    --violet-bg:  #f5f3ff; --violet-icon:#7c3aed; --violet-ring:rgba(124,58,237,.15);
    --emerald-bg: #ecfdf5; --emerald-icon:#059669; --emerald-ring:rgba(5,150,105,.15);
  }

  .td-root {
    font-family: var(--td-font);
    color: var(--td-ink);
    padding: 36px 40px 64px;
    max-width: 1100px;
    animation: td-fade .35s ease both;
  }
  @keyframes td-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes td-up {
    from { opacity:0; transform:translateY(14px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* ── Header ─────────────────────────────────── */
  .td-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 36px;
  }
  .td-eyebrow {
    font-size: .7rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: #f59e0b;
    margin: 0 0 8px;
  }
  .td-title {
    font-family: var(--td-font);
    font-size: clamp(1.5rem, 2.6vw, 2rem);
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -.02em;
  }
  .td-title em {
    font-family: var(--td-serif);
    font-style: italic;
    color: #f59e0b;
  }

  /* ── CTA Button ──────────────────────────────── */
  .td-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--td-ink);
    color: #fff;
    font-family: var(--td-font);
    font-size: .82rem;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 100px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,.14);
    transition: background .2s, transform .2s var(--td-ease), box-shadow .2s;
    white-space: nowrap;
  }
  .td-create-btn:hover {
    background: #d97706;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(245,158,11,.35);
    color: #fff;
  }
  .td-create-btn--sm {
    padding: 9px 18px;
    font-size: .78rem;
    margin-top: 4px;
  }

  /* ── Stats ───────────────────────────────────── */
  .td-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 18px;
    margin-bottom: 28px;
  }
  .td-stat {
    background: var(--td-card);
    border-radius: var(--td-r);
    padding: 22px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 0 0 1px var(--td-border);
    animation: td-up .45s var(--td-ease) both;
    transition: transform .25s var(--td-ease), box-shadow .25s;
  }
  .td-stat:hover {
    transform: translateY(-5px);
    box-shadow: 0 14px 28px rgba(0,0,0,.08), 0 0 0 1px var(--td-border);
  }

  .td-stat--amber .td-stat-icon { background:var(--amber-bg); color:var(--amber-icon); box-shadow:0 0 0 6px var(--amber-ring); }
  .td-stat--sky    .td-stat-icon { background:var(--sky-bg);   color:var(--sky-icon);   box-shadow:0 0 0 6px var(--sky-ring); }
  .td-stat--violet .td-stat-icon { background:var(--violet-bg);color:var(--violet-icon);box-shadow:0 0 0 6px var(--violet-ring); }
  .td-stat--emerald.td-stat-icon { background:var(--emerald-bg);color:var(--emerald-icon);box-shadow:0 0 0 6px var(--emerald-ring); }
  .td-stat--emerald .td-stat-icon { background:var(--emerald-bg);color:var(--emerald-icon);box-shadow:0 0 0 6px var(--emerald-ring); }

  .td-stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform .2s var(--td-ease);
  }
  .td-stat:hover .td-stat-icon { transform: scale(1.1) rotate(-4deg); }

  .td-stat-body { display:flex; flex-direction:column; flex:1; min-width:0; }
  .td-stat-label {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--td-ink-3);
    margin-bottom: 6px;
  }
  .td-stat-value-row { display:flex; align-items:baseline; gap:5px; }
  .td-stat-value {
    font-family: var(--td-serif);
    font-style: italic;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    color: var(--td-ink);
  }
  .td-stat-suffix {
    font-size: .75rem;
    color: var(--td-ink-3);
    font-weight: 500;
  }

  .td-stat-bg-shape {
    position: absolute;
    width: 90px; height: 90px;
    border-radius: 50%;
    right: -22px; bottom: -22px;
    opacity: .05;
    background: currentColor;
  }
  .td-stat--amber .td-stat-bg-shape { color: var(--amber-icon); }
  .td-stat--sky    .td-stat-bg-shape { color: var(--sky-icon); }
  .td-stat--violet .td-stat-bg-shape { color: var(--violet-icon); }
  .td-stat--emerald.td-stat-bg-shape { color: var(--emerald-icon); }

  /* ── Bottom Grid ─────────────────────────────── */
  .td-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 20px;
  }

  /* ── Panel ───────────────────────────────────── */
  .td-panel {
    background: var(--td-card);
    border-radius: var(--td-r);
    padding: 26px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04), 0 0 0 1px var(--td-border);
    animation: td-up .45s var(--td-ease) both;
  }
  .td-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
  }
  .td-panel-title {
    font-size: .92rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -.01em;
  }
  .td-link-all {
    font-size: .75rem;
    font-weight: 600;
    color: #f59e0b;
    text-decoration: none;
    transition: opacity .2s;
  }
  .td-link-all:hover { opacity: .7; }

  /* Empty state */
  .td-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 48px 20px;
    text-align: center;
    gap: 12px;
    color: var(--td-ink-2);
    font-size: .875rem;
  }
  .td-empty-icon {
    width: 58px; height: 58px;
    background: #fffbeb;
    color: #f59e0b;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .td-empty p { margin:0; color: var(--td-ink-3); line-height:1.6; }

  /* Hint */
  .td-course-hint {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 14px 18px;
    font-size: .85rem;
    color: #15803d;
  }

  /* ── Actions Panel ───────────────────────────── */
  .td-actions-panel { }
  .td-actions-list { display: flex; flex-direction: column; gap: 8px; }
  .td-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    border-radius: 12px;
    border: 1.5px solid var(--td-border);
    text-decoration: none;
    color: var(--td-ink);
    font-size: .85rem;
    font-weight: 500;
    transition: all .2s var(--td-ease);
  }
  .td-action-item:hover {
    border-color: #f59e0b;
    background: #fffbeb;
    transform: translateX(4px);
    color: var(--td-ink);
  }
  .td-action-arrow {
    margin-left: auto;
    color: var(--td-ink-3);
    transition: transform .2s var(--td-ease), color .2s;
  }
  .td-action-item:hover .td-action-arrow {
    transform: translateX(3px);
    color: #f59e0b;
  }
  .td-action-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .td-action-icon--amber  { background: var(--amber-bg);   color: var(--amber-icon); }
  .td-action-icon--sky    { background: var(--sky-bg);     color: var(--sky-icon); }
  .td-action-icon--violet { background: var(--violet-bg);  color: var(--violet-icon); }

  /* ── Responsive ──────────────────────────────── */
  @media (max-width: 900px) {
    .td-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .td-root { padding: 22px 16px 48px; }
    .td-stats { grid-template-columns: 1fr 1fr; }
    .td-create-btn:not(.td-create-btn--sm) { padding: 10px 16px; font-size: .78rem; }
  }
  @media (max-width: 400px) {
    .td-stats { grid-template-columns: 1fr; }
  }
`;