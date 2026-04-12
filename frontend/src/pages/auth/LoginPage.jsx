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
    <div className="vh-100 bg-light d-flex align-items-center justify-content-center px-3">
      <div className="bg-white rounded shadow-sm w-100 p-4 p-md-5 position-relative" style={{ maxWidth: '450px' }}>

        <div className="mb-3 text-start">
          <Link to="/" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="small fw-medium">Accueil</span>
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="h4 fw-bold text-dark">E-Learning</h1>
          <p className="text-secondary small mt-1">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="vous@email.com"
              className={`form-control ${emailInvalid ? 'is-invalid' : ''} ${emailValid ? 'is-valid' : ''}`}
            />
            {emailInvalid && <div className="invalid-feedback">Format d'email invalide</div>}
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label small fw-medium mb-0">Mot de passe</label>
              <Link to="/forgot-password" className="small text-decoration-none text-primary">
                Oublié ?
              </Link>
            </div>
            <input
              type="password"
              name="motDePasse"
              value={form.motDePasse}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={`form-control ${passwordInvalid ? 'is-invalid' : ''} ${passwordValid ? 'is-valid' : ''}`}
            />
            {passwordInvalid && <div className="invalid-feedback">Code faible : minimum 8 caractères requis</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="d-flex align-items-center my-4 text-muted">
          <hr className="flex-grow-1 m-0" />
          <span className="mx-3 small fw-medium">OU</span>
          <hr className="flex-grow-1 m-0" />
        </div>

        <button
          type="button"
          onClick={() => alert("Fonctionnalité 'Continuer avec Google' à venir !")}
          className="btn btn-outline-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
          </svg>
          <span className="fw-medium">Continuer avec Google</span>
        </button>

        <p className="text-center text-secondary small mt-4 mb-0">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-primary text-decoration-none fw-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
