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
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3 py-5">
      <div className="bg-white rounded shadow-sm w-100 p-4 p-md-5 position-relative" style={{ maxWidth: '500px' }}>

        <div className="mb-3 text-start">
          <Link to="/" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="small fw-medium">Accueil</span>
          </Link>
        </div>

        <div className="text-center mb-4">
          <h1 className="h4 fw-bold text-dark">Créer un compte</h1>
          <p className="text-secondary small mt-1">Rejoignez la plateforme E-Learning</p>
        </div>

        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label className="form-label small fw-medium">Prénom</label>
              <input
                type="text" name="prenom" value={form.prenom}
                onChange={handleChange} required placeholder="Prénom"
                className="form-control"
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label small fw-medium">Nom</label>
              <input
                type="text" name="nom" value={form.nom}
                onChange={handleChange} required placeholder="Nom"
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="vous@email.com"
              className={`form-control ${emailInvalid ? 'is-invalid' : ''} ${emailValid ? 'is-valid' : ''}`}
            />
            {emailInvalid && <div className="invalid-feedback">Format d'email invalide</div>}
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium">Mot de passe</label>
            <input
              type="password" name="motDePasse" value={form.motDePasse}
              onChange={handleChange} required placeholder="Minimum 8 caractères"
              minLength={8}
              className={`form-control ${passwordInvalid ? 'is-invalid' : ''} ${passwordValid ? 'is-valid' : ''}`}
            />
            {passwordInvalid && <div className="invalid-feedback">Code faible : minimum 8 caractères requis</div>}
          </div>

          <div className="mb-4">
            <label className="form-label small fw-medium">Confirmer le mot de passe</label>
            <input
              type="password" name="confirmationMotDePasse" value={form.confirmationMotDePasse}
              onChange={handleChange} required placeholder="Confirmez votre mot de passe"
              minLength={8}
              className={`form-control ${confirmInvalid ? 'is-invalid' : ''} ${confirmValid ? 'is-valid' : ''}`}
            />
            {confirmInvalid && <div className="invalid-feedback">Les mots de passe ne correspondent pas</div>}
          </div>
          <button
            type="submit" disabled={loading}
            className="btn btn-primary w-100 py-2"
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-secondary small mt-4 mb-0">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary text-decoration-none fw-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
