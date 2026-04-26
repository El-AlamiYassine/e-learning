import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  {
    to: '/admin/dashboard',
    label: 'Tableau de bord',
    end: true,
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'Utilisateurs',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    to: '/admin/courses',
    label: 'Cours',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    to: '/admin/settings',
    label: 'Paramètres',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  // Page title from current route
  const currentNav = NAV_ITEMS.find(n =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  );
  const pageTitle = currentNav?.label ?? 'Admin';

  return (
    <div className="al-root">
      <style>{css}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="al-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────── */}
      <aside className={`al-sidebar ${mobileOpen ? 'al-sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="al-logo">
          <div className="al-logo-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div>
            <span className="al-logo-name">Admin Portal</span>
            <span className="al-logo-role">Administrateur</span>
          </div>
        </div>

        {/* Section label */}
        <p className="al-section-label">Navigation</p>

        {/* Nav */}
        <nav className="al-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `al-nav-link ${isActive ? 'al-nav-link--active' : ''}`
              }
            >
              <span className="al-nav-icon">{item.icon}</span>
              <span className="al-nav-label">{item.label}</span>
              <span className="al-nav-arrow">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="al-sidebar-footer">
          <div className="al-user-card">
            <div className="al-user-avatar">{initials}</div>
            <div className="al-user-info">
              <span className="al-user-name">{user?.prenom} {user?.nom}</span>
              <span className="al-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="al-logout-btn" onClick={logout}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────── */}
      <div className="al-main">

        {/* Topbar */}
        <header className="al-topbar">
          <div className="al-topbar-left">
            <button className="al-menu-btn" onClick={() => setMobileOpen(v => !v)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="al-breadcrumb">
              <span className="al-breadcrumb-root">Admin</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="al-breadcrumb-current">{pageTitle}</span>
            </div>
          </div>
          <div className="al-topbar-right">
            <div className="al-topbar-avatar">{initials}</div>
          </div>
        </header>

        {/* Content */}
        <div className="al-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --al-ink:      #111117;
    --al-ink-2:    #52525b;
    --al-ink-3:    #a1a1aa;
    --al-bg:       #f5f5f8;
    --al-card:     #ffffff;
    --al-border:   rgba(0,0,0,0.07);
    --al-sidebar-w: 256px;
    --al-rose:     #e11d48;
    --al-rose-l:   #fff1f2;
    --al-rose-d:   #be123c;
    --al-ease:     cubic-bezier(0.22,1,0.36,1);
    --al-font:     'Sora', system-ui, sans-serif;
    --al-serif:    'Lora', Georgia, serif;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .al-root {
    display: flex;
    min-height: 100vh;
    background: var(--al-bg);
    font-family: var(--al-font);
    color: var(--al-ink);
  }

  /* ── Sidebar ───────────────────────────────── */
  .al-sidebar {
    width: var(--al-sidebar-w);
    flex-shrink: 0;
    background: var(--al-card);
    border-right: 1px solid var(--al-border);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    transition: transform .3s var(--al-ease);
    scrollbar-width: none;
    z-index: 50;
  }
  .al-sidebar::-webkit-scrollbar { display: none; }

  /* ── Logo ──────────────────────────────────── */
  .al-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 8px 20px;
    border-bottom: 1px solid var(--al-border);
    margin-bottom: 24px;
  }
  .al-logo-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, var(--al-rose), #f97316);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(225,29,72,.3);
  }
  .al-logo-name {
    display: block;
    font-size: .9rem;
    font-weight: 700;
    color: var(--al-ink);
    letter-spacing: -.02em;
    line-height: 1.2;
  }
  .al-logo-role {
    display: block;
    font-size: .65rem;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--al-rose);
  }

  /* ── Section label ─────────────────────────── */
  .al-section-label {
    font-size: .62rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--al-ink-3);
    padding: 0 10px;
    margin: 0 0 8px;
  }

  /* ── Nav ───────────────────────────────────── */
  .al-nav {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }
  .al-nav-link {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 10px 12px;
    border-radius: 12px;
    text-decoration: none;
    color: var(--al-ink-2);
    font-size: .85rem;
    font-weight: 500;
    transition: background .18s, color .18s, transform .2s var(--al-ease);
    position: relative;
  }
  .al-nav-link:hover {
    background: var(--al-bg);
    color: var(--al-ink);
    transform: translateX(2px);
  }
  .al-nav-link--active {
    background: var(--al-rose-l);
    color: var(--al-rose);
    font-weight: 700;
  }
  .al-nav-link--active:hover {
    background: var(--al-rose-l);
    color: var(--al-rose);
  }
  .al-nav-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: background .18s;
  }
  .al-nav-link--active .al-nav-icon {
    background: rgba(225,29,72,.12);
  }
  .al-nav-label { flex: 1; }
  .al-nav-arrow {
    color: var(--al-ink-3);
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity .18s, transform .2s var(--al-ease);
  }
  .al-nav-link:hover .al-nav-arrow { opacity: 1; transform: translateX(0); }
  .al-nav-link--active .al-nav-arrow { opacity: 1; transform: translateX(0); color: var(--al-rose); }

  /* Active left bar */
  .al-nav-link--active::before {
    content: '';
    position: absolute;
    left: 0; top: 6px; bottom: 6px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--al-rose);
    margin-left: -16px;
  }

  /* ── Sidebar Footer ────────────────────────── */
  .al-sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--al-border);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .al-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 12px;
    background: var(--al-bg);
  }
  .al-user-avatar {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--al-rose), #f97316);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 700;
    flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(225,29,72,.25);
  }
  .al-user-info { min-width: 0; }
  .al-user-name {
    display: block;
    font-size: .82rem; font-weight: 700;
    color: var(--al-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .al-user-email {
    display: block;
    font-size: .68rem; color: var(--al-ink-3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .al-logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 9px 16px;
    border-radius: 11px;
    border: 1.5px solid rgba(225,29,72,.2);
    background: var(--al-rose-l);
    color: var(--al-rose);
    font-family: var(--al-font);
    font-size: .8rem; font-weight: 600;
    cursor: pointer;
    transition: background .2s, transform .2s var(--al-ease), box-shadow .2s;
  }
  .al-logout-btn:hover {
    background: #fecdd3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(225,29,72,.2);
  }

  /* ── Main ──────────────────────────────────── */
  .al-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 100vh;
  }

  /* ── Topbar ────────────────────────────────── */
  .al-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 60px;
    background: var(--al-card);
    border-bottom: 1px solid var(--al-border);
    position: sticky;
    top: 0;
    z-index: 40;
    flex-shrink: 0;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .al-topbar-left { display: flex; align-items: center; gap: 14px; }
  .al-menu-btn {
    display: none;
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1.5px solid var(--al-border);
    background: var(--al-bg);
    color: var(--al-ink-2);
    align-items: center; justify-content: center;
    cursor: pointer;
    transition: all .2s;
  }
  .al-menu-btn:hover { border-color: var(--al-rose); color: var(--al-rose); }
  .al-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: .8rem;
  }
  .al-breadcrumb-root { color: var(--al-ink-3); font-weight: 500; }
  .al-breadcrumb svg { color: var(--al-ink-3); }
  .al-breadcrumb-current { color: var(--al-ink); font-weight: 700; }
  .al-topbar-right { display: flex; align-items: center; gap: 12px; }
  .al-topbar-avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--al-rose), #f97316);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: .7rem; font-weight: 700;
    box-shadow: 0 3px 8px rgba(225,29,72,.25);
  }

  /* ── Content ───────────────────────────────── */
  .al-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px 40px;
    scrollbar-width: thin;
    scrollbar-color: var(--al-border) transparent;
  }
  .al-content::-webkit-scrollbar { width: 5px; }
  .al-content::-webkit-scrollbar-thumb { background: var(--al-border); border-radius: 100px; }

  /* ── Mobile ────────────────────────────────── */
  .al-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,.4);
    z-index: 49;
    backdrop-filter: blur(2px);
    animation: al-fade .2s ease both;
  }
  @keyframes al-fade { from { opacity:0 } to { opacity:1 } }

  @media (max-width: 768px) {
    .al-sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      transform: translateX(-100%);
    }
    .al-sidebar--open { transform: translateX(0); }
    .al-menu-btn { display: flex; }
    .al-content { padding: 24px 18px; }
    .al-topbar { padding: 0 18px; }
  }
`;