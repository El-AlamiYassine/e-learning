import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call for password reset
    setSubmitted(true);
  };

  return (
    <div className="vh-100 bg-light d-flex align-items-center justify-content-center px-3">
      <div className="bg-white rounded shadow-sm w-100 p-4 p-md-5 position-relative" style={{ maxWidth: '450px' }}>

        <div className="mb-3 text-start">
          <Link to="/login" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="small fw-medium">Retour à la connexion</span>
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="h4 fw-bold text-dark">Mot de passe oublié</h1>
          <p className="text-secondary small mt-1">
            Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {submitted ? (
          <div className="alert alert-success small text-center" role="alert">
            Si un compte correspond à cette adresse, vous recevrez un email contenant les instructions de réinitialisation.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label small fw-medium">Adresse email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2">
              Envoyer le lien
            </button>
          </form>
        )}

        <p className="text-center text-secondary small mt-4 mb-0">
          Besoin d'aide ?{' '}
          <a href="#" className="text-primary text-decoration-none fw-medium">
            Contactez le support
          </a>
        </p>

      </div>
    </div>
  );
}
