import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeacherStats } from '../../api/teacherApi';

export default function TeacherDashboardOverview() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    averageRating: 0,
    activeCourses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getTeacherStats();
        setStats(res.data);
      } catch (err) {
        console.error('Erreur stats teacher', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-4 text-center">Chargement des statistiques...</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4 text-primary">Tableau de Bord Enseignant</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 bg-white hover-up overflow-hidden">
            <div className="card-body p-4">
              <div className="text-muted small fw-bold text-uppercase mb-2">Mes Cours</div>
              <h2 className="mb-0 fw-bold display-6">{stats.totalCourses}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 bg-white hover-up overflow-hidden">
            <div className="card-body p-4">
              <div className="text-muted small fw-bold text-uppercase mb-2">Élèves inscrits</div>
              <h2 className="mb-0 fw-bold display-6">{stats.totalStudents}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 bg-white hover-up overflow-hidden">
            <div className="card-body p-4">
              <div className="text-muted small fw-bold text-uppercase mb-2">Note moyenne</div>
              <h2 className="mb-0 fw-bold display-6">★ {stats.averageRating}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100 bg-white hover-up overflow-hidden">
            <div className="card-body p-4">
              <div className="text-muted small fw-bold text-uppercase mb-2">Cours Actifs</div>
              <h2 className="mb-0 fw-bold display-6">{stats.activeCourses}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4 bg-white p-4">
        <div className="card-body px-0">
          <h5 className="fw-bold mb-4">Derniers cours ajoutés</h5>
          {stats.totalCourses === 0 ? (
            <div className="text-center py-5">
              <span className="text-muted">Vous n'avez pas encore publié de cours.</span>
            </div>
          ) : (
            <p className="text-success">Consultez l'onglet "Mes Cours" pour voir la liste complète.</p>
          )}
        </div>
      </div>

      <Link to="/teacher/courses/create" className="btn btn-primary btn-lg px-5 py-3 fw-bold shadow-sm rounded-pill d-flex align-items-center gap-2 text-decoration-none w-fit">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        Créer un nouveau cours
      </Link>
    </div>
  );
}
