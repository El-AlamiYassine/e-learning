import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getCourseDetail(id);
        setCourse(data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les détails du cours.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      await studentApi.enroll(id);
      const data = await studentApi.getCourseDetail(id);
      setCourse(data);
    } catch (err) {
      alert("Erreur lors de l'inscription.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <div className="cd-loader" />
        <span>Chargement du cours…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .cd-loading{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:'Sora',sans-serif;color:#71717a;font-size:.875rem}
          .cd-loader{width:32px;height:32px;border:3px solid #ede9fe;border-top-color:#6366f1;border-radius:50%;animation:cd-spin .8s linear infinite}
          @keyframes cd-spin{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="cd-error-wrap">
        <div className="cd-error-box">
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error || 'Cours introuvable'}</p>
          <Link to="/student/dashboard/courses" className="cd-back-link">← Retour à mes cours</Link>
        </div>
        <style>{`.cd-error-wrap{display:flex;align-items:center;justify-content:center;min-height:60vh}.cd-error-box{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;padding:40px;background:#fff;border-radius:20px;border:1.5px solid rgba(0,0,0,.08);box-shadow:0 4px 16px rgba(0,0,0,.06);max-width:360px;color:#52525b;font-size:.875rem}.cd-back-link{color:#6366f1;font-weight:600;text-decoration:none}`}</style>
      </div>
    );
  }

  const nextLesson = course.lessons.find(l => !l.completed) || course.lessons[0];
  const completedCount = course.lessons.filter(l => l.completed).length;
  const pct = course.progressPercentage || 0;
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="cd-root">
      <style>{css}</style>

      {/* ── HERO ─────────────────────────────── */}
      <div className="cd-hero">
        {/* Background image */}
        <div
          className="cd-hero-bg"
          style={{ backgroundImage: `url(${course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=80'})` }}
        />
        <div className="cd-hero-overlay" />

        <div className="cd-hero-inner">
          {/* Breadcrumb */}
          <nav className="cd-breadcrumb">
            <Link to="/student/dashboard/courses">Mes cours</Link>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span>Détail</span>
          </nav>

          <div className="cd-hero-content">
            <div className="cd-hero-left">
              {course.categoryName && (
                <span className="cd-category-chip">{course.categoryName}</span>
              )}
              <h1 className="cd-title">{course.title}</h1>
              <p className="cd-description">{course.description}</p>

              <div className="cd-instructor">
                <div className="cd-instructor-av">
                  {course.instructorName?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <span className="cd-instructor-name">{course.instructorName}</span>
                  <span className="cd-instructor-label">Formateur</span>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="cd-hero-actions">
                {course.enrolled && course.lessons.length > 0 && (
                  <Link to={`/student/lesson/${nextLesson.id}`} className="cd-btn cd-btn--primary">
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {pct > 0 ? 'Continuer' : 'Démarrer'}
                  </Link>
                )}
                {!course.enrolled && (
                  <button className="cd-btn cd-btn--primary" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? <span className="cd-spinner cd-spinner--white" /> : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    {enrolling ? 'Inscription…' : "S'inscrire"}
                  </button>
                )}
                {pct === 100 && (!course.hasFinalQuiz || course.finalQuizPassed) && (
                  <button
                    className="cd-btn cd-btn--cert"
                    onClick={() => window.open(`http://localhost:8080/api/student/courses/${course.id}/certificate`, '_blank')}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Certificat
                  </button>
                )}
              </div>
            </div>

            {/* Progress gauge */}
            {course.enrolled && (
              <div className="cd-gauge-wrap">
                <div className="cd-gauge-card">
                  <svg className="cd-gauge-svg" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="28" fill="none"
                      stroke={pct === 100 ? '#10b981' : '#a78bfa'}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 40 40)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                    <text x="40" y="37" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="inherit">{pct}%</text>
                    <text x="40" y="50" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="7" fontFamily="inherit">terminé</text>
                  </svg>
                  <div className="cd-gauge-stats">
                    <div className="cd-gauge-stat">
                      <span className="cd-gauge-n">{completedCount}</span>
                      <span className="cd-gauge-l">leçons vues</span>
                    </div>
                    <div className="cd-gauge-sep" />
                    <div className="cd-gauge-stat">
                      <span className="cd-gauge-n">{course.lessons.length - completedCount}</span>
                      <span className="cd-gauge-l">restantes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────── */}
      <div className="cd-body">

        {/* Lessons column */}
        <div className="cd-lessons-col">
          <div className="cd-panel">
            <div className="cd-panel-head">
              <div className="cd-panel-icon cd-panel-icon--violet">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="cd-panel-title">Programme du cours</h2>
              <span className="cd-panel-badge">{course.lessons.length} leçon{course.lessons.length !== 1 ? 's' : ''}</span>
            </div>

            {course.lessons.length === 0 ? (
              <div className="cd-lessons-empty">
                <p>Aucune leçon disponible pour ce cours.</p>
              </div>
            ) : (
              <div className="cd-lessons">
                {course.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className={`cd-lesson ${lesson.completed ? 'cd-lesson--done' : ''}`}>
                    <div className="cd-lesson-num">
                      {lesson.completed ? (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : idx + 1}
                    </div>
                    <div className="cd-lesson-info">
                      <span className="cd-lesson-title">{lesson.title}</span>
                      <span className="cd-lesson-meta">Leçon vidéo · ~15 min</span>
                    </div>
                    <Link
                      to={`/student/lesson/${lesson.id}`}
                      className={`cd-lesson-btn ${lesson.completed ? 'cd-lesson-btn--done' : 'cd-lesson-btn--go'}`}
                    >
                      {lesson.completed ? 'Revoir' : 'Démarrer'}
                    </Link>
                  </div>
                ))}

                {/* Quiz finale */}
                {course.hasFinalQuiz && (
                  <div className={`cd-lesson cd-lesson--quiz ${course.finalQuizPassed ? 'cd-lesson--done' : ''}`}>
                    <div className={`cd-lesson-num ${course.finalQuizPassed ? '' : 'cd-lesson-num--quiz'}`}>
                      {course.finalQuizPassed ? (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="cd-lesson-info">
                      <span className="cd-lesson-title">Quiz Final de Certification</span>
                      <span className="cd-lesson-meta">Examen final · Requis pour le certificat</span>
                    </div>
                    <Link
                      to={`/student/lesson/${course.lessons[0]?.id}`}
                      className={`cd-lesson-btn ${course.finalQuizPassed ? 'cd-lesson-btn--done' : 'cd-lesson-btn--go'}`}
                    >
                      {course.finalQuizPassed ? 'Revoir' : 'Passer'}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="cd-sidebar">

          {/* Details */}
          <div className="cd-panel cd-panel--sm">
            <h3 className="cd-sidebar-title">Détails</h3>
            <div className="cd-details">
              <div className="cd-detail-row">
                <div className="cd-detail-icon cd-detail-icon--violet">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className="cd-detail-label">Durée estimée</span>
                  <span className="cd-detail-value">{course.lessons.length * 45} minutes</span>
                </div>
              </div>
              <div className="cd-detail-row">
                <div className="cd-detail-icon cd-detail-icon--blue">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <span className="cd-detail-label">Leçons</span>
                  <span className="cd-detail-value">{course.lessons.length} vidéos & docs</span>
                </div>
              </div>
              <div className="cd-detail-row">
                <div className="cd-detail-icon cd-detail-icon--green">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="cd-detail-label">Certification</span>
                  <span className="cd-detail-value">{course.hasFinalQuiz ? 'Après quiz final' : 'À la fin du cours'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="cd-support">
            <div className="cd-support-icon">💬</div>
            <h4>Besoin d'aide ?</h4>
            <p>Une question sur le programme ? Notre équipe est là pour vous accompagner.</p>
            <button className="cd-support-btn">Contacter le formateur</button>
          </div>

        </aside>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@0,700;1,700&display=swap');

  :root {
    --cd-ink:    #111117;
    --cd-ink-2:  #52525b;
    --cd-ink-3:  #a1a1aa;
    --cd-bg:     #f5f5f8;
    --cd-card:   #ffffff;
    --cd-border: rgba(0,0,0,.07);
    --cd-violet: #6366f1;
    --cd-vl:     #eef2ff;
    --cd-vd:     #4338ca;
    --cd-green:  #059669;
    --cd-gl:     #d1fae5;
    --cd-blue:   #0ea5e9;
    --cd-bl:     #f0f9ff;
    --cd-r:      18px;
    --cd-ease:   cubic-bezier(.22,1,.36,1);
    --cd-font:   'Sora', system-ui, sans-serif;
    --cd-serif:  'Lora', Georgia, serif;
  }

  .cd-root { font-family:var(--cd-font); color:var(--cd-ink); background:var(--cd-bg); min-height:100vh; animation:cd-fade .35s ease both; }
  @keyframes cd-fade { from{opacity:0} to{opacity:1} }
  @keyframes cd-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

  /* ── HERO ─────────────────────────────── */
  .cd-hero { position:relative; overflow:hidden; min-height:380px; display:flex; flex-direction:column; }
  .cd-hero-bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform 8s ease; }
  .cd-hero:hover .cd-hero-bg { transform:scale(1.03); }
  .cd-hero-overlay { position:absolute; inset:0; background:linear-gradient(to right, rgba(8,8,15,.92) 0%, rgba(8,8,15,.75) 50%, rgba(8,8,15,.5) 100%); }
  .cd-hero-inner { position:relative; max-width:1100px; margin:0 auto; padding:32px 36px 40px; flex:1; width:100%; }

  .cd-breadcrumb { display:flex; align-items:center; gap:6px; font-size:.75rem; color:rgba(255,255,255,.4); margin-bottom:28px; }
  .cd-breadcrumb a { color:rgba(255,255,255,.5); text-decoration:none; font-weight:500; transition:color .2s; }
  .cd-breadcrumb a:hover { color:rgba(255,255,255,.85); }
  .cd-breadcrumb svg { flex-shrink:0; }
  .cd-breadcrumb span { color:rgba(255,255,255,.7); font-weight:600; }

  .cd-hero-content { display:flex; align-items:flex-end; justify-content:space-between; gap:32px; flex-wrap:wrap; }
  .cd-hero-left { flex:1; min-width:0; }

  .cd-category-chip { display:inline-block; background:rgba(99,102,241,.7); backdrop-filter:blur(8px); border:1px solid rgba(99,102,241,.4); color:#c7d2fe; font-size:.65rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:4px 12px; border-radius:100px; margin-bottom:14px; }

  .cd-title { font-family:var(--cd-serif); font-size:clamp(1.6rem,3.5vw,2.4rem); font-weight:700; color:#fff; margin:0 0 14px; line-height:1.2; }
  .cd-description { font-size:.875rem; color:rgba(255,255,255,.55); margin:0 0 20px; line-height:1.65; max-width:560px; }

  .cd-instructor { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
  .cd-instructor-av { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--cd-violet),#818cf8); color:#fff; display:flex; align-items:center; justify-content:center; font-size:.72rem; font-weight:800; flex-shrink:0; }
  .cd-instructor-name { display:block; font-size:.85rem; font-weight:700; color:#fff; }
  .cd-instructor-label { display:block; font-size:.68rem; color:rgba(255,255,255,.4); }

  .cd-hero-actions { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .cd-btn { display:inline-flex; align-items:center; gap:8px; font-family:var(--cd-font); font-size:.85rem; font-weight:700; padding:11px 24px; border-radius:100px; border:none; cursor:pointer; text-decoration:none; transition:all .2s var(--cd-ease); white-space:nowrap; }
  .cd-btn--primary { background:var(--cd-violet); color:#fff; box-shadow:0 4px 16px rgba(99,102,241,.4); }
  .cd-btn--primary:hover:not(:disabled) { background:var(--cd-vd); transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,.5); color:#fff; }
  .cd-btn--primary:disabled { opacity:.7; cursor:not-allowed; }
  .cd-btn--cert { background:rgba(255,255,255,.1); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,.2); color:#fff; }
  .cd-btn--cert:hover { background:rgba(255,255,255,.18); transform:translateY(-1px); }

  /* Gauge */
  .cd-gauge-wrap { flex-shrink:0; }
  .cd-gauge-card { background:rgba(255,255,255,.07); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.12); border-radius:20px; padding:20px 24px; display:flex; flex-direction:column; align-items:center; gap:16px; min-width:180px; }
  .cd-gauge-svg { width:90px; height:90px; }
  .cd-gauge-stats { display:flex; align-items:center; gap:0; width:100%; justify-content:center; }
  .cd-gauge-stat { display:flex; flex-direction:column; align-items:center; padding:0 12px; }
  .cd-gauge-sep { width:1px; height:24px; background:rgba(255,255,255,.15); }
  .cd-gauge-n { font-family:var(--cd-serif); font-style:italic; font-size:1.3rem; font-weight:700; color:#fff; line-height:1; }
  .cd-gauge-l { font-size:.6rem; color:rgba(255,255,255,.4); text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }

  /* Spinner */
  .cd-spinner { width:14px; height:14px; border-radius:50%; border:2px solid transparent; animation:cd-spin .7s linear infinite; display:block; }
  .cd-spinner--white { border-color:rgba(255,255,255,.3); border-top-color:#fff; }
  @keyframes cd-spin { to{transform:rotate(360deg)} }

  /* ── BODY ─────────────────────────────── */
  .cd-body { max-width:1100px; margin:0 auto; padding:32px 36px 64px; display:grid; grid-template-columns:1fr 300px; gap:24px; align-items:start; }

  /* Panel */
  .cd-panel { background:var(--cd-card); border-radius:var(--cd-r); padding:28px; border:1.5px solid var(--cd-border); box-shadow:0 2px 8px rgba(0,0,0,.04); animation:cd-up .45s var(--cd-ease) both; }
  .cd-panel--sm { padding:22px; }
  .cd-panel-head { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
  .cd-panel-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cd-panel-icon--violet { background:var(--cd-vl); color:var(--cd-violet); }
  .cd-panel-title { font-size:.92rem; font-weight:700; margin:0; flex:1; letter-spacing:-.01em; }
  .cd-panel-badge { background:var(--cd-vl); color:var(--cd-violet); font-size:.68rem; font-weight:700; padding:3px 10px; border-radius:100px; flex-shrink:0; }

  /* Lessons */
  .cd-lessons { display:flex; flex-direction:column; gap:8px; }
  .cd-lessons-empty { text-align:center; padding:32px; font-size:.875rem; color:var(--cd-ink-3); }

  .cd-lesson { display:flex; align-items:center; gap:14px; padding:13px 16px; border-radius:13px; border:1.5px solid var(--cd-border); background:var(--cd-bg); transition:all .2s var(--cd-ease); }
  .cd-lesson:hover { border-color:rgba(99,102,241,.25); background:var(--cd-vl); transform:translateX(4px); }
  .cd-lesson--done { border-color:rgba(5,150,105,.2); background:#f0fdf4; }
  .cd-lesson--done:hover { border-color:rgba(5,150,105,.35); background:#dcfce7; }
  .cd-lesson--quiz { border-color:rgba(99,102,241,.2); background:var(--cd-vl); }

  .cd-lesson-num { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:800; flex-shrink:0; background:var(--cd-card); border:1.5px solid var(--cd-border); color:var(--cd-ink-2); }
  .cd-lesson--done .cd-lesson-num { background:var(--cd-gl); color:var(--cd-green); border-color:transparent; }
  .cd-lesson-num--quiz { background:var(--cd-vl); color:var(--cd-violet); border-color:transparent; }

  .cd-lesson-info { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; }
  .cd-lesson-title { font-size:.85rem; font-weight:700; color:var(--cd-ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cd-lesson--done .cd-lesson-title { color:var(--cd-green); }
  .cd-lesson-meta { font-size:.7rem; color:var(--cd-ink-3); }

  .cd-lesson-btn { display:inline-flex; align-items:center; padding:7px 14px; border-radius:9px; font-family:var(--cd-font); font-size:.75rem; font-weight:700; border:none; cursor:pointer; text-decoration:none; white-space:nowrap; flex-shrink:0; transition:all .2s var(--cd-ease); }
  .cd-lesson-btn--go { background:var(--cd-violet); color:#fff; box-shadow:0 3px 10px rgba(99,102,241,.28); }
  .cd-lesson-btn--go:hover { background:var(--cd-vd); transform:translateY(-1px); color:#fff; }
  .cd-lesson-btn--done { background:var(--cd-gl); color:var(--cd-green); }
  .cd-lesson-btn--done:hover { background:#a7f3d0; }

  /* Sidebar */
  .cd-sidebar { display:flex; flex-direction:column; gap:16px; position:sticky; top:24px; animation:cd-up .5s var(--cd-ease) both; }
  .cd-sidebar-title { font-size:.85rem; font-weight:700; margin:0 0 16px; letter-spacing:-.01em; }

  /* Details */
  .cd-details { display:flex; flex-direction:column; gap:10px; }
  .cd-detail-row { display:flex; align-items:center; gap:12px; padding:12px 14px; background:var(--cd-bg); border-radius:12px; }
  .cd-detail-icon { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cd-detail-icon--violet { background:var(--cd-vl); color:var(--cd-violet); }
  .cd-detail-icon--blue   { background:var(--cd-bl); color:var(--cd-blue); }
  .cd-detail-icon--green  { background:var(--cd-gl); color:var(--cd-green); }
  .cd-detail-label { display:block; font-size:.68rem; font-weight:600; color:var(--cd-ink-3); text-transform:uppercase; letter-spacing:.05em; margin-bottom:2px; }
  .cd-detail-value { display:block; font-size:.82rem; font-weight:700; color:var(--cd-ink); }

  /* Support */
  .cd-support { background:linear-gradient(135deg, #ede9fe, #e0e7ff); border:1.5px solid rgba(99,102,241,.2); border-radius:var(--cd-r); padding:22px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; }
  .cd-support-icon { font-size:1.6rem; }
  .cd-support h4 { font-size:.88rem; font-weight:700; margin:0; color:var(--cd-vd); }
  .cd-support p { font-size:.78rem; color:#4338ca; margin:0; line-height:1.55; }
  .cd-support-btn { margin-top:4px; width:100%; background:var(--cd-violet); color:#fff; border:none; border-radius:100px; padding:9px 18px; font-family:var(--cd-font); font-size:.78rem; font-weight:700; cursor:pointer; transition:background .2s,transform .2s; }
  .cd-support-btn:hover { background:var(--cd-vd); transform:translateY(-1px); }

  @media (max-width:900px) {
    .cd-body { grid-template-columns:1fr; }
    .cd-sidebar { position:static; }
  }
  @media (max-width:640px) {
    .cd-hero-inner { padding:24px 18px 32px; }
    .cd-body { padding:20px 16px 48px; }
    .cd-gauge-wrap { display:none; }
    .cd-lesson { flex-wrap:wrap; }
    .cd-lesson-btn { width:100%; justify-content:center; }
  }
`;