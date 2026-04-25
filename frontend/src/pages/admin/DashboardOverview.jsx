import { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/adminApi';
import { Link } from 'react-router-dom';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, pendingCourses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="ad-loading">
        <div className="ad-loader" />
        <span>Chargement du tableau de bord…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .ad-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .ad-loader { width:32px; height:32px; border:3px solid #fecdd3; border-top-color:#e11d48; border-radius:50%; animation:ad-spin .8s linear infinite; }
          @keyframes ad-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Utilisateurs inscrits',
      value: stats.totalUsers,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'rose',
      trend: '+12 ce mois',
      trendUp: true,
      link: '/admin/users',
    },
    {
      label: 'Cours créés',
      value: stats.totalCourses,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'violet',
      trend: '+4 cette semaine',
      trendUp: true,
      link: '/admin/courses',
    },
    {
      label: 'Cours en attente',
      value: stats.pendingCourses,
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: stats.pendingCourses > 0 ? 'amber' : 'slate',
      trend: stats.pendingCourses > 0 ? 'Action requise' : 'À jour',
      trendUp: stats.pendingCourses === 0,
      urgent: stats.pendingCourses > 0,
      link: '/admin/courses?filter=pending',
    },
  ];

  const quickActions = [
    {
      label: 'Gérer les utilisateurs',
      desc: 'Voir, modifier ou suspendre des comptes',
      to: '/admin/users',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'rose',
    },
    {
      label: 'Modérer les cours',
      desc: 'Examiner et publier les soumissions',
      to: '/admin/courses',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'violet',
      badge: stats.pendingCourses > 0 ? stats.pendingCourses : null,
    },
    {
      label: 'Gérer les catégories',
      desc: 'Organiser le catalogue de cours',
      to: '/admin/categories',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'sky',
    },
  ];

  return (
    <div className="ad-root">
      <style>{css}</style>

      {/* Header */}
      <header className="ad-header">
        <div>
          <p className="ad-eyebrow">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="5" cy="5" r="5" />
            </svg>
            Système en ligne
          </p>
          <h1 className="ad-title">Administration <em>Plateforme</em></h1>
          <p className="ad-sub">Vue d'ensemble des activités et indicateurs clés.</p>
        </div>
        <div className="ad-header-date">
          {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
        </div>
      </header>

      {/* Stats */}
      <div className="ad-stats">
        {statCards.map((card, i) => (
          <Link
            key={card.label}
            to={card.link}
            className={`ad-stat ad-stat--${card.color} ${card.urgent ? 'ad-stat--urgent' : ''}`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="ad-stat-top">
              <div className="ad-stat-icon">{card.icon}</div>
              {card.urgent && (
                <span className="ad-urgent-dot">
                  <span />
                </span>
              )}
            </div>
            <div className="ad-stat-value">{card.value}</div>
            <div className="ad-stat-label">{card.label}</div>
            <div className={`ad-stat-trend ${card.trendUp ? 'ad-trend--up' : 'ad-trend--neutral'}`}>
              {card.trendUp
                ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
              }
              {card.trend}
            </div>
            <div className="ad-stat-arrow">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="ad-grid">

        {/* Quick Actions */}
        <div className="ad-panel" style={{ animationDelay: '280ms' }}>
          <div className="ad-panel-head">
            <h2 className="ad-panel-title">Actions rapides</h2>
          </div>
          <div className="ad-actions">
            {quickActions.map(action => (
              <Link key={action.label} to={action.to} className={`ad-action ad-action--${action.color}`}>
                <div className="ad-action-icon">{action.icon}</div>
                <div className="ad-action-body">
                  <span className="ad-action-label">
                    {action.label}
                    {action.badge && (
                      <span className="ad-action-badge">{action.badge}</span>
                    )}
                  </span>
                  <span className="ad-action-desc">{action.desc}</span>
                </div>
                <svg className="ad-action-arrow" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="ad-panel" style={{ animationDelay: '350ms' }}>
          <div className="ad-panel-head">
            <h2 className="ad-panel-title">Activité récente</h2>
          </div>
          <div className="ad-activity-empty">
            <div className="ad-activity-icon">
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p>Aucune activité récente pour le moment.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --ad-ink:     #111117;
    --ad-ink-2:   #52525b;
    --ad-ink-3:   #a1a1aa;
    --ad-bg:      #f5f5f8;
    --ad-card:    #ffffff;
    --ad-border:  rgba(0,0,0,0.07);
    --ad-rose:    #e11d48;
    --ad-rose-l:  #fff1f2;
    --ad-rose-d:  #be123c;
    --ad-violet:  #7c3aed;
    --ad-violet-l:#f5f3ff;
    --ad-amber:   #f59e0b;
    --ad-amber-l: #fffbeb;
    --ad-sky:     #0ea5e9;
    --ad-sky-l:   #f0f9ff;
    --ad-slate:   #64748b;
    --ad-slate-l: #f8fafc;
    --ad-green:   #059669;
    --ad-green-l: #ecfdf5;
    --ad-r:       18px;
    --ad-ease:    cubic-bezier(0.22,1,0.36,1);
    --ad-font:    'Sora', system-ui, sans-serif;
    --ad-serif:   'Lora', Georgia, serif;
  }

  .ad-root {
    font-family: var(--ad-font);
    color: var(--ad-ink);
    padding: 36px 40px 64px;
    max-width: 1100px;
    animation: ad-fade .35s ease both;
  }
  @keyframes ad-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes ad-up {
    from { opacity:0; transform:translateY(14px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* ── Header ─────────────────────────────────── */
  .ad-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 36px;
  }
  .ad-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ad-green);
    margin: 0 0 10px;
  }
  .ad-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 6px;
    line-height: 1.15;
  }
  .ad-title em {
    font-family: var(--ad-serif);
    font-style: italic;
    color: var(--ad-rose);
  }
  .ad-sub {
    font-size: .82rem;
    color: var(--ad-ink-2);
    margin: 0;
  }
  .ad-header-date {
    font-size: .75rem;
    font-weight: 500;
    color: var(--ad-ink-3);
    background: var(--ad-card);
    border: 1px solid var(--ad-border);
    border-radius: 100px;
    padding: 8px 16px;
    white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    align-self: flex-start;
    text-transform: capitalize;
  }

  /* ── Stats ───────────────────────────────────── */
  .ad-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
    margin-bottom: 28px;
  }
  .ad-stat {
    background: var(--ad-card);
    border-radius: var(--ad-r);
    padding: 24px;
    border: 1.5px solid var(--ad-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    text-decoration: none;
    color: var(--ad-ink);
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
    overflow: hidden;
    animation: ad-up .45s var(--ad-ease) both;
    transition: transform .25s var(--ad-ease), box-shadow .25s, border-color .2s;
  }
  .ad-stat:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 32px rgba(0,0,0,.09);
    color: var(--ad-ink);
  }
  .ad-stat--rose:hover   { border-color: rgba(225,29,72,.25); }
  .ad-stat--violet:hover { border-color: rgba(124,58,237,.25); }
  .ad-stat--amber:hover  { border-color: rgba(245,158,11,.25); }
  .ad-stat--slate:hover  { border-color: rgba(100,116,139,.25); }

  .ad-stat--urgent {
    border-color: rgba(245,158,11,.35) !important;
    background: linear-gradient(135deg, #fffbeb 0%, #fff 60%);
  }

  .ad-stat-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .ad-stat-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    transition: transform .25s var(--ad-ease);
  }
  .ad-stat:hover .ad-stat-icon { transform: scale(1.1) rotate(-4deg); }
  .ad-stat--rose   .ad-stat-icon { background: var(--ad-rose-l);   color: var(--ad-rose); }
  .ad-stat--violet .ad-stat-icon { background: var(--ad-violet-l); color: var(--ad-violet); }
  .ad-stat--amber  .ad-stat-icon { background: var(--ad-amber-l);  color: var(--ad-amber); }
  .ad-stat--slate  .ad-stat-icon { background: var(--ad-slate-l);  color: var(--ad-slate); }

  /* Pulsing urgent dot */
  .ad-urgent-dot {
    width: 12px; height: 12px;
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .ad-urgent-dot span {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--ad-amber);
    display: block;
    position: relative;
  }
  .ad-urgent-dot span::before {
    content: '';
    position: absolute; inset: -3px;
    border-radius: 50%;
    border: 2px solid var(--ad-amber);
    animation: ad-pulse 1.5s ease-out infinite;
    opacity: 0;
  }
  @keyframes ad-pulse {
    0%   { transform: scale(.6); opacity: .8; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  .ad-stat-value {
    font-family: var(--ad-serif);
    font-style: italic;
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 1;
    color: var(--ad-ink);
  }
  .ad-stat-label {
    font-size: .72rem;
    font-weight: 600;
    color: var(--ad-ink-2);
    letter-spacing: .02em;
  }
  .ad-stat-trend {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .68rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 100px;
    width: fit-content;
    margin-top: 4px;
  }
  .ad-trend--up      { background: var(--ad-green-l); color: var(--ad-green); }
  .ad-trend--neutral { background: var(--ad-amber-l); color: var(--ad-amber); }

  .ad-stat-arrow {
    position: absolute;
    bottom: 18px; right: 18px;
    color: var(--ad-ink-3);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity .2s, transform .2s var(--ad-ease);
  }
  .ad-stat:hover .ad-stat-arrow { opacity: 1; transform: translateX(0); }

  /* ── Grid ────────────────────────────────────── */
  .ad-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* ── Panel ───────────────────────────────────── */
  .ad-panel {
    background: var(--ad-card);
    border-radius: var(--ad-r);
    padding: 26px;
    border: 1.5px solid var(--ad-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    animation: ad-up .45s var(--ad-ease) both;
  }
  .ad-panel-head { margin-bottom: 20px; }
  .ad-panel-title {
    font-size: .92rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -.01em;
  }

  /* ── Quick Actions ───────────────────────────── */
  .ad-actions { display: flex; flex-direction: column; gap: 10px; }
  .ad-action {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 13px;
    border: 1.5px solid var(--ad-border);
    text-decoration: none;
    color: var(--ad-ink);
    transition: all .2s var(--ad-ease);
  }
  .ad-action:hover { transform: translateX(4px); color: var(--ad-ink); }
  .ad-action--rose:hover   { border-color: rgba(225,29,72,.25);   background: var(--ad-rose-l); }
  .ad-action--violet:hover { border-color: rgba(124,58,237,.25);  background: var(--ad-violet-l); }
  .ad-action--sky:hover    { border-color: rgba(14,165,233,.25);  background: var(--ad-sky-l); }

  .ad-action-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: transform .2s var(--ad-ease);
  }
  .ad-action:hover .ad-action-icon { transform: scale(1.08) rotate(-3deg); }
  .ad-action--rose   .ad-action-icon { background: var(--ad-rose-l);   color: var(--ad-rose); }
  .ad-action--violet .ad-action-icon { background: var(--ad-violet-l); color: var(--ad-violet); }
  .ad-action--sky    .ad-action-icon { background: var(--ad-sky-l);    color: var(--ad-sky); }

  .ad-action-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .ad-action-label {
    font-size: .85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ad-action-badge {
    background: var(--ad-amber);
    color: #fff;
    font-size: .65rem;
    font-weight: 800;
    padding: 1px 7px;
    border-radius: 100px;
  }
  .ad-action-desc {
    font-size: .72rem;
    color: var(--ad-ink-3);
    line-height: 1.4;
  }
  .ad-action-arrow {
    color: var(--ad-ink-3);
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity .2s, transform .2s var(--ad-ease);
  }
  .ad-action:hover .ad-action-arrow { opacity: 1; transform: translateX(0); }

  /* ── Activity ────────────────────────────────── */
  .ad-activity-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 16px;
    text-align: center;
    gap: 12px;
  }
  .ad-activity-icon {
    width: 54px; height: 54px;
    background: #f8fafc;
    color: var(--ad-ink-3);
    border-radius: 14px;
    border: 1.5px dashed var(--ad-border);
    display: flex; align-items: center; justify-content: center;
  }
  .ad-activity-empty p {
    font-size: .82rem;
    color: var(--ad-ink-3);
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 900px) {
    .ad-stats { grid-template-columns: 1fr 1fr; }
    .ad-grid  { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .ad-root  { padding: 22px 16px 48px; }
    .ad-stats { grid-template-columns: 1fr; }
    .ad-header-date { display: none; }
  }
`;