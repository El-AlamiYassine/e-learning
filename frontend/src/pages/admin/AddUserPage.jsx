import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCreateUser } from '../../api/adminApi';

export default function AddUserPage() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'ROLE_STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminCreateUser(form);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="fw-bold mb-4">Ajouter un utilisateur</h2>
            
            {error && <div className="alert alert-danger mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label small fw-medium">Prénom</label>
                  <input type="text" name="prenom" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col">
                  <label className="form-label small fw-medium">Nom</label>
                  <input type="text" name="nom" className="form-control" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium">Email</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium">Mot de passe temporaire</label>
                <input type="password" name="motDePasse" className="form-control" onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-medium">Rôle</label>
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="ROLE_STUDENT">Étudiant</option>
                  <option value="ROLE_TEACHER">Enseignant</option>
                  <option value="ROLE_ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-danger px-4" disabled={loading}>
                  {loading ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
                <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/admin/users')}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
