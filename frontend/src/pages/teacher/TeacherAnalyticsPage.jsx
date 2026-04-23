import React, { useState, useEffect } from 'react';
import { getTeacherStats } from '../../api/teacherApi';

export default function TeacherAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getTeacherStats();
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonthIdx = new Date().getMonth();
  const displayMonths = [];
  for (let i = 11; i >= 0; i--) {
    let idx = (currentMonthIdx - i + 12) % 12;
    displayMonths.push(months[idx]);
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Statistiques & Analyses</h2>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Revenus mensuels (€)</h5>
            {/* Visual placeholder for a chart */}
            <div className="d-flex align-items-end justify-content-between gap-2 px-2" style={{ height: '240px' }}>
              {stats?.monthlyRevenues?.map((h, i) => (
                <div 
                  key={i} 
                  className="bg-success rounded-top flex-grow-1" 
                  style={{ 
                    height: `${Math.min(h, 240)}px`, 
                    opacity: 0.7,
                    transition: 'height 0.5s ease'
                  }}
                  title={`${h} €`}
                ></div>
              )) || months.map((_, i) => <div key={i} className="bg-light rounded-top flex-grow-1" style={{ height: '20px' }}></div>)}
            </div>
            <div className="d-flex justify-content-between small text-muted mt-3 font-monospace">
              {displayMonths.map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Engagement (%)</h5>
            <div className="text-center py-4">
              <div className="position-relative d-inline-block">
                <svg width="150" height="150" viewBox="0 0 36 36">
                  <path fill="none" stroke="#eee" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    fill="none" 
                    stroke="#198754" 
                    strokeWidth="3" 
                    strokeDasharray={`${stats?.engagement || 0}, 100`} 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <h2 className="fw-bold mb-0">{stats?.engagement || 0}%</h2>
                </div>
              </div>
              <p className="text-muted mt-4 small px-3">
                L'engagement moyen de vos étudiants est de <strong>{stats?.engagement || 0}%</strong> basé sur la complétion des leçons.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Cours le plus suivi</h6>
            <h4 className="fw-bold fs-5 mb-0">{stats?.topCourse || "N/A"}</h4>
            <span className="small text-success fw-bold">{stats?.totalStudents || 0} inscrits au total</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Note moyenne globale</h6>
            <h4 className="fw-bold fs-3 mb-0">{stats?.averageRating || 0} / 5</h4>
            <span className="small text-muted">Sur {stats?.totalReviews || 0} avis</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Total des revenus</h6>
            <h4 className="fw-bold fs-3 mb-0">{stats?.totalRevenue?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</h4>
            <span className="small text-success fw-bold">{stats?.totalCourses || 0} cours créés</span>
          </div>
        </div>
      </div>
    </div>
  );
}
