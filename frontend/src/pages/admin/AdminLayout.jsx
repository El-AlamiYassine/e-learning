import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getLinkClasses = ({ isActive }) =>
    `text-decoration-none d-flex align-items-center gap-3 p-3 rounded-3 mb-1 fw-medium transition-all ${
      isActive
        ? 'bg-danger text-white shadow-sm'
        : 'text-muted hover-lift'
    }`;

  return (
    <div className="d-flex" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="position-sticky top-0 d-none d-md-flex flex-column py-4 px-3 shadow-sm" style={{ width: '280px', height: '100vh', background: 'var(--bg-card)', borderRight: '1px solid var(--border-light)' }}>
        <div className="d-flex align-items-center mb-5 px-2">
          <div className="d-flex align-items-center justify-content-center text-white me-3" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h4 className="m-0 fw-bold fs-5 text-dark letter-spacing-tight">Admin Portal</h4>
        </div>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          <NavLink to="/admin/dashboard" end className={getLinkClasses}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Tableau de bord
          </NavLink>
          <NavLink to="/admin/users" className={getLinkClasses}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Gestion Utilisateurs
          </NavLink>
          <NavLink to="/admin/courses" className={getLinkClasses}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Gestion des Cours
          </NavLink>
          <NavLink to="/admin/settings" className={getLinkClasses}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Paramètres
          </NavLink>
        </nav>

        <div className="mt-auto border-top pt-4">
          <div className="d-flex align-items-center p-2 mb-3">
            <div className="text-white d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm" style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="mb-0 fw-bold text-dark text-truncate">{user?.prenom} {user?.nom}</p>
              <p className="mb-0 text-muted text-truncate" style={{ fontSize: '11px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="btn w-100 text-start text-danger hover-lift fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column overflow-hidden">
        {/* Mobile Header */}
        <header className="d-md-none bg-white p-3 border-bottom d-flex align-items-center justify-content-between shadow-sm position-sticky top-0 z-3">
           <h4 className="m-0 fw-bold fs-5 text-dark">Admin Portal</h4>
           <button className="btn btn-outline-secondary border-light btn-sm d-flex align-items-center p-2 rounded-3">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </header>
        
        {/* Page Content */}
        <div className="flex-grow-1 p-4 p-md-5 overflow-auto custom-scroll">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
