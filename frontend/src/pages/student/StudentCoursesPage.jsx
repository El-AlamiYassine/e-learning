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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Mes Cours</h2>
        <Link to="/student/dashboard/catalog" className="btn btn-primary d-flex align-items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Explorer le catalogue
        </Link>
      </div>

      <div className="row g-4">
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden hover-lift">
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
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">{course.progressPercentage}% complété</span>
                    <Link to={`/student/course/${course.id}`} className="btn btn-sm btn-outline-primary px-3">
                      {course.progressPercentage === 100 ? 'Revoir' : 'Continuer'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="bg-light rounded-4 p-5 d-inline-block">
              <h4 className="fw-bold mb-3">Aucun cours trouvé</h4>
              <p className="text-muted mb-4">Vous n'êtes pas encore inscrit à un cours.</p>
              <Link to="/student/dashboard/catalog" className="btn btn-primary rounded-pill px-4">
                Découvrir le catalogue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
