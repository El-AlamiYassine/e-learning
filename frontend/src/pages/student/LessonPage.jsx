import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseDetail, setCourseDetail] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchLessonAndCourse = async () => {
      try {
        setLoading(true);
        // We first need the course ID to get the full syllabus and check current lesson info
        // But the API currently doesn't have a "getLesson" only. 
        // We'll assume we know the courseId from context or we'll fetch course details for all lessons
        // In a real app, we'd have a getLesson endpoint.
        
        // For now, let's find which course this lesson belongs to.
        // As a workaround, we'll try to find it in the enrolled courses or just fetch all
        // Actually, the current setup needs the courseId. 
        // Let's assume we can fetch course detail if we had the courseId.
        // IMPROVEMENT: Ideally, Backend should provide a getLessonDetail endpoint.
        
        // Let's fetch all enrolled courses to find the courseId for this lesson
        const enrolled = await studentApi.getEnrolledCourses();
        let foundCourseId = null;
        
        // This is a bit slow but works for now without a direct lesson-to-course mapping API
        for (const c of enrolled) {
            const detail = await studentApi.getCourseDetail(c.id);
            if (detail.lessons.some(l => l.id.toString() === id)) {
                foundCourseId = c.id;
                setCourseDetail(detail);
                setCurrentLesson(detail.lessons.find(l => l.id.toString() === id));
                break;
            }
        }

        if (!foundCourseId) setError('Leçon introuvable ou vous n\'êtes pas inscrit à ce cours.');
        setError(null);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Erreur lors du chargement de la leçon.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndCourse();
  }, [id]);

  const handleComplete = async () => {
    try {
      setCompleting(true);
      await studentApi.completeLesson(id);
      
      // Update local state
      setCourseDetail(prev => ({
        ...prev,
        lessons: prev.lessons.map(l => l.id.toString() === id ? { ...l, completed: true } : l)
      }));
      setCurrentLesson(prev => ({ ...prev, completed: true }));

      // Find next lesson
      const currentIndex = courseDetail.lessons.findIndex(l => l.id.toString() === id);
      if (currentIndex < courseDetail.lessons.length - 1) {
        const nextLesson = courseDetail.lessons[currentIndex + 1];
        if (confirm('Leçon terminée ! Passer à la suivante ?')) {
          navigate(`/student/lesson/${nextLesson.id}`);
        }
      } else {
        alert('Félicitations ! Vous avez terminé toutes les leçons de ce cours.');
        navigate(`/student/course/${courseDetail.id}`);
      }
    } catch (err) {
      alert('Erreur lors de la validation de la leçon.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mb-4">{error}</div>
        <Link to="/student/dashboard/courses" className="btn btn-primary rounded-pill px-4">Retour à mes cours</Link>
      </div>
    );
  }

  const currentIndex = courseDetail.lessons.findIndex(l => l.id.toString() === id);
  const prevLesson = currentIndex > 0 ? courseDetail.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseDetail.lessons.length - 1 ? courseDetail.lessons[currentIndex + 1] : null;

  return (
    <div className="container-fluid p-0 bg-white min-vh-100">
      <div className="row g-0">
        {/* Main Content Side */}
        <div className="col-lg-9 border-end">
          <div className="p-4 p-lg-5">
            {/* Header Navigation */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Link to={`/student/course/${courseDetail.id}`} className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 px-0">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Retour au cours
              </Link>
              <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold">
                Leçon {currentIndex + 1} sur {courseDetail.lessons.length}
              </div>
            </div>

            <h2 className="fw-bold text-dark mb-4">{currentLesson.title}</h2>

            {/* Video Player Placeholder */}
            {currentLesson.videoUrl ? (
              <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm mb-5 bg-dark">
                {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                  <iframe 
                    src={currentLesson.videoUrl.replace('watch?v=', 'embed/')} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video controls className="w-100">
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                )}
              </div>
            ) : (
                <div className="bg-light rounded-4 p-5 text-center mb-5 border-2 border-dashed">
                    <svg width="48" height="48" fill="none" stroke="currentColor" className="text-muted mb-3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    <p className="text-secondary mb-0">Pas de vidéo disponible pour cette leçon.</p>
                </div>
            )}

            {/* Content Text */}
            <div className="prose mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>{currentLesson.content}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between pt-5 border-top border-light mt-5">
              <button 
                onClick={() => navigate(`/student/lesson/${prevLesson.id}`)}
                disabled={!prevLesson}
                className="btn btn-outline-dark rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 transition-all"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Précédent
              </button>

              {!currentLesson.completed ? (
                <button 
                  onClick={handleComplete}
                  disabled={completing}
                  className="btn btn-success rounded-pill px-5 py-2 fw-bold shadow hover-lift"
                >
                  {completing ? 'Chargement...' : 'Marquer comme terminée'}
                </button>
              ) : nextLesson ? (
                <button 
                  onClick={() => navigate(`/student/lesson/${nextLesson.id}`)}
                  className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow hover-lift"
                >
                  Suivant
                </button>
              ) : (
                  <div className="text-success fw-bold d-flex align-items-center gap-2">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Cours terminé !
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Syllabus Sidebar Side */}
        <div className="col-lg-3 bg-light bg-opacity-50">
          <div className="p-4 sticky-top" style={{ top: '0' }}>
            <h5 className="fw-bold mb-4">Programme</h5>
            <div className="d-flex flex-column gap-2">
              {courseDetail.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                  className={`btn text-start p-3 rounded-4 d-flex align-items-center gap-2 transition-all border-0 ${lesson.id.toString() === id ? 'bg-primary text-white shadow-sm' : 'bg-white hover-bg-light text-dark'}`}
                >
                   <div className={`num-badge rounded-circle d-flex align-items-center justify-content-center small fw-bold ${lesson.id.toString() === id ? 'bg-white text-primary' : lesson.completed ? 'bg-success text-white' : 'bg-light text-secondary'}`} style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                    {lesson.completed ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : idx + 1}
                  </div>
                  <span className="small fw-semibold line-clamp-1">{lesson.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
