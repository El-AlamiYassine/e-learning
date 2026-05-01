import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    to: '/student/dashboard',
    label: 'Vue d\'ensemble',
    end: true,
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/student/dashboard/courses',
    label: 'Mes Cours',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    to: '/student/dashboard/catalog',
    label: 'Explorer',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    to: '/student/dashboard/calendar',
    label: 'Calendrier',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/student/dashboard/certificates',
    label: 'Certificats',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  const currentNav = NAV_ITEMS.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );
  const pageTitle = currentNav?.label ?? 'Dashboard';

  return (
    <div className="sl-root">
      <style>{css}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sl-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────── */}
      <aside className={`sl-sidebar ${mobileOpen ? 'sl-sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sl-logo">
          <div className="sl-logo-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <span className="sl-logo-name">Espace apprenant</span>
          </div>
        </div>

        {/* Section label */}
        <p className="sl-section-label">Navigation</p>

        {/* Nav */}
        <nav className="sl-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sl-nav-link ${isActive ? 'sl-nav-link--active' : ''}`
              }
            >
              <span className="sl-nav-icon">{item.icon}</span>
              <span className="sl-nav-label">{item.label}</span>
              <span className="sl-nav-arrow">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Progress motivator */}
        <div className="sl-motivator">
          <span className="sl-motivator-emoji">🎯</span>
          <div>
            <span className="sl-motivator-title">Continuez comme ça !</span>
            <span className="sl-motivator-sub">Chaque leçon vous rapproche de votre objectif.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="sl-sidebar-footer">
          <div className="sl-user-card">
            <div className="sl-user-avatar">{initials}</div>
            <div className="sl-user-info">
              <span className="sl-user-name">{user?.prenom} {user?.nom}</span>
              <span className="sl-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sl-logout-btn" onClick={logout}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="sl-main">

        {/* Topbar */}
        <header className="sl-topbar">
          <div className="sl-topbar-left">
            <button className="sl-menu-btn" onClick={() => setMobileOpen(v => !v)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="sl-breadcrumb">
              <span className="sl-breadcrumb-root">Espace apprenant</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="sl-breadcrumb-current">{pageTitle}</span>
            </div>
          </div>
          <div className="sl-topbar-right">
            <span className="sl-topbar-greeting">Bonjour, {user?.prenom} 👋</span>
            <div className="sl-topbar-avatar">{initials}</div>
          </div>
        </header>

        {/* Content */}
        <div className="sl-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --sl-ink:      #111117;
    --sl-ink-2:    #52525b;
    --sl-ink-3:    #a1a1aa;
    --sl-bg:       #f5f5f8;
    --sl-card:     #ffffff;
    --sl-border:   rgba(0,0,0,0.07);
    --sl-violet:   #6366f1;
    --sl-violet-l: #eef2ff;
    --sl-violet-d: #4338ca;
    --sl-sidebar-w: 256px;
    --sl-ease:     cubic-bezier(0.22,1,0.36,1);
    --sl-font:     'Sora', system-ui, sans-serif;
    --sl-serif:    'Lora', Georgia, serif;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .sl-root {
    display: flex;
    min-height: 100vh;
    background: var(--sl-bg);
    font-family: var(--sl-font);
    color: var(--sl-ink);
  }

  /* ── Sidebar ───────────────────────────────── */
  .sl-sidebar {
    width: var(--sl-sidebar-w);
    flex-shrink: 0;
    background: var(--sl-card);
    border-right: 1px solid var(--sl-border);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    transition: transform .3s var(--sl-ease);
    scrollbar-width: none;
    z-index: 50;
  }
  .sl-sidebar::-webkit-scrollbar { display: none; }

  /* Logo */
  .sl-logo {
    display: flex; align-items: center; gap: 12px;
    padding: 4px 8px 20px;
    border-bottom: 1px solid var(--sl-border);
    margin-bottom: 24px;
  }
  .sl-logo-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--sl-violet), #818cf8);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(99,102,241,.3);
  }
  .sl-logo-name {
    display: block; font-size: .9rem; font-weight: 700;
    color: var(--sl-ink); letter-spacing: -.02em; line-height: 1.2;
  }
  .sl-logo-role {
    display: block; font-size: .65rem; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    color: var(--sl-violet);
  }

  /* Section label */
  .sl-section-label {
    font-size: .62rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--sl-ink-3); padding: 0 10px; margin: 0 0 8px;
  }

  /* Nav */
  .sl-nav {
    display: flex; flex-direction: column; gap: 3px; flex: 1;
  }
  .sl-nav-link {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: 12px;
    text-decoration: none; color: var(--sl-ink-2);
    font-size: .85rem; font-weight: 500;
    transition: background .18s, color .18s, transform .2s var(--sl-ease);
    position: relative;
  }
  .sl-nav-link:hover {
    background: var(--sl-bg); color: var(--sl-ink); transform: translateX(2px);
  }
  .sl-nav-link--active {
    background: var(--sl-violet-l); color: var(--sl-violet); font-weight: 700;
  }
  .sl-nav-link--active:hover { background: var(--sl-violet-l); color: var(--sl-violet); }

  /* Active indicator bar */
  .sl-nav-link--active::before {
    content: '';
    position: absolute; left: 0; top: 6px; bottom: 6px;
    width: 3px; border-radius: 0 3px 3px 0;
    background: var(--sl-violet);
    margin-left: -16px;
  }

  .sl-nav-icon {
    width: 32px; height: 32px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background .18s;
  }
  .sl-nav-link--active .sl-nav-icon { background: rgba(99,102,241,.12); }
  .sl-nav-label { flex: 1; }
  .sl-nav-arrow {
    color: var(--sl-ink-3); opacity: 0;
    transform: translateX(-4px);
    transition: opacity .18s, transform .2s var(--sl-ease);
  }
  .sl-nav-link:hover .sl-nav-arrow,
  .sl-nav-link--active .sl-nav-arrow {
    opacity: 1; transform: translateX(0);
  }
  .sl-nav-link--active .sl-nav-arrow { color: var(--sl-violet); }

  /* Motivator */
  .sl-motivator {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--sl-violet-l);
    border: 1px solid rgba(99,102,241,.15);
    border-radius: 13px; padding: 13px 14px;
    margin: 20px 0 0;
  }
  .sl-motivator-emoji { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
  .sl-motivator-title {
    display: block; font-size: .78rem; font-weight: 700;
    color: var(--sl-violet); margin-bottom: 2px;
  }
  .sl-motivator-sub {
    display: block; font-size: .7rem; color: var(--sl-ink-3); line-height: 1.45;
  }

  /* Footer */
  .sl-sidebar-footer {
    margin-top: 20px; padding-top: 20px;
    border-top: 1px solid var(--sl-border);
    display: flex; flex-direction: column; gap: 12px;
  }
  .sl-user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 10px; border-radius: 12px; background: var(--sl-bg);
  }
  .sl-user-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--sl-violet), #818cf8);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 700; flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(99,102,241,.25);
  }
  .sl-user-info { min-width: 0; }
  .sl-user-name {
    display: block; font-size: .82rem; font-weight: 700; color: var(--sl-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sl-user-email {
    display: block; font-size: .68rem; color: var(--sl-ink-3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .sl-logout-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 9px 16px; border-radius: 11px;
    border: 1.5px solid rgba(99,102,241,.2);
    background: var(--sl-violet-l); color: var(--sl-violet);
    font-family: var(--sl-font); font-size: .8rem; font-weight: 600;
    cursor: pointer;
    transition: background .2s, transform .2s var(--sl-ease), box-shadow .2s;
  }
  .sl-logout-btn:hover {
    background: #e0e7ff; transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99,102,241,.2);
  }

  /* ── Main ──────────────────────────────────── */
  .sl-main {
    flex: 1; display: flex; flex-direction: column;
    min-width: 0; min-height: 100vh;
  }

  /* Topbar */
  .sl-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 60px;
    background: var(--sl-card);
    border-bottom: 1px solid var(--sl-border);
    position: sticky; top: 0; z-index: 40; flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .sl-topbar-left { display: flex; align-items: center; gap: 14px; }
  .sl-menu-btn {
    display: none;
    width: 34px; height: 34px; border-radius: 9px;
    border: 1.5px solid var(--sl-border); background: var(--sl-bg);
    color: var(--sl-ink-2);
    align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s;
  }
  .sl-menu-btn:hover { border-color: var(--sl-violet); color: var(--sl-violet); }

  .sl-breadcrumb {
    display: flex; align-items: center; gap: 6px; font-size: .8rem;
  }
  .sl-breadcrumb-root { color: var(--sl-ink-3); font-weight: 500; }
  .sl-breadcrumb svg { color: var(--sl-ink-3); }
  .sl-breadcrumb-current { color: var(--sl-ink); font-weight: 700; }

  .sl-topbar-right { display: flex; align-items: center; gap: 12px; }
  .sl-topbar-greeting {
    font-size: .8rem; font-weight: 500; color: var(--sl-ink-2);
  }
  .sl-topbar-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, var(--sl-violet), #818cf8);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: .7rem; font-weight: 700;
    box-shadow: 0 3px 8px rgba(99,102,241,.25);
  }

  /* Content */
  .sl-content {
    flex: 1; overflow-y: auto;
    padding: 32px 40px;
    scrollbar-width: thin;
    scrollbar-color: var(--sl-border) transparent;
  }
  .sl-content::-webkit-scrollbar { width: 5px; }
  .sl-content::-webkit-scrollbar-thumb { background: var(--sl-border); border-radius: 100px; }

  /* Mobile */
  .sl-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.4);
    z-index: 49;
    backdrop-filter: blur(2px);
    animation: sl-fade .2s ease both;
  }
  @keyframes sl-fade { from { opacity:0 } to { opacity:1 } }

  @media (max-width: 768px) {
    .sl-sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
    }
    .sl-sidebar--open { transform: translateX(0); }
    .sl-menu-btn { display: flex; }
    .sl-content { padding: 24px 18px; }
    .sl-topbar { padding: 0 18px; }
    .sl-topbar-greeting { display: none; }
  }
`;