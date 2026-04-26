import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';
import { generateCertificatePDF } from '../../utils/CertificatePdf';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getEnrolledCourses();
        setCourses(data);
        setError(null);
      } catch (err) {
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
      alert('Erreur lors de la génération du certificat. Veuillez réessayer.');
    } finally {
      setDownloadingCert(null);
    }
  };

  const counts = {
    ALL: courses.length,
    IN_PROGRESS: courses.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100).length,
    COMPLETED: courses.filter(c => c.progressPercentage === 100).length,
    NOT_STARTED: courses.filter(c => c.progressPercentage === 0).length,
  };

  const filtered = courses.filter(c => {
    if (filter === 'IN_PROGRESS') return c.progressPercentage > 0 && c.progressPercentage < 100;
    if (filter === 'COMPLETED') return c.progressPercentage === 100;
    if (filter === 'NOT_STARTED') return c.progressPercentage === 0;
    return true;
  });

  if (loading) {
    return (
      <div className="sc-loading">
        <div className="sc-loader" />
        <span>Chargement de vos cours…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .sc-loading { min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .sc-loader { width:32px; height:32px; border:3px solid #ede9fe; border-top-color:#6366f1; border-radius:50%; animation:sc-spin .8s linear infinite; }
          @keyframes sc-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sc-error-banner">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
        <style>{`.sc-error-banner { display:flex; align-items:center; gap:10px; background:#fef2f2; border:1px solid #fecaca; color:#991b1b; border-radius:12px; padding:14px 18px; font-size:.875rem; margin:24px; }`}</style>
      </div>
    );
  }

  return (
    <div className="sc-root">
      <style>{css}</style>

      {/* Header */}
      <header className="sc-header">
        <div>
          <p className="sc-eyebrow">Espace apprenant</p>
          <h1 className="sc-title">Mes <em>Cours</em></h1>
          <p className="sc-sub">Continuez là où vous vous êtes arrêté.</p>
        </div>
        <Link to="/student/dashboard/catalog" className="sc-catalog-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Explorer le catalogue
        </Link>
      </header>

      {/* Stats strip */}
      {courses.length > 0 && (
        <div className="sc-stats">
          <div className="sc-stat">
            <span className="sc-stat-value">{courses.length}</span>
            <span className="sc-stat-label">Cours inscrits</span>
          </div>
          <div className="sc-stat-divider" />
          <div className="sc-stat">
            <span className="sc-stat-value sc-stat-value--violet">{counts.IN_PROGRESS}</span>
            <span className="sc-stat-label">En cours</span>
          </div>
          <div className="sc-stat-divider" />
          <div className="sc-stat">
            <span className="sc-stat-value sc-stat-value--green">{counts.COMPLETED}</span>
            <span className="sc-stat-label">Terminés</span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {courses.length > 0 && (
        <div className="sc-tabs">
          {[
            { key: 'ALL',         label: 'Tous' },
            { key: 'IN_PROGRESS', label: '▶ En cours' },
            { key: 'COMPLETED',   label: '✅ Terminés' },
            { key: 'NOT_STARTED', label: '○ Non commencés' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`sc-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="sc-tab-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 && courses.length > 0 ? (
        <div className="sc-filter-empty">
          <p>Aucun cours dans cette catégorie.</p>
          <button className="sc-reset-btn" onClick={() => setFilter('ALL')}>Voir tous les cours</button>
        </div>
      ) : filtered.length === 0 ? (
        /* Full empty state */
        <div className="sc-empty">
          <div className="sc-empty-icon">
            <svg width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2>L'aventure commence ici !</h2>
          <p>Vous n'êtes inscrit à aucun cours. Explorez le catalogue pour trouver votre prochaine passion.</p>
          <Link to="/student/dashboard/catalog" className="sc-catalog-btn">
            Découvrir le catalogue
          </Link>
        </div>
      ) : (
        <div className="sc-grid">
          {filtered.map((course, i) => {
            const done = course.progressPercentage === 100;
            const started = course.progressPercentage > 0;
            return (
              <article key={course.id} className="sc-card" style={{ animationDelay: `${i * 50}ms` }}>
                {/* Thumb */}
                <div className="sc-thumb">
                  <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop'}
                    alt={course.title}
                    loading="lazy"
                  />
                  <div className="sc-thumb-overlay" />
                  {done && (
                    <div className="sc-completed-badge">
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Complété
                    </div>
                  )}
                  <div className="sc-thumb-progress">
                    <div
                      className={`sc-thumb-progress-fill ${done ? 'sc-thumb-progress-fill--done' : ''}`}
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="sc-body">
                  <h2 className="sc-course-title">{course.title}</h2>

                  {course.instructorName && (
                    <div className="sc-instructor">
                      <div className="sc-instructor-avatar">
                        {course.instructorName.charAt(0).toUpperCase()}
                      </div>
                      <span>{course.instructorName}</span>
                    </div>
                  )}

                  {/* Progress */}
                  <div className="sc-progress-section">
                    <div className="sc-progress-meta">
                      <span className={`sc-progress-pct ${done ? 'sc-progress-pct--done' : ''}`}>
                        {course.progressPercentage}%
                      </span>
                      <span className="sc-progress-lessons">
                        {course.completedLessons} / {course.totalLessons} leçons
                      </span>
                    </div>
                    <div className="sc-progress-track">
                      <div
                        className={`sc-progress-fill ${done ? 'sc-progress-fill--done' : ''}`}
                        style={{ width: `${course.progressPercentage}%` }}
                      >
                        {!done && course.progressPercentage > 0 && (
                          <span className="sc-progress-glow" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sc-actions">
                    <Link
                      to={`/student/course/${course.id}`}
                      className={`sc-main-btn ${done ? 'sc-main-btn--review' : 'sc-main-btn--continue'}`}
                    >
                      {done ? (
                        <>
                          <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.804 8 5 4.633v6.734L10.804 8z"/>
                          </svg>
                          Revoir
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                          </svg>
                          {started ? 'Continuer' : 'Commencer'}
                        </>
                      )}
                    </Link>

                    {done && (
                      <button
                        className="sc-cert-btn"
                        onClick={() => handleDownloadCertificate(course.id)}
                        disabled={downloadingCert === course.id}
                        title="Télécharger le certificat"
                      >
                        {downloadingCert === course.id ? (
                          <span className="sc-spinner" />
                        ) : (
                          <svg width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --sc-ink:     #111117;
    --sc-ink-2:   #52525b;
    --sc-ink-3:   #a1a1aa;
    --sc-bg:      #f5f5f8;
    --sc-card:    #ffffff;
    --sc-border:  rgba(0,0,0,0.07);
    --sc-violet:  #6366f1;
    --sc-violet-l:#eef2ff;
    --sc-violet-d:#4338ca;
    --sc-green:   #059669;
    --sc-green-l: #d1fae5;
    --sc-r:       20px;
    --sc-ease:    cubic-bezier(0.22,1,0.36,1);
    --sc-font:    'Sora', system-ui, sans-serif;
    --sc-serif:   'Lora', Georgia, serif;
  }

  .sc-root {
    font-family: var(--sc-font);
    color: var(--sc-ink);
    padding: 36px 40px 64px;
    max-width: 1100px;
    animation: sc-fade .35s ease both;
  }
  @keyframes sc-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes sc-up {
    from { opacity:0; transform:translateY(14px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* Header */
  .sc-header {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    margin-bottom: 32px;
  }
  .sc-eyebrow {
    font-size: .68rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--sc-violet); margin: 0 0 8px;
  }
  .sc-title {
    font-size: clamp(1.6rem, 2.8vw, 2.1rem); font-weight: 700;
    letter-spacing: -.02em; margin: 0 0 4px; line-height: 1.15;
  }
  .sc-title em { font-family: var(--sc-serif); font-style: italic; color: var(--sc-violet); }
  .sc-sub { font-size: .82rem; color: var(--sc-ink-2); margin: 0; }

  .sc-catalog-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--sc-ink); color: #fff;
    font-family: var(--sc-font); font-size: .82rem; font-weight: 600;
    padding: 11px 22px; border-radius: 100px;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,.14);
    transition: background .2s, transform .2s var(--sc-ease), box-shadow .2s;
    white-space: nowrap;
  }
  .sc-catalog-btn:hover {
    background: var(--sc-violet-d); color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(99,102,241,.35);
  }

  /* Stats strip */
  .sc-stats {
    display: flex; align-items: center; gap: 0;
    background: var(--sc-card);
    border: 1.5px solid var(--sc-border);
    border-radius: 14px; padding: 16px 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    width: fit-content;
  }
  .sc-stat { display: flex; flex-direction: column; align-items: center; padding: 0 20px; }
  .sc-stat-divider { width: 1px; height: 32px; background: var(--sc-border); }
  .sc-stat-value {
    font-family: var(--sc-serif); font-style: italic;
    font-size: 1.6rem; font-weight: 700; line-height: 1; color: var(--sc-ink);
  }
  .sc-stat-value--violet { color: var(--sc-violet); }
  .sc-stat-value--green  { color: var(--sc-green); }
  .sc-stat-label { font-size: .68rem; font-weight: 600; color: var(--sc-ink-3); margin-top: 3px; text-transform: uppercase; letter-spacing: .06em; }

  /* Tabs */
  .sc-tabs {
    display: flex; gap: 6px; flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .sc-tab {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid var(--sc-border);
    background: var(--sc-card);
    font-family: var(--sc-font); font-size: .78rem; font-weight: 600;
    color: var(--sc-ink-2); cursor: pointer;
    transition: all .2s var(--sc-ease);
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .sc-tab:hover:not(.active) { border-color: var(--sc-violet); color: var(--sc-violet); }
  .sc-tab.active {
    background: var(--sc-violet); border-color: var(--sc-violet);
    color: #fff; box-shadow: 0 4px 14px rgba(99,102,241,.3);
  }
  .sc-tab-count {
    background: rgba(0,0,0,.09); border-radius: 100px;
    padding: 1px 7px; font-size: .65rem; font-weight: 700;
  }
  .sc-tab.active .sc-tab-count { background: rgba(255,255,255,.25); }

  /* Grid */
  .sc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 22px;
  }

  /* Card */
  .sc-card {
    background: var(--sc-card);
    border-radius: var(--sc-r);
    overflow: hidden;
    border: 1.5px solid var(--sc-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    display: flex; flex-direction: column;
    animation: sc-up .45s var(--sc-ease) both;
    transition: transform .28s var(--sc-ease), box-shadow .28s, border-color .2s;
  }
  .sc-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 36px rgba(99,102,241,.1);
    border-color: rgba(99,102,241,.25);
  }

  /* Thumb */
  .sc-thumb {
    position: relative; height: 190px; overflow: hidden;
    flex-shrink: 0; background: var(--sc-bg);
  }
  .sc-thumb img { width:100%; height:100%; object-fit:cover; transition: transform .5s ease; }
  .sc-card:hover .sc-thumb img { transform: scale(1.05); }
  .sc-thumb-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,15,18,.55) 0%, transparent 55%);
  }
  .sc-completed-badge {
    position: absolute; top: 12px; right: 12px;
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--sc-green); color: #fff;
    font-size: .68rem; font-weight: 700;
    padding: 4px 11px; border-radius: 100px;
    box-shadow: 0 2px 8px rgba(5,150,105,.4);
  }
  .sc-thumb-progress {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: rgba(255,255,255,.2);
  }
  .sc-thumb-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sc-violet), #a78bfa);
    transition: width .8s ease;
  }
  .sc-thumb-progress-fill--done { background: var(--sc-green); }

  /* Body */
  .sc-body { padding: 20px 20px 18px; display: flex; flex-direction: column; flex: 1; }
  .sc-course-title {
    font-family: var(--sc-serif); font-style: italic;
    font-size: 1.05rem; font-weight: 700; line-height: 1.35;
    margin: 0 0 10px; color: var(--sc-ink);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .sc-instructor {
    display: flex; align-items: center; gap: 7px;
    margin-bottom: 16px;
  }
  .sc-instructor-avatar {
    width: 22px; height: 22px; border-radius: 7px;
    background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
    color: var(--sc-violet-d);
    display: flex; align-items: center; justify-content: center;
    font-size: .62rem; font-weight: 700; flex-shrink: 0;
  }
  .sc-instructor span { font-size: .75rem; color: var(--sc-ink-2); font-weight: 500; }

  /* Progress */
  .sc-progress-section { margin-bottom: 16px; }
  .sc-progress-meta {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 7px;
  }
  .sc-progress-pct { font-size: .8rem; font-weight: 700; color: var(--sc-violet); }
  .sc-progress-pct--done { color: var(--sc-green); }
  .sc-progress-lessons { font-size: .72rem; color: var(--sc-ink-3); }
  .sc-progress-track {
    height: 6px; background: var(--sc-bg);
    border-radius: 100px; overflow: hidden; position: relative;
  }
  .sc-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sc-violet), #a78bfa);
    border-radius: 100px;
    position: relative;
    transition: width 1s ease;
  }
  .sc-progress-fill--done { background: var(--sc-green); }
  .sc-progress-glow {
    position: absolute; right: 0; top: 50%;
    transform: translateY(-50%);
    width: 10px; height: 10px; border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 6px var(--sc-violet);
  }

  /* Actions */
  .sc-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 4px; }
  .sc-main-btn {
    flex: 1; display: inline-flex; align-items: center; justify-content: center;
    gap: 7px; padding: 10px 16px; border-radius: 12px;
    font-family: var(--sc-font); font-size: .82rem; font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    transition: all .2s var(--sc-ease);
  }
  .sc-main-btn--continue {
    background: var(--sc-violet); color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,.3);
  }
  .sc-main-btn--continue:hover {
    background: var(--sc-violet-d); transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(99,102,241,.4);
    color: #fff;
  }
  .sc-main-btn--review {
    background: var(--sc-violet-l); color: var(--sc-violet);
    border: 1.5px solid rgba(99,102,241,.2);
  }
  .sc-main-btn--review:hover {
    background: #e0e7ff; transform: translateY(-1px);
    color: var(--sc-violet);
  }

  .sc-cert-btn {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    background: var(--sc-green-l); color: var(--sc-green);
    border: none; cursor: pointer; flex-shrink: 0;
    transition: all .2s var(--sc-ease);
  }
  .sc-cert-btn:hover:not(:disabled) { background: #a7f3d0; transform: translateY(-1px); }
  .sc-cert-btn:disabled { opacity: .6; cursor: not-allowed; }

  .sc-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(5,150,105,.25);
    border-top-color: var(--sc-green);
    animation: sc-spin .7s linear infinite; display: block;
  }
  @keyframes sc-spin { to { transform: rotate(360deg) } }

  /* Empty */
  .sc-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center; gap: 14px;
    background: var(--sc-card);
    border-radius: var(--sc-r);
    border: 1.5px dashed var(--sc-border);
    max-width: 480px; margin: 0 auto;
  }
  .sc-empty-icon {
    width: 72px; height: 72px;
    background: var(--sc-violet-l); color: var(--sc-violet);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .sc-empty h2 { font-family: var(--sc-serif); font-style: italic; font-size: 1.35rem; font-weight: 700; margin: 0; }
  .sc-empty p  { font-size: .875rem; color: var(--sc-ink-2); margin: 0; line-height: 1.6; max-width: 320px; }

  .sc-filter-empty {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 48px 24px; text-align: center;
    font-size: .875rem; color: var(--sc-ink-2);
  }
  .sc-reset-btn {
    background: var(--sc-violet); color: #fff; border: none;
    border-radius: 100px; padding: 8px 20px;
    font-family: var(--sc-font); font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: background .2s;
  }
  .sc-reset-btn:hover { background: var(--sc-violet-d); }

  @media (max-width: 640px) {
    .sc-root { padding: 22px 16px 48px; }
    .sc-grid { grid-template-columns: 1fr; }
    .sc-stats { width: 100%; justify-content: space-around; }
    .sc-catalog-btn { display: none; }
  }
`;