import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', motDePasse: '', role: 'ROLE_STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 mt-1 text-sm">Rejoignez la plateforme E-Learning</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                          rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text" name="prenom" value={form.prenom}
                onChange={handleChange} required placeholder="Prénom"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text" name="nom" value={form.nom}
                onChange={handleChange} required placeholder="Nom"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="vous@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password" name="motDePasse" value={form.motDePasse}
              onChange={handleChange} required placeholder="Minimum 8 caractères"
              minLength={8}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Je suis</label>
            <select
              name="role" value={form.role} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-white transition"
            >
              <option value="ROLE_STUDENT">Étudiant</option>
              <option value="ROLE_TEACHER">Professeur</option>
            </select>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-medium py-2.5 rounded-lg text-sm
                       transition duration-200 mt-2"
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}