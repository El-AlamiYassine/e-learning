import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'ROLE_TEACHER') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const isEmailTouched = form.email.length > 0;
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const emailInvalid = isEmailTouched && !isEmailFormatValid;
  const emailValid = isEmailTouched && isEmailFormatValid;

  const isPasswordTouched = form.motDePasse.length > 0;
  const passwordInvalid = isPasswordTouched && form.motDePasse.length < 8;
  const passwordValid = isPasswordTouched && !passwordInvalid;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in-up">
        
        <div className="mb-4 text-start">
          <Link to="/" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-lift" style={{ transition: 'all 0.2s' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="small fw-semibold">Retour à l'accueil</span>
          </Link>
        </div>

        <div className="text-center mb-5">
          <h1 className="h3 fw-bold text-gradient mb-2">Bienvenue</h1>
          <p className="text-muted small">Connectez-vous pour accéder à vos cours</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4 d-flex align-items-center gap-2" role="alert">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="small fw-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label small fw-bold text-dark mb-2">Adresse Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="vous@email.com"
              className={`input-premium ${emailInvalid ? 'border-danger' : ''} ${emailValid ? 'border-success' : ''}`}
            />
            {emailInvalid && <div className="text-danger small mt-1 fw-medium">Format d'email invalide</div>}
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label small fw-bold text-dark mb-0">Mot de passe</label>
              <Link to="/forgot-password" className="small text-decoration-none fw-semibold" style={{ color: 'var(--color-primary)' }}>
                Mot de passe oublié ?
              </Link>
            </div>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={`input-premium ${passwordInvalid ? 'border-danger' : ''} ${passwordValid ? 'border-success' : ''}`}
            />
            {passwordInvalid && <div className="text-danger small mt-1 fw-medium">Minimum 8 caractères requis</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-100 py-3 mt-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="d-flex align-items-center my-4 text-muted">
          <hr className="flex-grow-1 border-light opacity-50 m-0" />
          <span className="mx-3 small fw-semibold">OU</span>
          <hr className="flex-grow-1 border-light opacity-50 m-0" />
        </div>

        <button
          type="button"
          onClick={() => alert("Fonctionnalité 'Continuer avec Google' à venir !")}
          className="btn w-100 py-3 d-flex align-items-center justify-content-center gap-2"
          style={{ background: 'white', color: 'var(--text-dark)', border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontWeight: '600', transition: 'all 0.3s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.654-3.342-11.127-8.02l-6.6 5.064C9.554 39.882 16.273 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
          </svg>
          Continuer avec Google
        </button>

        <p className="text-center text-muted small mt-4 mb-0 fw-medium">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-decoration-none fw-bold" style={{ color: 'var(--color-primary)' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
