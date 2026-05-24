import React, { useState, useEffect } from 'react';
import { getTeacherStats } from '../../api/teacherApi';

export default function TeacherAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(null);

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

  // Use monthlyEnrollments instead of revenues for a free app
  const monthlyEnrollments = stats?.monthlyEnrollments || stats?.monthlyRevenues || Array(12).fill(0);
  const maxEnrollments = Math.max(...monthlyEnrollments, 10); // ensure we don't divide by 0
  
  // Custom SVG Icons
  const Icons = {
    Course: () => (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
      </svg>
    ),
    Star: () => (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    Users: () => (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Tableau de bord Analytique</h2>
          <p className="text-muted mb-0">Analysez vos performances et l'engagement de vos étudiants.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', borderRadius: '15px' }}>
            <div className="card-body p-4 d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-4" style={{ width: '60px', height: '60px', opacity: 0.9 }}>
                <Icons.Course />
              </div>
              <div>
                <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Cours Populaire</h6>
                <h4 className="fw-bold mb-0 text-dark">{stats?.topCourse || "N/A"}</h4>
                <div className="small text-primary fw-bold mt-1">⭐ {stats?.totalStudents || 0} Inscrits</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', borderRadius: '15px' }}>
            <div className="card-body p-4 d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-white text-warning me-4" style={{ width: '60px', height: '60px', opacity: 0.9 }}>
                <Icons.Star />
              </div>
              <div>
                <h6 className="text-white mb-1 text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Note Moyenne</h6>
                <h4 className="fw-bold mb-0 text-white">{stats?.averageRating || 0} / 5</h4>
                <div className="small text-white mt-1 fw-medium">{stats?.totalReviews || 0} Avis laissés</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', borderRadius: '15px' }}>
            <div className="card-body p-4 d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center bg-white text-success me-4" style={{ width: '60px', height: '60px', opacity: 0.9 }}>
                <Icons.Users />
              </div>
              <div>
                <h6 className="text-white mb-1 text-uppercase fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Total des Cours</h6>
                <h4 className="fw-bold mb-0 text-white">{stats?.totalCourses || 0}</h4>
                <div className="small text-white mt-1 fw-medium">Actifs sur la plateforme</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Bar Chart */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Évolution des Inscriptions</h5>
              <span className="badge bg-light text-dark border px-3 py-2">Derniers 12 mois</span>
            </div>
            
            <div className="d-flex align-items-end justify-content-between gap-3 px-2 position-relative" style={{ height: '280px', borderBottom: '2px solid #f1f5f9' }}>
              {/* Background grid lines */}
              <div className="position-absolute w-100 border-top" style={{ top: '0', zIndex: 0, borderColor: '#f1f5f9' }}></div>
              <div className="position-absolute w-100 border-top" style={{ top: '50%', zIndex: 0, borderColor: '#f1f5f9' }}></div>
              
              {monthlyEnrollments.map((h, i) => {
                const heightPercentage = Math.max((h / maxEnrollments) * 100, 2); 
                const isHovered = hoverIndex === i;
                return (
                  <div 
                    key={i}
                    className="flex-grow-1 position-relative"
                    style={{ height: '100%', zIndex: 1 }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div 
                      className="w-100 rounded-top position-absolute bottom-0"
                      style={{ 
                        height: `${heightPercentage}%`, 
                        background: isHovered ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%)',
                        transition: 'all 0.3s ease',
                        boxShadow: isHovered ? '0 10px 15px -3px rgba(59, 130, 246, 0.5)' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="position-absolute top-0 start-50 translate-middle-x bg-dark text-white rounded px-2 py-1 small shadow" style={{ marginTop: '-35px', whiteSpace: 'nowrap', zIndex: 10 }}>
                          {h} inscrits
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="d-flex justify-content-between mt-3 text-muted" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
              {displayMonths.map(m => <span key={m} style={{ width: '100%', textAlign: 'center' }}>{m}</span>)}
            </div>
          </div>
        </div>

        {/* Engagement Donut */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '15px' }}>
            <h5 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>Taux d'Engagement</h5>
            <div className="text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div className="position-relative d-inline-block">
                <svg width="200" height="200" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background Circle */}
                  <path fill="none" stroke="#f1f5f9" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Foreground Circle */}
                  <path 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray={`${stats?.engagement || 0}, 100`} 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h2 className="fw-bolder mb-0" style={{ color: '#4c1d95', fontSize: '2.5rem' }}>
                    {stats?.engagement || 0}%
                  </h2>
                </div>
              </div>
              <p className="text-muted mt-4 mb-0 px-2" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                L'engagement moyen de vos étudiants est de <strong style={{ color: '#7c3aed' }}>{stats?.engagement || 0}%</strong> basé sur la progression et la complétion des leçons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
