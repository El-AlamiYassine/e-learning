import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { valeur: '500+', label: 'Cours disponibles' },
  { valeur: '12k+', label: 'Étudiants inscrits' },
  { valeur: '80+',  label: 'Professeurs experts' },
  { valeur: '95%',  label: 'Taux de satisfaction' },
];

const features = [
  {
    titre: 'Cours en PDF',
    desc: 'Accédez à tous vos cours en format PDF, téléchargeables à tout moment.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0d6efd" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
             a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19
             a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    titre: 'Quiz interactifs',
    desc: 'Testez vos connaissances avec des quiz et obtenez vos résultats instantanément.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0d6efd" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7
             a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2
             M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
  },
  {
    titre: 'Suivi de progression',
    desc: 'Visualisez votre avancement et restez motivé tout au long de votre parcours.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0d6efd" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2
             a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10
             m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2
             a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    titre: 'Certificats',
    desc: 'Obtenez un certificat officiel à la fin de chaque cours complété avec succès.',
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#0d6efd" strokeWidth="1.8">
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
    <div className="bg-white">

      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom sticky-top py-3">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <div className="bg-primary rounded d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                   stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                     5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                     4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5
                     18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span className="fs-5 fw-semibold text-dark">E-Learning</span>
          </a>

          {/* Liens nav */}
          <div className="d-none d-md-flex align-items-center gap-4">
             <a href="#fonctionnalites" className="text-secondary text-decoration-none hover-primary">Fonctionnalités</a>
             <a href="#statistiques" className="text-secondary text-decoration-none hover-primary">Statistiques</a>
          </div>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <Link to={dashboardUrl} className="btn btn-primary fw-medium rounded-3 px-4">
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-link text-dark text-decoration-none fw-medium d-none d-sm-inline">
                  Se connecter
                </Link>
                <Link to="/register" className="btn btn-primary fw-medium rounded-3 px-4">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="container text-center py-5 my-5">
        {/* Badge */}
        <div className="d-inline-flex mx-auto align-items-center gap-2 bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill mb-4 border border-primary border-opacity-25 small fw-medium">
          <span className="bg-primary rounded-circle d-inline-block" style={{width: '8px', height: '8px'}}></span>
          Plateforme d'apprentissage universitaire
        </div>

        <h1 className="display-4 fw-bold text-dark mb-4 lh-base">
          Apprenez à votre <span className="text-primary">rythme</span>,<br/>
          progressez à votre <span className="text-primary">niveau</span>
        </h1>

        <p className="lead text-secondary mx-auto mb-5" style={{ maxWidth: '600px' }}>
          Accédez à des centaines de cours universitaires, des quiz interactifs
          et obtenez des certificats reconnus — tout en un seul endroit.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          {user ? (
            <Link to={dashboardUrl} className="btn btn-primary btn-lg fw-semibold px-4 py-3 shadow-sm rounded-3">
              Mon Espace d'Apprentissage
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg fw-semibold px-4 py-3 shadow-sm rounded-3">
                Commencer gratuitement
              </Link>
              <Link to="/login" className="btn btn-outline-secondary btn-lg fw-semibold px-4 py-3 bg-white text-dark rounded-3 border-light-subtle">
                J'ai déjà un compte
              </Link>
            </>
          )}
        </div>

        <p className="mt-5 text-muted small">
          Déjà <span className="fw-semibold text-dark">12 000+</span> étudiants nous font confiance
        </p>
      </section>

      {/* ── Statistiques ── */}
      <section id="statistiques" className="bg-primary py-5">
        <div className="container py-4">
          <div className="row text-center text-white">
            {stats.map((s) => (
              <div key={s.label} className="col-6 col-md-3 mb-4 mb-md-0">
                <div className="display-6 fw-bold mb-1">{s.valeur}</div>
                <div className="small text-white-50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section id="fonctionnalites" className="container py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-3">Tout ce dont vous avez besoin</h2>
          <p className="text-secondary small mx-auto" style={{ maxWidth: '500px' }}>
            Une plateforme complète conçue pour les étudiants universitaires
            et leurs professeurs.
          </p>
        </div>

        <div className="row g-4">
          {features.map((f) => (
            <div key={f.titre} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 border border-light-subtle shadow-sm rounded-4 text-start p-4 bg-white">
                <div className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center mb-3 text-primary" style={{ width: '48px', height: '48px' }}>
                  {f.icon}
                </div>
                <h3 className="h6 fw-bold text-dark mb-2">{f.titre}</h3>
                <p className="text-secondary small mb-0 lh-lg">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-light border-top border-light-subtle">
        <div className="container text-center py-5 my-4">
          <h2 className="fw-bold text-dark mb-3">Prêt à commencer ?</h2>
          <p className="text-secondary mb-5 mx-auto small" style={{ maxWidth: '400px' }}>
            {user ? "Reprenez là où vous vous étiez arrêté dans vos modules interactifs." : "Créez votre compte étudiant gratuitement et accédez immédiatement à tous les cours."}
          </p>
          {user ? (
            <Link to={dashboardUrl} className="btn btn-primary fw-semibold px-5 py-3 rounded-3 shadow-sm">
              Continuer mon apprentissage
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary fw-semibold px-5 py-3 rounded-3 shadow-sm">
              Créer mon compte gratuitement
            </Link>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-top border-light-subtle py-4">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary rounded px-1 text-white d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"
                   stroke="white" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                     5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                     4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5
                     18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span className="small fw-semibold text-secondary">E-Learning</span>
          </div>
          <p className="text-muted small mb-0">
            © 2024 E-Learning. Plateforme universitaire.
          </p>
          <div className="d-flex gap-4">
            {user ? (
               <Link to={dashboardUrl} className="text-secondary small text-decoration-none">Mon Dashboard</Link>
            ) : (
               <>
                 <Link to="/login" className="text-secondary small text-decoration-none">Connexion</Link>
                 <Link to="/register" className="text-secondary small text-decoration-none">Inscription</Link>
               </>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}