import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin  } from '@react-oauth/google';
import axios from 'axios';

export default function LoginPage() {
  const { login, user, setSessionFromResponse } = useAuth();
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
  const googleLogin = useGoogleLogin({
    flow: 'implicit', // simple pour commencer
    onSuccess: async (tokenResponse) => {
      try {
        const tokenToSend = tokenResponse.access_token || tokenResponse.credential;
        if (!tokenToSend) {
          console.error('Google token missing in tokenResponse:', tokenResponse);
          setError('Jeton Google introuvable. Veuillez réessayer.');
          return;
        }

        const res = await axios.post('http://localhost:8080/api/auth/google', {
          token: tokenToSend,
        });

  if (setSessionFromResponse) setSessionFromResponse(res.data);
  else login(res.data);

      } catch (err) {
        console.error('Google login error:', err);
        // Prefer server-provided message when available
        const serverMsg = err.response?.data?.message || err.response?.data || null;
        if (serverMsg) {
          setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
        } else {
          setError(err.message || 'Erreur connexion Google');
        }
      }
    },
    onError: () => {
      setError("Connexion Google échouée");
    },
  });

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
          onClick={() => googleLogin()}
          className="btn w-100 py-3 d-flex align-items-center justify-content-center gap-3"
          style={{
            background: 'white',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.25s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width="22"
          />
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
