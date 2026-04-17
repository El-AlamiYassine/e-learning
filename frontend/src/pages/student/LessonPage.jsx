import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeLessonRef = useRef(null);
  const [courseDetail, setCourseDetail] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    const fetchLessonAndCourse = async () => {
      try {
        setIsTransitioning(true);
        if (!currentLesson) setLoading(true); // Only full loading on first mount or error
        setError(null);
        setShowSuccess(false);

        const [lessonData, courseData] = await Promise.all([
          studentApi.getLessonDetail(id),
          studentApi.getCourseByLesson(id),
        ]);

        setCurrentLesson(lessonData);
        setCourseDetail(courseData);
        
        // Timeout to allow smooth fade-in
        setTimeout(() => setIsTransitioning(false), 100);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Leçon introuvable ou vous n\'êtes pas inscrit à ce cours.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndCourse();
  }, [id]);

  // Handle auto-scroll to active lesson in sidebar
  useEffect(() => {
    if (activeLessonRef.current) {
      activeLessonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [id, courseDetail]);

  const handleComplete = async () => {
    if (completing) return;
    try {
      setCompleting(true);
      await studentApi.completeLesson(id);

      setCurrentLesson(prev => ({ ...prev, completed: true }));
      setCourseDetail(prev => ({
        ...prev,
        lessons: prev.lessons.map(l =>
          l.id.toString() === id ? { ...l, completed: true } : l
        ),
        progressPercentage: Math.round(
          ((prev.lessons.filter(l => l.completed || l.id.toString() === id).length) /
            prev.lessons.length) * 100
        ),
      }));
      setShowSuccess(true);
    } catch (err) {
      alert('Erreur lors de la validation de la leçon.');
    } finally {
      setCompleting(false);
    }
  };

  const startQuiz = async () => {
    try {
      const data = await studentApi.getQuiz(id);
      setQuizData(data);
      setShowQuiz(true);
      setQuizResults(null);
      setUserAnswers({});
    } catch (err) {
      alert('Erreur lors du chargement du quiz.');
    }
  };

  const handleAnswerSelect = (questionId, option) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    if (Object.keys(userAnswers).length < quizData.questions.length) {
      if (!window.confirm('Vous n\'avez pas répondu à toutes les questions. Voulez-vous continuer ?')) return;
    }

    setSubmittingQuiz(true);
    try {
      const results = await studentApi.submitQuiz(id, userAnswers);
      setQuizResults(results);
      if (results.passed) {
        setShowSuccess(true);
        setCurrentLesson(prev => ({ ...prev, completed: true }));
        // Refresh course progress locally
        setCourseDetail(prev => ({
          ...prev,
          lessons: prev.lessons.map(l => l.id.toString() === id ? { ...l, completed: true } : l),
          progressPercentage: Math.round(((prev.lessons.filter(l => l.completed || l.id.toString() === id).length) / prev.lessons.length) * 100)
        }));
      }
    } catch (err) {
      alert('Erreur lors de la soumission du quiz.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="text-center animate-pulse">
          <div className="spinner-grow text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="text-secondary fw-medium">Préparation de votre cours...</p>
        </div>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 shadow-sm mb-4 border-0 bg-danger bg-opacity-10 text-danger">{error || 'Leçon introuvable'}</div>
        <Link to="/student/dashboard/courses" className="btn btn-primary rounded-pill px-5 py-2 shadow-sm fw-bold">
          Retour à mes cours
        </Link>
      </div>
    );
  }

  const lessons = courseDetail?.lessons || [];
  const currentIndex = lessons.findIndex(l => l.id.toString() === id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const progress = courseDetail?.progressPercentage ?? 0;

  return (
    <div className="container-fluid p-0 bg-white min-vh-100 overflow-hidden">
      <style>{`
        .lesson-transition {
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .is-transitioning {
          opacity: 0;
          transform: translateY(10px);
        }
        .sidebar-item {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-item:hover:not(.active) {
          background-color: rgba(0, 0, 0, 0.03) !important;
          transform: translateX(4px);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .resource-card {
          transition: all 0.2s ease;
          border: 1px solid #eef2f7;
        }
        .resource-card:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .video-container {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      <div className="row g-0">

        {/* ── Main Content ── */}
        <div className="col-lg-9 border-end position-relative" style={{ height: '100vh', overflowY: 'auto' }}>
          <div className={`p-4 p-lg-5 lesson-transition ${isTransitioning ? 'is-transitioning' : ''}`}>

            {/* Header navigation */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Link
                to={`/student/course/${courseDetail?.id}`}
                className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 px-0 fw-medium hover-lift"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au cours
              </Link>
              <div className="d-flex align-items-center gap-2">
                {currentLesson.completed && (
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-semibold d-flex align-items-center gap-1 shadow-sm border border-success border-opacity-10">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Leçon terminée
                  </span>
                )}
                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold border border-primary border-opacity-10">
                  {currentIndex + 1} / {lessons.length}
                </div>
              </div>
            </div>

            {/* Success banner */}
            {showSuccess && (
              <div className="alert alert-success d-flex align-items-center gap-3 rounded-4 mb-4 shadow-sm border-0 bg-success bg-opacity-10" style={{ animation: 'slideInDown 0.5s ease' }}>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center p-2 shadow-sm" style={{ width: '32px', height: '32px' }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-grow-1">
                  <strong className="text-success">Bravo ! Cette leçon est validée. 🎉</strong>
                  <p className="mb-0 small text-success">
                    {nextLesson
                      ? 'Prochaine étape : ' + nextLesson.title
                      : 'Félicitations, vous avez complété tout le programme !'}
                  </p>
                </div>
                <button className="btn-close" onClick={() => setShowSuccess(false)} />
              </div>
            )}

            <div className="mb-2">
              <span className="text-primary fw-bold small text-uppercase ls-wide">{courseDetail?.title}</span>
            </div>
            <h1 className="fw-bold text-dark mb-4">{currentLesson.title}</h1>

            {/* Video Player */}
            {currentLesson.videoUrl ? (
              <div className="video-container ratio ratio-16x9 rounded-4 overflow-hidden mb-5 bg-dark">
                {currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={currentLesson.videoUrl
                      .replace('watch?v=', 'embed/')
                      .replace('youtu.be/', 'www.youtube.com/embed/')}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <video controls className="w-100 h-100" style={{ objectFit: 'contain' }} poster="https://gradienta.io/static/60338a8e3f282496a75f1f0e8f349edb/8fe3d/gradient-background-wallpaper.jpg">
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                )}
              </div>
            ) : (
              <div className="bg-light rounded-4 p-5 text-center mb-5 border-2 border-dashed">
                <div className="bg-white rounded-circle d-inline-flex p-4 mb-3 shadow-soft border text-muted">
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h5 className="fw-bold text-dark">Pas de vidéo disponible</h5>
                <p className="text-secondary mb-0">Consultez le contenu écrit ci-dessous pour cette leçon.</p>
              </div>
            )}

            {/* Layout optimized for readability */}
            <div className="row g-5">
              <div className="col-xl-12">
                {/* Content Text */}
                {currentLesson.content && (
                  <div className="mb-5">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-3">
                      <span className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      À propos de cette leçon
                    </h5>
                    <div className="lesson-body text-dark" style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                        {currentLesson.content}
                    </div>
                  </div>
                )}

                {/* Documents Section with refined design */}
                {currentLesson.documents && currentLesson.documents.length > 0 && (
                  <div className="pt-4 mt-4 border-top">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-3">
                      <span className="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      Resources et ressources ({currentLesson.documents.length})
                    </h5>
                    <div className="row g-3">
                      {currentLesson.documents.map((doc, index) => (
                        <div key={index} className="col-md-6 col-xl-4">
                          <a
                            href={`http://localhost:8080${doc.cheminFichier}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white resource-card p-3 rounded-4 d-flex align-items-center gap-3 text-decoration-none shadow-sm h-100 border"
                          >
                            <div className="bg-danger bg-opacity-10 text-danger p-2 rounded-3">
                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <h6 className="mb-0 fw-bold text-dark text-truncate small">{doc.nom}</h6>
                              <span className="text-secondary" style={{ fontSize: '0.75rem' }}>DOC • PDF</span>
                            </div>
                            <svg width="18" height="18" fill="none" stroke="#adb5bd" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quiz Section */}
                {currentLesson.hasQuiz && !showQuiz && !quizResults && (
                  <div className="card border-0 shadow-sm rounded-4 bg-primary bg-opacity-10 p-4 mb-5 text-center">
                    <div className="mb-3">
                      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h4 className="fw-bold text-dark">Testez vos connaissances !</h4>
                    <p className="text-secondary">Un quiz est disponible pour cette leçon pour valider vos acquis.</p>
                    <button onClick={startQuiz} className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm mt-2">Démarrer le Quiz</button>
                  </div>
                )}

                {showQuiz && quizData && (
                  <div className="card shadow border-0 rounded-4 p-4 p-md-5 mb-5 bg-white">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-bold mb-0">{quizData.titre}</h4>
                      <button className="btn-close" onClick={() => setShowQuiz(false)}></button>
                    </div>
                    
                    <div className="quiz-questions">
                      {quizData.questions.map((q, qIdx) => (
                        <div key={q.id} className="mb-5">
                          <h6 className="fw-bold mb-3">Question {qIdx + 1}: {q.enonce}</h6>
                          <div className="row g-3">
                            {['A', 'B', 'C', 'D'].map(opt => {
                              const optKey = `option${opt}`;
                              if (!q[optKey]) return null;
                              return (
                                <div key={opt} className="col-md-6">
                                  <div 
                                    className={`p-3 rounded-3 border-2 transition-all cursor-pointer d-flex align-items-center gap-3 ${userAnswers[q.id] === opt ? 'border-primary bg-primary bg-opacity-10' : 'border-light-subtle bg-light bg-opacity-50 h-100'}`}
                                    onClick={() => handleAnswerSelect(q.id, opt)}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${userAnswers[q.id] === opt ? 'bg-primary text-white' : 'bg-white border text-secondary'}`} style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                                      {opt}
                                    </div>
                                    <span className={userAnswers[q.id] === opt ? 'fw-bold text-primary' : 'text-dark'}>{q[optKey]}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                      <button 
                        onClick={submitQuiz} 
                        disabled={submittingQuiz}
                        className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg"
                      >
                        {submittingQuiz ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                        Envoyer mes réponses
                      </button>
                    </div>
                  </div>
                )}

                {quizResults && (
                  <div className={`card border-0 shadow rounded-4 p-5 mb-5 text-center ${quizResults.passed ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                    <div className="mb-3">
                      {quizResults.passed ? (
                         <div className="bg-success text-white rounded-circle d-inline-flex p-3 shadow">
                           <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                      ) : (
                        <div className="bg-warning text-dark rounded-circle d-inline-flex p-3 shadow">
                          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                      )}
                    </div>
                    <h2 className="fw-bold mb-2">Votre Score : {quizResults.score}%</h2>
                    <p className="lead mb-4">
                      {quizResults.passed 
                        ? 'Félicitations ! Vous avez réussi le quiz et validé cette leçon.' 
                        : `Dommage ! Il vous faut au moins ${quizResults.scoreMinimum}% pour réussir.`}
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                      <button onClick={startQuiz} className="btn btn-outline-dark rounded-pill px-4 fw-bold">Recommencer</button>
                      {quizResults.passed && nextLesson && (
                        <button onClick={() => navigate(`/student/lesson/${nextLesson.id}`)} className="btn btn-success rounded-pill px-4 fw-bold shadow-sm border-0">Continuer</button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons footer */}
            <div className="d-flex justify-content-between align-items-center pt-5 mt-5 border-top pb-5">
              <button
                onClick={() => prevLesson && navigate(`/student/lesson/${prevLesson.id}`)}
                disabled={!prevLesson}
                className="btn btn-outline-secondary rounded-pill px-4 py-2-5 fw-bold d-flex align-items-center gap-2 border-2 hover-lift"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Précédent
              </button>

              <div className="d-flex align-items-center gap-3">
                {!currentLesson.completed ? (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="btn btn-success rounded-pill px-5 py-2-5 fw-bold shadow-lg d-flex align-items-center gap-2 hover-lift"
                  >
                    {completing ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Marquer comme terminée
                  </button>
                ) : (
                  <div className="text-success fw-bold d-flex align-items-center gap-2 me-2">
                    <div className="bg-success text-white rounded-circle p-1 d-flex">
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    Déjà terminée
                  </div>
                )}

                {nextLesson && (
                  <button
                    onClick={() => navigate(`/student/lesson/${nextLesson.id}`)}
                    className="btn btn-primary rounded-pill px-5 py-2-5 fw-bold shadow-lg d-flex align-items-center gap-2 hover-lift"
                  >
                    Suivant
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Syllabus Sidebar ── */}
        <div className="col-lg-3 bg-white border-start d-flex flex-column" style={{ height: '100vh' }}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-bottom">
            <p className="text-secondary small mb-1 text-uppercase fw-bold ls-wide" style={{ fontSize: '10.5px' }}>Votre progression</p>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold text-dark mb-0">{progress}% terminé</h6>
              <span className="small text-muted fw-medium">{lessons.filter(l => l.completed).length} / {lessons.length}</span>
            </div>
            <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-primary rounded-pill shadow-sm" 
                style={{ width: `${progress}%`, transition: 'width 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }} 
              />
            </div>
          </div>

          <div className="p-4 flex-grow-1 overflow-auto bg-light bg-opacity-25 pb-5">
            <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Syllabus du cours
            </h6>
            
            <div className="d-flex flex-column gap-2">
              {lessons.map((lesson, idx) => {
                const isActive = lesson.id.toString() === id;
                return (
                  <button
                    key={lesson.id}
                    ref={isActive ? activeLessonRef : null}
                    onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                    className={`btn text-start p-3 rounded-4 border-0 d-flex align-items-center gap-3 sidebar-item ${
                      isActive
                        ? 'bg-primary text-white shadow-lg active'
                        : 'bg-white text-dark shadow-sm border'
                    }`}
                  >
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 small fw-bold ${
                        isActive
                          ? 'bg-white text-primary'
                          : lesson.completed
                            ? 'bg-success text-white'
                            : 'bg-light text-secondary'
                      }`}
                      style={{ width: '28px', height: '28px', fontSize: '11px' }}
                    >
                      {lesson.completed && !isActive ? (
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : idx + 1}
                    </div>
                    <div className="overflow-hidden">
                      <p className={`mb-0 small fw-bold text-truncate ${isActive ? 'text-white' : 'text-dark'}`}>
                         {lesson.title}
                      </p>
                      <span className={`small ${isActive ? 'text-white text-opacity-75' : 'text-muted'}`} style={{ fontSize: '10px' }}>
                        {lesson.type || 'Leçon vidéo'} • 15 min
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
