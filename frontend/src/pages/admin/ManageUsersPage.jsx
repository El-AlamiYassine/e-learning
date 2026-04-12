import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../api/adminApi';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Gestion des Utilisateurs</h2>
        <Link to="/admin/users/add" className="btn btn-danger px-4 shadow-sm">
          + Ajouter un utilisateur
        </Link>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light text-muted">
              <tr>
                <th className="px-4 py-3">Utilisateur</th>
                <th className="py-3">Email</th>
                <th className="py-3">Rôle</th>
                <th className="py-3">Status</th>
                <th className="px-4 py-3 text-end">Options</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3 fw-bold">{user.nom} {user.prenom}</td>
                  <td className="py-3 text-muted">{user.email}</td>
                  <td className="py-3">
                    <span className={`badge rounded-pill ${user.role === 'ROLE_ADMIN' ? 'bg-danger text-white' : user.role === 'ROLE_TEACHER' ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                      {user.role?.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`badge bg-opacity-10 ${user.actif ? 'bg-success text-success' : 'bg-secondary text-secondary'}`}>
                      {user.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
