import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { valeur: '500+', label: 'Cours universitaires' },
  { valeur: '12k+', label: 'Étudiants actifs' },
  { valeur: '80+',  label: 'Professeurs experts' },
  { valeur: '95%',  label: 'Taux de réussite' },
];

const features = [
  {
    titre: 'Cours au format PDF',
    desc: 'Accédez à tous vos cours hors-ligne. Des documents clairs, structurés et toujours disponibles.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
             a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19
             a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    titre: 'Quiz & Évaluations',
    desc: 'Testez vos connaissances en temps réel avec des quiz interactifs et suivez votre progression.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7
             a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2
             M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
  },
  {
    titre: 'Dashboard Dynamique',
    desc: 'Visualisez vos statistiques, vos derniers cours consultés et restez motivé.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2
             a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
             m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2
             a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    titre: 'Certificats de Réussite',
    desc: 'Obtenez un certificat officiel après l\'achèvement de vos modules et validez vos acquis.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806
             3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806
             3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
             3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946
             3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806
             3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
             3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946
             3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946
             3.42 3.42 0 013.138-3.138z"/>
      </svg>
    ),
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const dashboardUrl = user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : user?.role === 'ROLE_TEACHER' ? '/teacher/dashboard' : '/student/dashboard';

  return (
    <div className="bg-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Premium Navbar ── */}
      <nav className="navbar navbar-expand-md sticky-top glass-panel" style={{ margin: '1rem max(1rem, 5vw)', padding: '0.8rem 2rem', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '100px', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="container-fluid p-0">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center gap-2 m-0" to="/">
            <div className="d-flex align-items-center justify-content-center text-white" style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary))', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                     5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                     4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5
                     18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span className="fs-5 fw-bold text-dark letter-spacing-tight">E-Learning</span>
          </Link>

          {/* Nav links */}
          <div className="d-none d-md-flex align-items-center gap-4 mx-auto">
             <a href="#fonctionnalites" className="text-secondary fw-medium text-decoration-none hover-primary transition-all">Fonctionnalités</a>
             <a href="#statistiques" className="text-secondary fw-medium text-decoration-none hover-primary transition-all">Impact</a>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <Link to={dashboardUrl} className="btn-premium rounded-pill px-4" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-dark fw-bold text-decoration-none d-none d-sm-inline hover-primary transition-all px-2">
                  Connexion
                </Link>
                <Link to="/register" className="btn-premium rounded-pill px-4" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Mesh Gradient) ── */}
      <section className="bg-gradient-mesh text-center" style={{ padding: '8rem 1rem 6rem 1rem', marginTop: '-5rem', paddingTop: '10rem', borderBottomLeftRadius: '50px', borderBottomRightRadius: '50px', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <div className="container fade-in-up">
          {/* Badge */}
          <div className="d-inline-flex mx-auto align-items-center gap-2 px-4 py-2 rounded-pill mb-4 glass-panel border-white shadow-sm fw-bold" style={{ color: 'var(--color-primary)' }}>
            <span className="bg-primary rounded-circle d-inline-block shadow-glow" style={{width: '8px', height: '8px', boxShadow: '0 0 10px var(--color-primary)'}}></span>
            Excellence Universitaire 2.0
          </div>

          <h1 className="fw-bold text-dark mb-4 lh-sm" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '-1px' }}>
            Apprenez à votre <span className="text-gradient">rythme</span>,<br/>
            progressez à votre <span className="text-gradient">niveau</span>
          </h1>

          <p className="text-muted mx-auto mb-5 fs-5" style={{ maxWidth: '650px', lineHeight: '1.6' }}>
            Découvrez une plateforme de cours repensée pour vous. Des ressources interactives, 
            des outils de suivi avancés et une communauté d'apprentissage florissante.
          </p>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-2">
            {user ? (
              <Link to={dashboardUrl} className="btn-premium rounded-pill" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Mon Espace d'Apprentissage
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="ms-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-premium rounded-pill" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                  Commencer gratuitement
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="ms-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link to="/login" className="btn rounded-pill bg-white fw-bold shadow-sm hover-lift" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', color: 'var(--text-dark)', border: '2px solid var(--border-light)' }}>
                  J'ai déjà un compte
                </Link>
              </>
            )}
          </div>
          
          {/* Trust indicators */}
          <div className="mt-5 pt-4 d-flex align-items-center justify-content-center gap-3 opacity-75">
             <div className="d-flex" style={{ marginLeft: '10px' }}>
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="rounded-circle border border-2 border-white overflow-hidden shadow-sm" style={{ width: '36px', height: '36px', marginLeft: '-10px', background: `hsl(${200 + i*20}, 70%, 85%)` }}></div>
               ))}
             </div>
             <div className="text-start lh-sm">
                <div className="fw-bold text-dark">Rejoint par</div>
                <div className="small text-muted">+12 000 étudiants</div>
             </div>
          </div>
        </div>
      </section>

      {/* ── Statistiques (Dark Mode Premium) ── */}
      <section id="statistiques" className="py-5" style={{ marginTop: '2rem' }}>
        <div className="container py-4">
          <div className="bg-gradient-dark rounded-4 shadow-xl overflow-hidden position-relative p-5">
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-5.275 5.275-.83-.83 5.275-5.275zm-9.336 0l.83.83-11.458 11.458-.83-.83 11.458-11.458zm-9.335 0l.83.83-17.643 17.643-.83-.83 17.643-17.643z\' fill=\'%23ffffff\' fill-rule=\'evenodd\' fill-opacity=\'0.05\'/%3E%3C/svg%3E")', backgroundSize: '60px' }}></div>
            
            <div className="row text-center position-relative z-index-1">
              {stats.map((s) => (
                <div key={s.label} className="col-6 col-md-3 mb-4 mb-md-0 position-relative">
                  <div className="display-5 fw-bold text-white mb-2">{s.valeur}</div>
                  <div className="fw-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{s.label}</div>
                  {/* Divider for md+ */}
                  <div className="d-none d-md-block position-absolute top-25 end-0 h-50" style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités (Glass Cards) ── */}
      <section id="fonctionnalites" className="container py-5 mt-4 flex-grow-1">
        <div className="text-center mb-5 fade-in-up">
          <span className="text-primary fw-bold text-uppercase tracking-wide small mb-2 d-inline-block">L'expérience premium</span>
          <h2 className="display-6 fw-bold text-dark mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            Des outils performants combinés à une interface fluide pour accélérer votreapprentissage.
          </p>
        </div>

        <div className="row g-4 mt-2">
          {features.map((f, i) => (
            <div key={f.titre} className="col-12 col-md-6 col-lg-3">
              <div className="glass-panel text-start p-4 h-100 hover-lift d-flex flex-column" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="d-flex align-items-center justify-content-center mb-4 rounded-3 shadow-sm" style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', color: 'var(--color-primary)' }}>
                  {f.icon}
                </div>
                <h3 className="h5 fw-bold text-dark mb-3">{f.titre}</h3>
                <p className="text-muted mb-0" style={{ lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto bg-white border-top border-light py-4" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.02)' }}>
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded d-flex align-items-center justify-content-center text-white p-1" style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary))' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                     5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                     4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5
                     18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span className="fw-bold text-dark letter-spacing-tight">E-Learning Elite</span>
          </div>
          <p className="text-muted small mb-0 fw-medium">
            © 2026 Tous droits réservés. L'excellence au bout des doigts.
          </p>
          <div className="d-flex gap-4">
            {user ? (
               <Link to={dashboardUrl} className="text-muted fw-bold small text-decoration-none hover-primary">Dashboard</Link>
            ) : (
               <>
                 <Link to="/login" className="text-muted fw-bold small text-decoration-none hover-primary">Connexion</Link>
                 <Link to="/register" className="text-muted fw-bold small text-decoration-none hover-primary">Inscription</Link>
               </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}