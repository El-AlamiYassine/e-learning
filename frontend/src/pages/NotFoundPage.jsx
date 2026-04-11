import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="text-center">
        {/* Decorative elements */}
        <div className="position-relative d-inline-block mb-4">
          <h1 className="display-1 fw-bold text-dark m-0" style={{ fontSize: '8rem', textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            4<span className="text-primary d-inline-block hover-lift">0</span>4
          </h1>
          <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 rounded-circle bg-primary opacity-10 filter-blur z-n1" style={{ filter: 'blur(40px)' }}></div>
        </div>
        
        <h2 className="fw-bold mb-3">Oups ! Page introuvable.</h2>
        <p className="text-secondary mb-5 mx-auto" style={{ maxWidth: '500px' }}>
          Il semblerait que vous vous soyez perdu en chemin. La page que vous recherchez a peut-être été déplacée, supprimée, ou n'a simplement jamais existé.
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <button onClick={() => window.history.back()} className="btn btn-outline-secondary px-4 py-2 hover-lift fw-medium rounded-pill">
            Revenir en arrière
          </button>
          <Link to="/" className="btn btn-primary px-4 py-2 hover-lift fw-medium shadow-sm rounded-pill d-inline-flex align-items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
