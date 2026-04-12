import { useEffect, useState } from 'react';
import { getAdminStats } from '../../api/adminApi';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    pendingCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">Vue d'ensemble Administrateur</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Utilisateurs inscrits</h5>
              <h2 className="mb-0 fw-bold">{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Cours créés</h5>
              <h2 className="mb-0 fw-bold">{stats.totalCourses}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Cours en attente</h5>
              <h2 className="mb-0 fw-bold">{stats.pendingCourses}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Activité récente</h5>
          <p className="text-muted">Aucune activité récente pour le moment.</p>
        </div>
      </div>
    </div>
  );
}
