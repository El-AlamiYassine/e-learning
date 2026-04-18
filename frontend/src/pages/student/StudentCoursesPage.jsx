import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5 fade-in-up">
        <h2 className="fw-bold mb-0 text-dark">Mes Cours</h2>
        <Link to="/student/dashboard/catalog" className="btn-premium rounded-pill px-4 shadow-sm text-decoration-none">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Catalogue
        </Link>
      </div>

      <div className="row g-4">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="glass-panel h-100 overflow-hidden hover-lift fade-in-up" style={{ animationDelay: `${0.1}s` }}>
                <img 
                  src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop'} 
                  className="card-img-top" 
                  alt={course.title} 
                  style={{ height: '160px', objectFit: 'cover' }} 
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <p className="text-muted small mb-3">Par {course.instructorName}</p>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${course.progressPercentage === 100 ? 'bg-success' : 'bg-primary'}`} 
                      role="progressbar" 
                      style={{ width: `${course.progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="small fw-semibold text-secondary">{course.progressPercentage}% complété</span>
                    <Link to={`/student/course/${course.id}`} className="btn-premium rounded-pill py-1 px-3 shadow-sm text-decoration-none" style={{ fontSize: '0.9rem' }}>
                      {course.progressPercentage === 100 ? 'Revoir' : 'Continuer'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 fade-in-up">
            <div className="glass-panel p-5 d-inline-block">
              <div className="mb-4 text-primary opacity-75">
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="fw-bold mb-3 text-dark">Aucun cours trouvé</h4>
              <p className="text-secondary mb-4">Vous n'êtes pas encore inscrit à un cours.</p>
              <Link to="/student/dashboard/catalog" className="btn-premium rounded-pill px-4 shadow-sm text-decoration-none">
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
