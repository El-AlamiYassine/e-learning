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
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 shadow-sm">{error || 'Cours introuvable'}</div>
        <Link to="/student/dashboard/courses" className="btn btn-primary mt-3 rounded-pill px-5 py-2 fw-bold">Retour à mes cours</Link>
      </div>
    );
  }

  const nextLesson = course.lessons.find(l => !l.completed) || course.lessons[0];

  return (
    <div className="container py-4 pb-5 animate-fadeIn">
      {/* Course Hero Header */}
      <div className="glass-panel overflow-hidden mb-5 p-0">
        <div className="row g-0">
          <div className="col-md-4">
            <div className="position-relative h-100 min-vh-25">
               <img 
                src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'} 
                alt={course.title}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 start-0 m-3">
                 <span className="badge bg-white bg-opacity-90 text-primary rounded-pill px-3 py-2 shadow-sm fw-bold border">
                    {course.categoryName || 'Formation'}
                 </span>
              </div>
            </div>
          </div>
          <div className="col-md-8 p-4 p-lg-5">
            <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-3">
              <div>
                <nav aria-label="breadcrumb" className="mb-2">
                  <ol className="breadcrumb small mb-0">
                    <li className="breadcrumb-item"><Link to="/student/dashboard/courses">Mes cours</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Détail</li>
                  </ol>
                </nav>
                <h1 className="fw-bold text-dark mb-2 display-6">{course.title}</h1>
                <p className="text-secondary fw-semibold mb-0 d-flex align-items-center gap-2">
                  <span className="bg-light rounded-circle p-1">👨‍🏫</span>
                  {course.instructorName}
                </p>
              </div>
              <div className="text-md-end">
                <div className="d-flex align-items-center gap-2 mb-1 justify-content-md-end">
                   <h4 className="fw-bold text-primary mb-0">{course.progressPercentage}%</h4>
                   <span className="text-muted small fw-medium">terminé</span>
                </div>
                <div className="progress rounded-pill bg-light" style={{ width: '160px', height: '8px' }}>
                  <div 
                    className="progress-bar bg-primary rounded-pill shadow-sm" 
                    role="progressbar" 
                    style={{ width: `${course.progressPercentage}%`, transition: 'width 1s ease' }}
                  ></div>
                </div>
              </div>
            </div>
            
            <p className="text-secondary mb-4 col-lg-10 leading-relaxed">{course.description}</p>
            
            <div className="d-flex gap-3 mt-4 mt-lg-auto">
              {course.lessons.length > 0 && (
                <Link 
                  to={`/student/lesson/${nextLesson.id}`} 
                  className="btn-premium rounded-pill px-5 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0 hover-lift"
                  style={{ fontSize: '1.05rem' }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.progressPercentage > 0 ? 'Continuer le cours' : 'Démarrer le cours'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-lg-8">
          <div className="glass-panel p-4 border-0">
            <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-3">
              <span className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </span>
              Contenu du programme
            </h4>
            
            <div className="d-flex flex-column gap-2 mb-2">
              {course.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id} 
                  className={`p-3 rounded-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between hover-lift mb-2 gap-3 transition-all ${lesson.completed ? 'glass-panel opacity-75' : 'glass-panel'}`}
                >
                  <div className="d-flex align-items-center gap-3 overflow-hidden">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm fw-bold small flex-shrink-0 text-white`} style={{ width: '36px', height: '36px', background: lesson.completed ? 'var(--bs-success)' : 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary))' }}>
                      {lesson.completed ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : index + 1}
                    </div>
                    <div className="overflow-hidden">
                      <h6 className="mb-0 fw-bold text-dark text-truncate">{lesson.title}</h6>
                      <p className="mb-0 text-muted small">Leçon vidéo • ~15 min</p>
                    </div>
                  </div>
                  <Link 
                    to={`/student/lesson/${lesson.id}`} 
                    className={`btn btn-sm rounded-pill px-4 fw-bold flex-shrink-0 ${lesson.completed ? 'btn-outline-success border-2' : 'btn-premium'}`}
                  >
                    {lesson.completed ? 'Revoir' : 'Démarrer'}
                  </Link>
                </div>
              ))}
            </div>
            
            {course.lessons.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">Aucune leçon n'est disponible pour ce cours.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4 sticky-top" style={{ top: '24px' }}>
            
            {/* Quick stats card */}
            <div className="glass-panel p-4 border-0">
              <h5 className="fw-bold text-dark mb-4">Détails de la formation</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border">
                  <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="mb-0 text-muted small fw-medium">Durée totale</p>
                    <p className="mb-0 fw-bold text-dark">{course.lessons.length * 45} minutes</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border">
                  <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <div>
                    <p className="mb-0 text-muted small fw-medium">Leçons</p>
                    <p className="mb-0 fw-bold text-dark">{course.lessons.length} vidéos & docs</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border">
                  <div className="bg-white rounded-circle p-2 shadow-sm text-primary">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="mb-0 text-muted small fw-medium">Certification</p>
                    <p className="mb-0 fw-bold text-dark">Délivrée à la fin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support section */}
            <div className="bg-primary bg-opacity-5 rounded-4 p-4 border border-primary border-opacity-10">
               <h6 className="fw-bold text-primary mb-3">Besoin d'aide ?</h6>
               <p className="text-secondary small mb-3">Une question sur ce programme ? Notre support est là pour vous accompagner.</p>
               <button className="btn btn-outline-primary w-100 rounded-pill fw-bold btn-sm">Contacter le formateur</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
