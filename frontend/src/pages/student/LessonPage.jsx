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

  const [showQuiz, setShowQuiz] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [isCourseQuiz, setIsCourseQuiz] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsTransitioning(true);
        if (!currentLesson) setLoading(true);
        setError(null);
        setShowSuccess(false);
        setShowQuiz(false);
        setQuizResults(null);
        const [lessonData, courseData] = await Promise.all([
          studentApi.getLessonDetail(id),
          studentApi.getCourseByLesson(id),
        ]);
        setCurrentLesson(lessonData);
        setCourseDetail(courseData);
        setTimeout(() => setIsTransitioning(false), 100);
      } catch (err) {
        setError("Leçon introuvable ou vous n'êtes pas inscrit à ce cours.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  useEffect(() => {
    activeLessonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [id, courseDetail]);

  const handleComplete = async () => {
    if (completing) return;
    try {
      setCompleting(true);
      await studentApi.completeLesson(id);
      setCurrentLesson(prev => ({ ...prev, completed: true }));
      setCourseDetail(prev => ({
        ...prev,
        lessons: prev.lessons.map(l => l.id.toString() === id ? { ...l, completed: true } : l),
        progressPercentage: Math.round(
          (prev.lessons.filter(l => l.completed || l.id.toString() === id).length / prev.lessons.length) * 100
        ),
      }));
      setShowSuccess(true);
    } catch {
      alert('Erreur lors de la validation de la leçon.');
    } finally {
      setCompleting(false);
    }
  };

  const startQuiz = async () => {
    try {
      setIsCourseQuiz(false);
      const data = await studentApi.getQuiz(id);
      setQuizData(data); setShowQuiz(true); setQuizResults(null); setUserAnswers({});
    } catch { alert('Erreur lors du chargement du quiz.'); }
  };

  const startCourseQuiz = async () => {
    try {
      setIsCourseQuiz(true);
      const data = await studentApi.getCourseQuiz(courseDetail.id);
      setQuizData(data); setShowQuiz(true); setQuizResults(null); setUserAnswers({});
    } catch { alert('Erreur lors du chargement du quiz final.'); }
  };

  const handleAnswerSelect = (qId, opt) => setUserAnswers(prev => ({ ...prev, [qId]: opt }));

  const submitQuiz = async () => {
    if (Object.keys(userAnswers).length < quizData.questions.length) {
      if (!window.confirm("Vous n'avez pas répondu à toutes les questions. Continuer ?")) return;
    }
    setSubmittingQuiz(true);
    try {
      const results = isCourseQuiz
        ? await studentApi.submitCourseQuiz(courseDetail.id, userAnswers)
        : await studentApi.submitQuiz(id, userAnswers);
      setQuizResults(results);
      if (results.passed) {
        setShowSuccess(true);
        if (isCourseQuiz) {
          setCourseDetail(prev => ({ ...prev, finalQuizPassed: true }));
        } else {
          setCurrentLesson(prev => ({ ...prev, completed: true }));
          setCourseDetail(prev => ({
            ...prev,
            lessons: prev.lessons.map(l => l.id.toString() === id ? { ...l, completed: true } : l),
            progressPercentage: Math.round(
              (prev.lessons.filter(l => l.completed || l.id.toString() === id).length / prev.lessons.length) * 100
            ),
          }));
        }
      }
    } catch { alert('Erreur lors de la soumission du quiz.'); }
    finally { setSubmittingQuiz(false); }
  };

  if (loading) {
    return (
      <div className="lp-loading">
        <div className="lp-loader" />
        <p>Préparation de votre leçon…</p>
        <style>{`.lp-loading{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:'Sora',sans-serif;color:#71717a;font-size:.875rem;background:#fff}.lp-loader{width:36px;height:36px;border:3px solid #ede9fe;border-top-color:#6366f1;border-radius:50%;animation:lp-spin .8s linear infinite}@keyframes lp-spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#f5f5f8',fontFamily:'system-ui' }}>
        <div style={{ textAlign:'center',padding:'40px',background:'#fff',borderRadius:'20px',border:'1.5px solid rgba(0,0,0,.08)',maxWidth:'360px' }}>
          <p style={{ color:'#52525b',marginBottom:'16px' }}>{error || 'Leçon introuvable'}</p>
          <Link to="/student/dashboard/courses" style={{ color:'#6366f1',fontWeight:600,textDecoration:'none' }}>← Retour à mes cours</Link>
        </div>
      </div>
    );
  }

  const lessons = courseDetail?.lessons || [];
  const currentIndex = lessons.findIndex(l => l.id.toString() === id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const progress = courseDetail?.progressPercentage ?? 0;
  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className="lp-root">
      <style>{css}</style>

      {/* ── SIDEBAR ─────────────────────────── */}
      <aside className="lp-sidebar">
        {/* Header */}
        <div className="lp-sidebar-head">
          <Link to={`/student/course/${courseDetail?.id}`} className="lp-back-link">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Retour au cours
          </Link>
          <div className="lp-course-name">{courseDetail?.title}</div>
        </div>

        {/* Progress */}
        <div className="lp-progress-wrap">
          <div className="lp-progress-meta">
            <span className="lp-progress-pct">{progress}%</span>
            <span className="lp-progress-count">{completedCount} / {lessons.length} leçons</span>
          </div>
          <div className="lp-progress-track">
            <div className="lp-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Lesson list */}
        <div className="lp-lesson-list">
          {lessons.map((lesson, idx) => {
            const isActive = lesson.id.toString() === id;
            return (
              <button
                key={lesson.id}
                ref={isActive ? activeLessonRef : null}
                className={`lp-lesson-item ${isActive ? 'lp-lesson-item--active' : ''} ${lesson.completed && !isActive ? 'lp-lesson-item--done' : ''}`}
                onClick={() => navigate(`/student/lesson/${lesson.id}`)}
              >
                <div className={`lp-lesson-num ${isActive ? 'lp-lesson-num--active' : lesson.completed ? 'lp-lesson-num--done' : ''}`}>
                  {lesson.completed && !isActive
                    ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : idx + 1}
                </div>
                <div className="lp-lesson-text">
                  <span className="lp-lesson-title">{lesson.title}</span>
                  <span className="lp-lesson-meta">Leçon vidéo · 15 min</span>
                </div>
              </button>
            );
          })}

          {courseDetail?.hasFinalQuiz && (
            <button
              className={`lp-lesson-item lp-lesson-item--quiz ${isCourseQuiz ? 'lp-lesson-item--active' : ''}`}
              onClick={startCourseQuiz}
              disabled={courseDetail.progressPercentage < 100}
            >
              <div className={`lp-lesson-num ${courseDetail.finalQuizPassed ? 'lp-lesson-num--done' : 'lp-lesson-num--quiz'}`}>
                {courseDetail.finalQuizPassed
                  ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                }
              </div>
              <div className="lp-lesson-text">
                <span className="lp-lesson-title">Quiz Final de Certification</span>
                <span className="lp-lesson-meta">{courseDetail.progressPercentage < 100 ? 'Disponible à la fin' : 'Disponible maintenant'}</span>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────── */}
      <main className={`lp-main ${isTransitioning ? 'lp-main--transitioning' : ''}`}>

        {/* Topbar */}
        <div className="lp-topbar">
          <div className="lp-topbar-left">
            {currentLesson.completed && (
              <span className="lp-done-badge">
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Terminée
              </span>
            )}
            <span className="lp-index-badge">{currentIndex + 1} / {lessons.length}</span>
          </div>
          <div className="lp-topbar-right">
            {prevLesson && (
              <button className="lp-nav-btn" onClick={() => navigate(`/student/lesson/${prevLesson.id}`)}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Précédente
              </button>
            )}
            {nextLesson && (
              <button className="lp-nav-btn lp-nav-btn--next" onClick={() => navigate(`/student/lesson/${nextLesson.id}`)}>
                Suivante
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>
        </div>

        <div className="lp-content">
          {/* Title area */}
          <div className="lp-title-area">
            <p className="lp-course-label">{courseDetail?.title}</p>
            <h1 className="lp-lesson-h1">{currentLesson.title}</h1>
          </div>

          {/* Success banner */}
          {showSuccess && (
            <div className="lp-success">
              <div className="lp-success-icon">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <strong>Bravo ! Leçon validée 🎉</strong>
                <p>{nextLesson ? `Prochaine étape : ${nextLesson.title}` : 'Félicitations, programme terminé !'}</p>
              </div>
              <button className="lp-success-close" onClick={() => setShowSuccess(false)}>✕</button>
            </div>
          )}

          {/* Video */}
          {currentLesson.videoUrl ? (
            <div className="lp-video-wrap">
              {currentLesson.videoUrl.includes('youtube') || currentLesson.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={currentLesson.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="lp-video-iframe"
                />
              ) : (
                <video controls className="lp-video-iframe" style={{ objectFit:'contain',background:'#000' }}>
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          ) : (
            <div className="lp-no-video">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <p>Pas de vidéo disponible — consultez le contenu ci-dessous.</p>
            </div>
          )}

          {/* Content */}
          {currentLesson.content && (
            <section className="lp-section">
              <div className="lp-section-head">
                <div className="lp-section-icon lp-section-icon--violet">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h2>À propos de cette leçon</h2>
              </div>
              <div className="lp-prose">{currentLesson.content}</div>
            </section>
          )}

          {/* Documents */}
          {currentLesson.documents?.length > 0 && (
            <section className="lp-section">
              <div className="lp-section-head">
                <div className="lp-section-icon lp-section-icon--rose">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h2>Ressources ({currentLesson.documents.length})</h2>
              </div>
              <div className="lp-docs">
                {currentLesson.documents.map((doc, i) => (
                  <a key={i} href={`http://localhost:8080${doc.cheminFichier}`} target="_blank" rel="noreferrer" className="lp-doc-card">
                    <div className="lp-doc-icon">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="lp-doc-info">
                      <span className="lp-doc-name">{doc.nom}</span>
                      <span className="lp-doc-type">PDF · Document</span>
                    </div>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Lesson quiz prompt */}
          {currentLesson.hasQuiz && !showQuiz && !quizResults && (
            <div className="lp-quiz-prompt">
              <div className="lp-quiz-prompt-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3>Testez vos connaissances !</h3>
                <p>Un quiz est disponible pour valider vos acquis sur cette leçon.</p>
              </div>
              <button className="lp-btn lp-btn--violet" onClick={startQuiz}>Démarrer le quiz</button>
            </div>
          )}

          {/* Quiz panel */}
          {showQuiz && quizData && !quizResults && (
            <div className="lp-quiz-panel">
              <div className="lp-quiz-header">
                <h3>{quizData.titre}</h3>
                <button className="lp-quiz-close" onClick={() => setShowQuiz(false)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {quizData.questions.map((q, qi) => (
                <div key={q.id} className="lp-question">
                  <p className="lp-question-text"><span className="lp-question-num">Q{qi + 1}</span>{q.enonce}</p>
                  <div className="lp-options">
                    {['A','B','C','D'].map(opt => {
                      const key = `option${opt}`;
                      if (!q[key]) return null;
                      const selected = userAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          className={`lp-option ${selected ? 'lp-option--selected' : ''}`}
                          onClick={() => handleAnswerSelect(q.id, opt)}
                        >
                          <span className={`lp-option-letter ${selected ? 'lp-option-letter--on' : ''}`}>{opt}</span>
                          <span className={selected ? 'lp-option-text--on' : ''}>{q[key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="lp-quiz-footer">
                <span className="lp-quiz-progress">
                  {Object.keys(userAnswers).length} / {quizData.questions.length} répondues
                </span>
                <button
                  className="lp-btn lp-btn--violet"
                  onClick={submitQuiz}
                  disabled={submittingQuiz}
                >
                  {submittingQuiz ? <span className="lp-spinner lp-spinner--white" /> : null}
                  {submittingQuiz ? 'Envoi…' : 'Envoyer mes réponses'}
                </button>
              </div>
            </div>
          )}

          {/* Quiz results */}
          {quizResults && (
            <div className={`lp-quiz-result ${quizResults.passed ? 'lp-quiz-result--pass' : 'lp-quiz-result--fail'}`}>
              <div className={`lp-result-icon ${quizResults.passed ? 'lp-result-icon--pass' : 'lp-result-icon--fail'}`}>
                {quizResults.passed
                  ? <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  : <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                }
              </div>
              <h2 className="lp-result-score">{quizResults.score}%</h2>
              <p className="lp-result-msg">
                {quizResults.passed
                  ? 'Félicitations ! Vous avez réussi le quiz.'
                  : `Il vous faut au moins ${quizResults.scoreMinimum}% pour réussir.`}
              </p>
              <div className="lp-result-actions">
                <button className="lp-btn lp-btn--ghost" onClick={isCourseQuiz ? startCourseQuiz : startQuiz}>Recommencer</button>
                {quizResults.passed && nextLesson && (
                  <button className="lp-btn lp-btn--green" onClick={() => navigate(`/student/lesson/${nextLesson.id}`)}>
                    Leçon suivante →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Course final quiz CTA */}
          {courseDetail?.progressPercentage === 100 && courseDetail.hasFinalQuiz && !showQuiz && !quizResults && (
            <div className={`lp-final-quiz ${courseDetail.finalQuizPassed ? 'lp-final-quiz--passed' : ''}`}>
              <div className="lp-final-quiz-icon">
                {courseDetail.finalQuizPassed
                  ? <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  : <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                }
              </div>
              <h3>Quiz Final de Certification</h3>
              <p>
                {courseDetail.finalQuizPassed
                  ? 'Vous avez réussi ! Votre certificat est disponible.'
                  : 'Toutes les leçons sont terminées. Passez le quiz final pour décrocher votre certificat.'}
              </p>
              {courseDetail.finalQuizPassed
                ? <button className="lp-btn lp-btn--green" onClick={() => navigate(`/student/course/${courseDetail.id}`)}>Voir mon certificat</button>
                : <button className="lp-btn lp-btn--violet" onClick={startCourseQuiz}>Démarrer le quiz final</button>
              }
            </div>
          )}

          {/* Bottom nav */}
          <div className="lp-bottom-nav">
            <button className="lp-nav-btn lp-nav-btn--ghost" disabled={!prevLesson} onClick={() => prevLesson && navigate(`/student/lesson/${prevLesson.id}`)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Précédente
            </button>
            <div className="lp-bottom-center">
              {!currentLesson.completed ? (
                <button className="lp-btn lp-btn--green" onClick={handleComplete} disabled={completing}>
                  {completing ? <span className="lp-spinner lp-spinner--white" /> : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {completing ? 'Validation…' : 'Marquer comme terminée'}
                </button>
              ) : (
                <span className="lp-already-done">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Déjà terminée
                </span>
              )}
              {nextLesson && (
                <button className="lp-btn lp-btn--violet" onClick={() => navigate(`/student/lesson/${nextLesson.id}`)}>
                  Suivante
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              )}
              {!nextLesson && courseDetail?.hasFinalQuiz && courseDetail.progressPercentage === 100 && (
                <button className="lp-btn lp-btn--violet" onClick={startCourseQuiz}>
                  Quiz Final
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
            <div style={{ width: '110px' }} />
          </div>
        </div>
      </main>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --lp-ink:    #111117;
    --lp-ink-2:  #52525b;
    --lp-ink-3:  #a1a1aa;
    --lp-bg:     #f8f8fb;
    --lp-card:   #ffffff;
    --lp-bor:    rgba(0,0,0,.08);
    --lp-v:      #6366f1;
    --lp-vl:     #eef2ff;
    --lp-vd:     #4338ca;
    --lp-g:      #059669;
    --lp-gl:     #d1fae5;
    --lp-r:      #e11d48;
    --lp-rl:     #fff1f2;
    --lp-sb:     260px;
    --lp-ease:   cubic-bezier(.22,1,.36,1);
    --lp-font:   'Sora', system-ui, sans-serif;
    --lp-serif:  'Lora', Georgia, serif;
  }

  *, *::before, *::after { box-sizing: border-box; }

  .lp-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: var(--lp-font);
    color: var(--lp-ink);
    background: var(--lp-card);
  }

  /* ── SIDEBAR ─────────────────────────── */
  .lp-sidebar {
    width: var(--lp-sb);
    flex-shrink: 0;
    border-right: 1px solid var(--lp-bor);
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--lp-card);
    overflow: hidden;
  }
  .lp-sidebar-head {
    padding: 20px 18px 16px;
    border-bottom: 1px solid var(--lp-bor);
    flex-shrink: 0;
  }
  .lp-back-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .75rem; font-weight: 600; color: var(--lp-v);
    text-decoration: none; margin-bottom: 10px;
    transition: opacity .2s;
  }
  .lp-back-link:hover { opacity: .7; }
  .lp-course-name {
    font-size: .8rem; font-weight: 700; color: var(--lp-ink);
    line-height: 1.3;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .lp-progress-wrap { padding: 14px 18px; border-bottom: 1px solid var(--lp-bor); flex-shrink: 0; }
  .lp-progress-meta { display: flex; justify-content: space-between; margin-bottom: 7px; }
  .lp-progress-pct { font-size: .78rem; font-weight: 700; color: var(--lp-v); }
  .lp-progress-count { font-size: .7rem; color: var(--lp-ink-3); font-weight: 500; }
  .lp-progress-track { height: 5px; background: var(--lp-vl); border-radius: 100px; overflow: hidden; }
  .lp-progress-fill { height: 100%; background: linear-gradient(90deg,var(--lp-v),#818cf8); border-radius: 100px; transition: width .8s var(--lp-ease); }

  .lp-lesson-list { flex: 1; overflow-y: auto; padding: 12px 10px 20px; scrollbar-width: thin; scrollbar-color: var(--lp-bor) transparent; display: flex; flex-direction: column; gap: 4px; }
  .lp-lesson-list::-webkit-scrollbar { width: 4px; }
  .lp-lesson-list::-webkit-scrollbar-thumb { background: var(--lp-bor); border-radius: 100px; }

  .lp-lesson-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 10px 10px; border-radius: 12px;
    border: none; background: none; cursor: pointer; text-align: left; width: 100%;
    transition: background .15s, transform .2s var(--lp-ease);
  }
  .lp-lesson-item:hover:not(.lp-lesson-item--active) { background: var(--lp-bg); transform: translateX(2px); }
  .lp-lesson-item--active { background: var(--lp-vl); }
  .lp-lesson-item--quiz { margin-top: 8px; border: 1.5px dashed rgba(99,102,241,.25); }
  .lp-lesson-item--quiz:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  .lp-lesson-num {
    width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: .65rem; font-weight: 800;
    background: var(--lp-bg); color: var(--lp-ink-2);
    border: 1.5px solid var(--lp-bor);
    margin-top: 1px;
  }
  .lp-lesson-num--active { background: var(--lp-v); color: #fff; border-color: transparent; }
  .lp-lesson-num--done   { background: var(--lp-gl); color: var(--lp-g); border-color: transparent; }
  .lp-lesson-num--quiz   { background: var(--lp-vl); color: var(--lp-v); border-color: transparent; }

  .lp-lesson-text { min-width: 0; flex: 1; }
  .lp-lesson-title {
    display: block; font-size: .78rem; font-weight: 700;
    color: var(--lp-ink); line-height: 1.3; margin-bottom: 2px;
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .lp-lesson-item--active .lp-lesson-title { color: var(--lp-v); }
  .lp-lesson-meta { display: block; font-size: .65rem; color: var(--lp-ink-3); }

  /* ── MAIN ─────────────────────────────── */
  .lp-main {
    flex: 1; min-width: 0; height: 100vh; overflow-y: auto;
    display: flex; flex-direction: column;
    transition: opacity .3s ease, transform .3s ease;
    scrollbar-width: thin; scrollbar-color: var(--lp-bor) transparent;
  }
  .lp-main--transitioning { opacity: 0; transform: translateY(8px); }
  .lp-main::-webkit-scrollbar { width: 5px; }
  .lp-main::-webkit-scrollbar-thumb { background: var(--lp-bor); border-radius: 100px; }

  .lp-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 32px; border-bottom: 1px solid var(--lp-bor);
    background: var(--lp-card); position: sticky; top: 0; z-index: 10;
    flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .lp-topbar-left, .lp-topbar-right { display: flex; align-items: center; gap: 8px; }
  .lp-done-badge { display:inline-flex; align-items:center; gap:5px; background:var(--lp-gl); color:var(--lp-g); font-size:.68rem; font-weight:700; padding:4px 10px; border-radius:100px; }
  .lp-index-badge { background:var(--lp-vl); color:var(--lp-v); font-size:.68rem; font-weight:700; padding:4px 10px; border-radius:100px; }
  .lp-nav-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:9px; border:1.5px solid var(--lp-bor); background:var(--lp-bg); font-family:var(--lp-font); font-size:.75rem; font-weight:600; color:var(--lp-ink-2); cursor:pointer; transition:all .2s var(--lp-ease); }
  .lp-nav-btn:hover { border-color:var(--lp-v); color:var(--lp-v); background:var(--lp-vl); }
  .lp-nav-btn--next { background:var(--lp-v); color:#fff; border-color:var(--lp-v); }
  .lp-nav-btn--next:hover { background:var(--lp-vd); }
  .lp-nav-btn--ghost { background:none; border-color:var(--lp-bor); }
  .lp-nav-btn--ghost:disabled { opacity:.4; cursor:not-allowed; }

  .lp-content { padding: 36px 40px 0; flex: 1; }

  .lp-title-area { margin-bottom: 24px; }
  .lp-course-label { font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--lp-v); margin:0 0 8px; }
  .lp-lesson-h1 { font-family:var(--lp-serif); font-style:italic; font-size:clamp(1.6rem,3vw,2.2rem); font-weight:700; margin:0; line-height:1.2; color:var(--lp-ink); }

  /* Success */
  .lp-success { display:flex; align-items:flex-start; gap:12px; background:var(--lp-gl); border:1px solid rgba(5,150,105,.2); border-radius:14px; padding:14px 16px; margin-bottom:24px; animation:lp-slide .4s var(--lp-ease); }
  @keyframes lp-slide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  .lp-success-icon { width:30px; height:30px; border-radius:8px; background:var(--lp-g); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .lp-success strong { display:block; font-size:.85rem; font-weight:700; color:var(--lp-g); margin-bottom:2px; }
  .lp-success p { font-size:.75rem; color:#065f46; margin:0; }
  .lp-success-close { background:none; border:none; color:var(--lp-g); cursor:pointer; font-size:.75rem; margin-left:auto; flex-shrink:0; opacity:.6; }

  /* Video */
  .lp-video-wrap { position:relative; width:100%; padding-top:56.25%; border-radius:16px; overflow:hidden; background:#000; margin-bottom:32px; box-shadow:0 12px 32px rgba(0,0,0,.12); }
  .lp-video-iframe { position:absolute; inset:0; width:100%; height:100%; border:none; }
  .lp-no-video { display:flex; align-items:center; gap:14px; padding:24px; background:var(--lp-bg); border-radius:14px; margin-bottom:32px; color:var(--lp-ink-3); font-size:.875rem; border:1.5px dashed var(--lp-bor); }

  /* Sections */
  .lp-section { margin-bottom: 32px; }
  .lp-section-head { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .lp-section-head h2 { font-size:.9rem; font-weight:700; margin:0; letter-spacing:-.01em; }
  .lp-section-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .lp-section-icon--violet { background:var(--lp-vl); color:var(--lp-v); }
  .lp-section-icon--rose   { background:var(--lp-rl); color:var(--lp-r); }

  .lp-prose { font-size:.95rem; line-height:1.75; color:var(--lp-ink-2); white-space:pre-wrap; }

  .lp-docs { display:flex; flex-direction:column; gap:8px; }
  .lp-doc-card { display:flex; align-items:center; gap:12px; padding:13px 16px; border-radius:12px; border:1.5px solid var(--lp-bor); background:var(--lp-bg); text-decoration:none; transition:all .2s var(--lp-ease); }
  .lp-doc-card:hover { border-color:var(--lp-r); background:var(--lp-rl); transform:translateX(3px); }
  .lp-doc-icon { width:34px; height:34px; border-radius:9px; background:var(--lp-rl); color:var(--lp-r); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .lp-doc-info { flex:1; min-width:0; }
  .lp-doc-name { display:block; font-size:.82rem; font-weight:700; color:var(--lp-ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lp-doc-type { display:block; font-size:.68rem; color:var(--lp-ink-3); margin-top:2px; }

  /* Quiz prompt */
  .lp-quiz-prompt { display:flex; align-items:center; gap:16px; padding:20px 22px; background:var(--lp-vl); border:1.5px solid rgba(99,102,241,.2); border-radius:16px; margin-bottom:32px; flex-wrap:wrap; }
  .lp-quiz-prompt-icon { width:48px; height:48px; border-radius:14px; background:var(--lp-v); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .lp-quiz-prompt h3 { font-size:.9rem; font-weight:700; margin:0 0 3px; color:var(--lp-v); }
  .lp-quiz-prompt p { font-size:.78rem; color:var(--lp-vd); margin:0; }
  .lp-quiz-prompt > div { flex:1; min-width:0; }

  /* Quiz panel */
  .lp-quiz-panel { background:var(--lp-card); border:1.5px solid var(--lp-bor); border-radius:18px; padding:28px; margin-bottom:32px; box-shadow:0 4px 16px rgba(0,0,0,.06); }
  .lp-quiz-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .lp-quiz-header h3 { font-size:.95rem; font-weight:700; margin:0; }
  .lp-quiz-close { width:30px; height:30px; border-radius:8px; border:1.5px solid var(--lp-bor); background:var(--lp-bg); color:var(--lp-ink-2); cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; }
  .lp-quiz-close:hover { border-color:var(--lp-r); color:var(--lp-r); background:var(--lp-rl); }
  .lp-question { margin-bottom:24px; }
  .lp-question-text { font-size:.875rem; font-weight:700; color:var(--lp-ink); margin:0 0 12px; display:flex; align-items:flex-start; gap:8px; }
  .lp-question-num { background:var(--lp-v); color:#fff; font-size:.65rem; font-weight:800; padding:2px 8px; border-radius:100px; flex-shrink:0; margin-top:1px; }
  .lp-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .lp-option { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:11px; border:1.5px solid var(--lp-bor); background:var(--lp-bg); cursor:pointer; text-align:left; font-family:var(--lp-font); font-size:.82rem; color:var(--lp-ink-2); transition:all .15s var(--lp-ease); }
  .lp-option:hover { border-color:var(--lp-v); background:var(--lp-vl); }
  .lp-option--selected { border-color:var(--lp-v); background:var(--lp-vl); color:var(--lp-v); font-weight:700; }
  .lp-option-letter { width:24px; height:24px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:.68rem; font-weight:800; flex-shrink:0; background:var(--lp-card); border:1.5px solid var(--lp-bor); color:var(--lp-ink-2); }
  .lp-option-letter--on { background:var(--lp-v); border-color:var(--lp-v); color:#fff; }
  .lp-option-text--on { color:var(--lp-v); font-weight:700; }
  .lp-quiz-footer { display:flex; align-items:center; justify-content:space-between; padding-top:20px; border-top:1px solid var(--lp-bor); margin-top:8px; }
  .lp-quiz-progress { font-size:.75rem; color:var(--lp-ink-3); font-weight:500; }

  /* Quiz result */
  .lp-quiz-result { text-align:center; padding:40px 32px; border-radius:18px; margin-bottom:32px; }
  .lp-quiz-result--pass { background:var(--lp-gl); border:1.5px solid rgba(5,150,105,.2); }
  .lp-quiz-result--fail { background:#fef3c7; border:1.5px solid rgba(245,158,11,.2); }
  .lp-result-icon { width:56px; height:56px; border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
  .lp-result-icon--pass { background:var(--lp-g); color:#fff; }
  .lp-result-icon--fail { background:#f59e0b; color:#fff; }
  .lp-result-score { font-family:var(--lp-serif); font-style:italic; font-size:2.4rem; font-weight:700; margin:0 0 8px; }
  .lp-quiz-result--pass .lp-result-score { color:var(--lp-g); }
  .lp-quiz-result--fail .lp-result-score { color:#92400e; }
  .lp-result-msg { font-size:.875rem; color:var(--lp-ink-2); margin:0 0 20px; }
  .lp-result-actions { display:flex; align-items:center; justify-content:center; gap:10px; flex-wrap:wrap; }

  /* Final quiz */
  .lp-final-quiz { display:flex; flex-direction:column; align-items:center; text-align:center; padding:36px 28px; border-radius:18px; background:var(--lp-vl); border:1.5px solid rgba(99,102,241,.2); margin-bottom:32px; gap:10px; }
  .lp-final-quiz--passed { background:var(--lp-gl); border-color:rgba(5,150,105,.2); }
  .lp-final-quiz-icon { width:54px; height:54px; border-radius:16px; background:var(--lp-v); color:#fff; display:flex; align-items:center; justify-content:center; margin-bottom:4px; }
  .lp-final-quiz--passed .lp-final-quiz-icon { background:var(--lp-g); }
  .lp-final-quiz h3 { font-size:1rem; font-weight:700; margin:0; color:var(--lp-vd); }
  .lp-final-quiz--passed h3 { color:#065f46; }
  .lp-final-quiz p { font-size:.82rem; color:var(--lp-vd); margin:0; max-width:420px; line-height:1.6; }
  .lp-final-quiz--passed p { color:#065f46; }

  /* Bottom nav */
  .lp-bottom-nav { display:flex; align-items:center; justify-content:space-between; padding:24px 40px 32px; border-top:1px solid var(--lp-bor); margin-top:24px; gap:12px; flex-wrap:wrap; }
  .lp-bottom-center { display:flex; align-items:center; gap:10px; }
  .lp-already-done { display:inline-flex; align-items:center; gap:6px; font-size:.82rem; font-weight:700; color:var(--lp-g); }

  /* Buttons */
  .lp-btn { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border-radius:100px; font-family:var(--lp-font); font-size:.82rem; font-weight:700; border:none; cursor:pointer; transition:all .2s var(--lp-ease); white-space:nowrap; }
  .lp-btn--violet { background:var(--lp-v); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,.3); }
  .lp-btn--violet:hover { background:var(--lp-vd); transform:translateY(-1px); box-shadow:0 6px 18px rgba(99,102,241,.4); }
  .lp-btn--green  { background:var(--lp-g); color:#fff; box-shadow:0 4px 12px rgba(5,150,105,.3); }
  .lp-btn--green:hover { background:#047857; transform:translateY(-1px); }
  .lp-btn--ghost  { background:var(--lp-bg); color:var(--lp-ink-2); border:1.5px solid var(--lp-bor); }
  .lp-btn--ghost:hover { border-color:var(--lp-v); color:var(--lp-v); background:var(--lp-vl); }

  /* Spinner */
  .lp-spinner { width:13px; height:13px; border-radius:50%; border:2px solid transparent; animation:lp-spin .7s linear infinite; display:block; }
  .lp-spinner--white { border-color:rgba(255,255,255,.3); border-top-color:#fff; }
  @keyframes lp-spin { to{transform:rotate(360deg)} }

  @media (max-width:900px) {
    .lp-sidebar { display:none; }
    .lp-options { grid-template-columns:1fr; }
    .lp-content { padding:24px 20px 0; }
    .lp-bottom-nav { padding:20px; }
    .lp-topbar { padding:12px 20px; }
  }
`;