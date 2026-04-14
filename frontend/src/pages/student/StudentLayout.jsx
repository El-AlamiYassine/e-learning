import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="d-flex bg-light">
      {/* Sidebar */}
      <aside className="sidebar position-sticky top-0 d-none d-md-flex flex-column py-4 px-3 shadow-sm">
        <div className="d-flex align-items-center mb-5 px-2">
          <div className="bg-primary rounded p-2 me-2 shadow-sm">
            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h4 className="m-0 fw-bold fs-5 text-dark">E-Learning</h4>
        </div>

        <nav className="flex-grow-1 d-flex flex-column gap-1">
          <NavLink to="/student/dashboard" end className={({ isActive }) => `text-decoration-none d-flex align-items-center gap-3 nav-link-custom ${isActive ? 'active' : ''}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Tableau de bord
          </NavLink>
          <NavLink to="/student/dashboard/courses" className={({ isActive }) => `text-decoration-none d-flex align-items-center gap-3 nav-link-custom ${isActive ? 'active' : ''}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Mes Cours
          </NavLink>
          <NavLink to="/student/dashboard/catalog" className={({ isActive }) => `text-decoration-none d-flex align-items-center gap-3 nav-link-custom ${isActive ? 'active' : ''}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Explorer les cours
          </NavLink>
          <NavLink to="/student/dashboard/calendar" className={({ isActive }) => `text-decoration-none d-flex align-items-center gap-3 nav-link-custom ${isActive ? 'active' : ''}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Calendrier
          </NavLink>
          <NavLink to="/student/dashboard/certificates" className={({ isActive }) => `text-decoration-none d-flex align-items-center gap-3 nav-link-custom ${isActive ? 'active' : ''}`}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Certificats
          </NavLink>
        </nav>

        <div className="mt-auto border-top pt-3">
          <div className="d-flex align-items-center p-2 mb-2">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div>
              <p className="mb-0 fw-bold text-dark small">{user?.prenom} {user?.nom}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-light w-100 text-start text-danger hover-lift fw-medium d-flex align-items-center gap-2">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column" style={{ marginLeft: "0" }}>
        {/* Mobile Header */}
        <header className="d-md-none bg-white p-3 border-bottom d-flex align-items-center justify-content-between shadow-sm position-sticky top-0 z-3">
           <h4 className="m-0 fw-bold fs-5 text-dark">E-Learning</h4>
           <button className="btn btn-outline-secondary btn-sm d-flex align-items-center p-1">
             <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </header>
        
        {/* Page Content */}
        <div className="flex-grow-1 p-4 p-md-5 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
