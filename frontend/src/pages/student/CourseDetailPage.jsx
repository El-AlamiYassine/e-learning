import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getCourseDetail(id);
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course detail:', err);
        setError('Impossible de charger les détails du cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 shadow-sm">{error || 'Cours introuvable'}</div>
        <Link to="/student/dashboard/courses" className="btn btn-primary mt-3 rounded-pill px-4">Retour à mes cours</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 p-0">
      {/* Course Hero Header */}
      <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden mb-4">
        <div className="row g-0">
          <div className="col-md-4">
            <img 
              src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'} 
              alt={course.title}
              className="w-100 h-100"
              style={{ objectFit: 'cover', minHeight: '250px' }}
            />
          </div>
          <div className="col-md-8 p-4 p-lg-5">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h1 className="fw-bold text-dark mb-2">{course.title}</h1>
                <p className="text-secondary fw-medium mb-0">Par {course.instructorName}</p>
              </div>
              <div className="text-end">
                <div className="progress rounded-pill bg-light mb-2" style={{ width: '150px', height: '10px' }}>
                  <div 
                    className="progress-bar bg-success rounded-pill" 
                    role="progressbar" 
                    style={{ width: `${course.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="fw-bold text-success small">{course.progressPercentage}% complété</span>
              </div>
            </div>
            <p className="text-secondary mb-4 col-lg-10">{course.description}</p>
            <div className="d-flex gap-3">
              {course.lessons.length > 0 && (
                <Link 
                  to={`/student/lesson/${course.lessons.find(l => !l.completed)?.id || course.lessons[0].id}`} 
                  className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                >
                  Continuer l'apprentissage
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="bg-white rounded-4 shadow-sm p-4">
            <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              Programme du cours
            </h4>
            
            <div className="d-flex flex-column gap-3">
              {course.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className={`lesson-item border rounded-4 p-3 d-flex align-items-center justify-content-between transition-all hover-shadow-sm ${lesson.completed ? 'bg-light bg-opacity-50' : 'bg-white'}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className={`num-badge rounded-circle d-flex align-items-center justify-content-center fw-bold small ${lesson.completed ? 'bg-success text-white' : 'bg-primary text-white'}`} style={{ width: '32px', height: '32px' }}>
                      {lesson.completed ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : index + 1}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-dark">{lesson.title}</h6>
                    </div>
                  </div>
                  <Link 
                    to={`/student/lesson/${lesson.id}`} 
                    className={`btn btn-sm rounded-pill px-4 fw-bold ${lesson.completed ? 'btn-outline-success' : 'btn-outline-primary shadow-hover'}`}
                  >
                    {lesson.completed ? 'Revoir' : 'Démarrer'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold text-dark mb-4">Infos pratiques</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="mb-0 text-muted small">Durée estimée</p>
                  <p className="mb-0 fw-bold text-dark small">{course.lessons.length * 45} minutes</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4">
                <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="mb-0 text-muted small">Certification</p>
                  <p className="mb-0 fw-bold text-dark small">Inclus à 100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
