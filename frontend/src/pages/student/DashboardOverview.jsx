import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/studentApi';
import { generateCertificatePDF } from '../../utils/CertificatePdf';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getDashboardSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('Impossible de charger les données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleDownloadCertificate = async (courseId) => {
    try {
      setDownloadingCert(courseId);
      const certData = await studentApi.getCertificate(courseId);
      generateCertificatePDF(certData);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Erreur lors de la génération du certificat. Veuillez réessayer.');
    } finally {
      setDownloadingCert(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h3 fw-bold mb-1">
            Rebonjour, <span className="gradient-text">{user?.prenom}</span> 👋
          </h1>
          <p className="text-secondary mb-0">Voici ce qui se passe dans votre apprentissage aujourd'hui.</p>
        </div>
        <div className="d-none d-sm-block fade-in-up">
          <Link to="/student/dashboard/catalog" className="btn-premium rounded-pill px-4 py-2 shadow-sm text-decoration-none">
            Explorer les cours
          </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-panel p-4 hover-lift h-100 d-flex flex-column border-0">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 me-3">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h6 className="text-secondary fw-semibold m-0">Cours en cours</h6>
            </div>
            <h2 className="display-5 fw-bold m-0 mt-auto text-dark">{summary?.enrolledCoursesCount || 0}</h2>
          </div>
        </div>
        
        <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel p-4 hover-lift h-100 d-flex flex-column border-0">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3 me-3">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h6 className="text-secondary fw-semibold m-0">Cours terminés</h6>
            </div>
            <h2 className="display-5 fw-bold m-0 mt-auto text-dark">{summary?.completedCoursesCount || 0}</h2>
          </div>
        </div>

        <div className="col-12 col-md-4 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-panel p-4 flex-column hover-lift h-100 border-0 d-flex align-items-start position-relative overflow-hidden" 
               style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%)' }}>
             {/* Decorative circle */}
            <div className="position-absolute bg-white rounded-circle opacity-10" style={{ width: '150px', height: '150px', top: '-30px', right: '-30px' }}></div>
            
            <h6 className="text-white fw-semibold mb-3">Taux d'assiduité</h6>
            <h2 className="display-5 fw-bold text-white mb-2 z-1">{summary?.averageAttendance || 0}%</h2>
            <div className="w-100 bg-white bg-opacity-25 rounded-pill h-25 mt-auto z-1" style={{ height: '6px' }}>
              <div className="bg-white rounded-pill h-100" style={{ width: `${summary?.averageAttendance || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Upcomings */}
      <div className="row g-4">
        {/* Left Col: Recents */}
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-dark">Poursuivre mon apprentissage</h5>
            <button className="btn btn-link text-decoration-none fw-medium p-0">Tout voir</button>
          </div>
          
          <div className="d-flex flex-column gap-3">
            {summary?.recentCourses && summary.recentCourses.length > 0 ? (
              summary.recentCourses.map(course => (
                <div key={course.id} className="glass-panel p-3 d-flex align-items-center hover-lift border-0 shadow-sm fade-in-up">
                  <div className="rounded-3 bg-light overflow-hidden me-3" style={{ width: '100px', height: '70px' }}>
                    <img 
                      src={course.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80"} 
                      alt={course.title} 
                      className="w-100 h-100 object-fit-cover" 
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark">{course.title}</h6>
                    <p className="text-secondary small mb-2">Avancement : Module {course.completedLessons}/{course.totalLessons}</p>
                    <div className="progress rounded-pill bg-light" style={{ height: '6px' }}>
                      <div className="progress-bar bg-primary rounded-pill" style={{ width: `${course.progressPercentage}%` }}></div>
                    </div>
                  </div>
                  <Link 
                    to={`/student/course/${course.id}`} 
                    className="btn-premium rounded-circle d-flex align-items-center justify-content-center ms-4 shadow-sm flex-shrink-0"
                    style={{ width: '42px', height: '42px', padding: 0 }}
                    title={course.progressPercentage === 100 ? 'Revoir le cours' : 'Continuer le cours'}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                    </svg>
                  </Link>

                  {course.progressPercentage === 100 && (
                    <button 
                      onClick={() => handleDownloadCertificate(course.id)}
                      className="btn btn-outline-success rounded-circle d-flex align-items-center justify-content-center ms-2 shadow-sm flex-shrink-0"
                      style={{ width: '42px', height: '42px', padding: 0 }}
                      title="Télécharger le certificat"
                      disabled={downloadingCert === course.id}
                    >
                      {downloadingCert === course.id ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z"/>
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">Vous n'êtes inscrit à aucun cours pour le moment.</p>
                <button className="btn btn-primary rounded-pill px-4">Explorer les cours</button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Timeline/Deadlines */}
        <div className="col-12 col-lg-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-panel p-4 border-0 shadow-sm h-100">
            <h5 className="fw-bold mb-4 text-dark">Prochainement</h5>
            <div className="text-center py-4">
              <p className="text-muted small">Aucun événement à venir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
