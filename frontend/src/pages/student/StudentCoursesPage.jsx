import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';
import { generateCertificatePDF } from '../../utils/CertificatePdf';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getEnrolledCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching enrolled courses:', err);
        setError('Impossible de charger vos cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
      <div className="d-flex justify-content-between align-items-end mb-5 fade-in-up">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Mes <span className="gradient-text">Cours</span></h2>
          <p className="text-secondary mb-0">Continuez votre aventure d'apprentissage là où vous vous êtes arrêté.</p>
        </div>
        <Link to="/student/dashboard/catalog" className="btn-premium rounded-pill px-4 py-2 shadow-sm text-decoration-none d-flex align-items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Catalogue
        </Link>
      </div>

      {/* Course Grid */}
      <div className="row g-4">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div 
                className="glass-panel h-100 overflow-hidden hover-lift border-0 shadow-sm d-flex flex-column fade-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Course Image Wrapper */}
                <div className="position-relative">
                  <img 
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'} 
                    className="w-100" 
                    alt={course.title} 
                    style={{ height: '180px', objectFit: 'cover' }} 
                  />
                  {course.progressPercentage === 100 && (
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-success rounded-pill px-3 py-2 shadow-sm border border-white border-2">
                        Complété ✨
                      </span>
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="position-absolute bottom-0 start-0 w-100 h-50" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h5 className="fw-bold mb-2 text-dark line-clamp-2">{course.title}</h5>
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-light rounded-circle p-1 me-2" style={{ width: '24px', height: '24px' }}>
                       <svg width="16" height="16" fill="currentColor" className="text-secondary" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/></svg>
                    </div>
                    <span className="text-secondary small">{course.instructorName}</span>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-bold text-dark">{course.progressPercentage}% complété</span>
                      <span className="text-secondary small">{course.completedLessons}/{course.totalLessons} leçons</span>
                    </div>
                    <div className="progress rounded-pill mb-4" style={{ height: '6px', background: 'rgba(0,0,0,0.05)' }}>
                      <div 
                        className={`progress-bar rounded-pill transition-all ${course.progressPercentage === 100 ? 'bg-success' : 'bg-primary'}`} 
                        role="progressbar" 
                        style={{ 
                          width: `${course.progressPercentage}%`,
                          boxShadow: course.progressPercentage === 100 ? '0 0 10px rgba(40, 167, 69, 0.4)' : 'none'
                        }}
                      ></div>
                    </div>

                    <div className="d-flex gap-2">
                      <Link 
                        to={`/student/course/${course.id}`} 
                        className={`btn ${course.progressPercentage === 100 ? 'btn-outline-primary' : 'btn-primary'} rounded-pill py-2 flex-grow-1 shadow-sm fw-bold border-0`}
                        style={{ 
                          background: course.progressPercentage !== 100 ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'transparent',
                          color: course.progressPercentage !== 100 ? 'white' : 'var(--color-primary)',
                          border: course.progressPercentage === 100 ? '2px solid var(--color-primary)' : 'none'
                        }}
                      >
                        {course.progressPercentage === 100 ? 'Revoir' : 'Continuer'}
                      </Link>

                      {course.progressPercentage === 100 && (
                        <button 
                          onClick={() => handleDownloadCertificate(course.id)}
                          className="btn btn-premium rounded-pill px-3 shadow-sm d-flex align-items-center justify-content-center"
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
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 fade-in-up">
            <div className="glass-panel p-5 d-inline-block border-0 shadow-sm">
              <div className="mb-4 d-flex align-items-center justify-content-center mx-auto rounded-circle bg-primary bg-opacity-10" style={{ width: '80px', height: '80px' }}>
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="fw-bold mb-2 text-dark">L'aventure commence ici !</h4>
              <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '350px' }}>Vous n'êtes pas encore inscrit à un cours. Explorez notre catalogue pour trouver votre prochaine passion.</p>
              <Link to="/student/dashboard/catalog" className="btn-premium rounded-pill px-5 py-2 shadow-sm text-decoration-none">
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
