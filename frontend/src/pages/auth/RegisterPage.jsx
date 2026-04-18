import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', motDePasse: '', confirmationMotDePasse: '', role: 'ROLE_STUDENT',
  });
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

  const isConfirmTouched = form.confirmationMotDePasse.length > 0;
  const confirmInvalid = isConfirmTouched && form.motDePasse !== form.confirmationMotDePasse;
  const confirmValid = isConfirmTouched && form.motDePasse === form.confirmationMotDePasse && passwordValid;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.motDePasse !== form.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in-up" style={{ maxWidth: '550px' }}>

        <div className="mb-4 text-start">
          <Link to="/" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-lift" style={{ transition: 'all 0.2s' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="small fw-semibold">Retour</span>
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-gradient mb-2">Créer un compte</h1>
          <p className="text-muted small">Rejoignez la plateforme E-Learning d'excellence</p>
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
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label className="form-label small fw-bold text-dark mb-2">Prénom</label>
              <input
                type="text" name="prenom" value={form.prenom}
                onChange={handleChange} required placeholder="Votre prénom"
                className="input-premium"
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-bold text-dark mb-2">Nom</label>
              <input
                type="text" name="nom" value={form.nom}
                onChange={handleChange} required placeholder="Votre nom"
                className="input-premium"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-2">Adresse Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="vous@email.com"
              className={`input-premium ${emailInvalid ? 'border-danger' : ''} ${emailValid ? 'border-success' : ''}`}
            />
            {emailInvalid && <div className="text-danger small mt-1 fw-medium">Format d'email invalide</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-2">Mot de passe</label>
            <input
              type="password" name="motDePasse" value={form.motDePasse}
              onChange={handleChange} required placeholder="Minimum 8 caractères"
              minLength={8}
              className={`input-premium ${passwordInvalid ? 'border-danger' : ''} ${passwordValid ? 'border-success' : ''}`}
            />
            {passwordInvalid && <div className="text-danger small mt-1 fw-medium">Minimum 8 caractères requis</div>}
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-dark mb-2">Confirmer le mot de passe</label>
            <input
              type="password" name="confirmationMotDePasse" value={form.confirmationMotDePasse}
              onChange={handleChange} required placeholder="Retapez votre mot de passe"
              minLength={8}
              className={`input-premium ${confirmInvalid ? 'border-danger' : ''} ${confirmValid ? 'border-success' : ''}`}
            />
            {confirmInvalid && <div className="text-danger small mt-1 fw-medium">Les mots de passe ne correspondent pas</div>}
          </div>
          
          <button
            type="submit" disabled={loading}
            className="btn-premium w-100 py-3 mt-2"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0 fw-medium">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--color-primary)' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
