import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import studentApi from '../../api/studentApi';
import { generateCertificatePDF } from '../../utils/CertificatePdf';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await studentApi.getDashboardSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les données du tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
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

  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-loader-ring" />
        <span>Chargement de votre espace…</span>
        <style>{loaderStyle}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="db-error">
        <span>{error}</span>
        <style>{loaderStyle}</style>
      </div>
    );
  }

  const attendance = summary?.averageAttendance || 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (attendance / 100) * circumference;

  return (
    <div className="db-root">
      <style>{css}</style>

      {/* ── Top Bar ─────────────────────────────────────── */}
      <header className="db-header">
        <div className="db-header-left">
          <p className="db-date">{new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p>
          <h1 className="db-greeting">
            Bon retour, <em>{user?.prenom}</em>
          </h1>
          <p className="db-subtitle">Voici l'état de votre apprentissage aujourd'hui.</p>
        </div>
        <Link to="/student/dashboard/catalog" className="db-cta-btn">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Explorer les cours
        </Link>
      </header>

      {/* ── Stat Cards ──────────────────────────────────── */}
      <section className="db-stats">

        {/* Enrolled */}
        <div className="db-stat-card" style={{ animationDelay: '0ms' }}>
          <div className="stat-icon-wrap stat-icon-blue">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="stat-body">
            <span className="stat-label">Cours en cours</span>
            <span className="stat-value">{summary?.enrolledCoursesCount || 0}</span>
          </div>
          <div className="stat-decoration stat-deco-blue" />
        </div>

        {/* Completed */}
        <div className="db-stat-card" style={{ animationDelay: '80ms' }}>
          <div className="stat-icon-wrap stat-icon-emerald">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div className="stat-body">
            <span className="stat-label">Cours terminés</span>
            <span className="stat-value">{summary?.completedCoursesCount || 0}</span>
          </div>
          <div className="stat-decoration stat-deco-emerald" />
        </div>

        {/* Attendance – radial gauge */}
        <div className="db-stat-card db-stat-card--accent" style={{ animationDelay: '160ms' }}>
          <div className="stat-body">
            <span className="stat-label stat-label--light">Taux d'assiduité</span>
            <span className="stat-value stat-value--light">{attendance}%</span>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: `${attendance}%` }} />
            </div>
          </div>
          <svg className="stat-radial" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
            <text x="40" y="44" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="inherit">{attendance}%</text>
          </svg>
        </div>
      </section>

      {/* ── Main Grid ───────────────────────────────────── */}
      <div className="db-grid">

        {/* Left: Continue Learning */}
        <section className="db-section">
          <div className="db-section-head">
            <h2 className="db-section-title">Poursuivre l'apprentissage</h2>
            <button className="db-see-all">Tout voir →</button>
          </div>

          <div className="db-course-list">
            {summary?.recentCourses?.length > 0 ? (
              summary.recentCourses.map((course, i) => (
                <div key={course.id} className="db-course-row" style={{ animationDelay: `${240 + i * 70}ms` }}>
                  <div className="course-thumb">
                    <img
                      src={course.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80'}
                      alt={course.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-meta">
                      Module {course.completedLessons} / {course.totalLessons}
                    </p>
                    <div className="course-progress-track">
                      <div className="course-progress-fill" style={{ width: `${course.progressPercentage}%` }}>
                        <span className="course-progress-glow" />
                      </div>
                    </div>
                  </div>

                  <div className="course-actions">
                    {course.progressPercentage === 100 && (
                      <button
                        className="action-btn action-btn--cert"
                        onClick={() => handleDownloadCertificate(course.id)}
                        disabled={downloadingCert === course.id}
                        title="Télécharger le certificat"
                      >
                        {downloadingCert === course.id ? (
                          <span className="btn-spinner" />
                        ) : (
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z"/>
                          </svg>
                        )}
                      </button>
                    )}
                    <Link
                      to={`/student/course/${course.id}`}
                      className="action-btn action-btn--play"
                      title="Continuer"
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="db-empty">
                <div className="db-empty-icon">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p>Vous n'êtes inscrit à aucun cours.</p>
                <Link to="/student/dashboard/catalog" className="db-cta-btn db-cta-btn--sm">
                  Explorer le catalogue
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Right: Upcoming */}
        <aside className="db-aside" style={{ animationDelay: '300ms' }}>
          <div className="db-section-head">
            <h2 className="db-section-title">Prochainement</h2>
          </div>
          <div className="db-upcoming-empty">
            <div className="upcoming-icon">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p>Aucun événement à venir pour le moment.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Loader / Error (minimal inline) ─────────────────────── */
const loaderStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Lora:ital,wght@0,400;1,600&display=swap');
  .db-loading, .db-error {
    min-height: 60vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    font-family: 'Sora', sans-serif; color: #6b6b7a; font-size: 0.9rem;
  }
  .db-loader-ring {
    width: 36px; height: 36px;
    border: 3px solid #ede9fe; border-top-color: #6366f1;
    border-radius: 50%; animation: db-spin 0.8s linear infinite;
  }
  @keyframes db-spin { to { transform: rotate(360deg); } }
`;

/* ── Main CSS ─────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@0,700;1,700&display=swap');

  :root {
    --db-ink: #111117;
    --db-ink-2: #52525b;
    --db-ink-3: #a1a1aa;
    --db-bg: #f6f6f9;
    --db-surface: #ffffff;
    --db-border: rgba(0,0,0,0.07);
    --db-blue: #6366f1;
    --db-blue-light: #eef2ff;
    --db-blue-dark: #4338ca;
    --db-emerald: #10b981;
    --db-emerald-light: #d1fae5;
    --db-accent-from: #6366f1;
    --db-accent-to: #8b5cf6;
    --db-r: 18px;
    --db-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --db-font: 'Sora', system-ui, sans-serif;
    --db-serif: 'Lora', Georgia, serif;
  }

  .db-root {
    font-family: var(--db-font);
    color: var(--db-ink);
    padding: 36px 40px 60px;
    max-width: 1200px;
    animation: db-fade 0.4s ease both;
  }
  @keyframes db-fade { from { opacity: 0; } to { opacity: 1; } }

  /* Header */
  .db-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .db-date {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--db-blue);
    margin: 0 0 8px;
  }
  .db-greeting {
    font-family: var(--db-serif);
    font-size: clamp(1.6rem, 3vw, 2.1rem);
    font-weight: 700;
    margin: 0 0 6px;
    line-height: 1.2;
    color: var(--db-ink);
  }
  .db-greeting em {
    font-style: italic;
    color: var(--db-blue);
  }
  .db-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--db-ink-2);
  }
  .db-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--db-ink);
    color: #fff;
    font-family: var(--db-font);
    font-size: 0.82rem;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 100px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s var(--db-ease), box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    white-space: nowrap;
  }
  .db-cta-btn:hover {
    background: var(--db-blue-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.3);
    color: #fff;
  }
  .db-cta-btn--sm {
    padding: 9px 18px;
    font-size: 0.78rem;
  }

  /* Stats */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }
  .db-stat-card {
    background: var(--db-surface);
    border-radius: var(--db-r);
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 18px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px var(--db-border);
    position: relative;
    overflow: hidden;
    animation: db-up 0.5s var(--db-ease) both;
    transition: transform 0.25s var(--db-ease), box-shadow 0.25s;
  }
  .db-stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.08), 0 0 0 1px var(--db-border);
  }
  @keyframes db-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .db-stat-card--accent {
    background: linear-gradient(135deg, var(--db-accent-from), var(--db-accent-to));
    box-shadow: 0 8px 24px rgba(99,102,241,0.3);
    color: #fff;
  }
  .db-stat-card--accent:hover {
    box-shadow: 0 16px 36px rgba(99,102,241,0.4);
  }

  .stat-icon-wrap {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .stat-icon-blue { background: var(--db-blue-light); color: var(--db-blue); }
  .stat-icon-emerald { background: var(--db-emerald-light); color: var(--db-emerald); }

  .stat-body {
    display: flex; flex-direction: column; flex: 1; min-width: 0;
  }
  .stat-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--db-ink-3);
    margin-bottom: 6px;
  }
  .stat-label--light { color: rgba(255,255,255,0.65); }
  .stat-value {
    font-family: var(--db-serif);
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
    color: var(--db-ink);
  }
  .stat-value--light { color: #fff; }

  .stat-bar-track {
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 100px;
    margin-top: 10px;
    overflow: hidden;
  }
  .stat-bar-fill {
    height: 100%;
    background: rgba(255,255,255,0.8);
    border-radius: 100px;
    transition: width 1s ease;
  }

  .stat-decoration {
    position: absolute;
    width: 80px; height: 80px;
    border-radius: 50%;
    right: -20px; top: -20px;
    opacity: 0.07;
  }
  .stat-deco-blue { background: var(--db-blue); }
  .stat-deco-emerald { background: var(--db-emerald); }

  .stat-radial {
    width: 72px; height: 72px; flex-shrink: 0;
  }

  /* Main Grid */
  .db-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }

  /* Section */
  .db-section, .db-aside {
    background: var(--db-surface);
    border-radius: var(--db-r);
    padding: 28px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px var(--db-border);
    animation: db-up 0.5s var(--db-ease) both;
  }
  .db-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }
  .db-section-title {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    color: var(--db-ink);
    letter-spacing: -0.01em;
  }
  .db-see-all {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--db-blue);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
  }
  .db-see-all:hover { opacity: 0.7; }

  /* Course rows */
  .db-course-list { display: flex; flex-direction: column; gap: 16px; }
  .db-course-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--db-border);
    transition: background 0.2s, border-color 0.2s, transform 0.25s var(--db-ease);
    animation: db-up 0.5s var(--db-ease) both;
  }
  .db-course-row:hover {
    background: var(--db-bg);
    border-color: rgba(99,102,241,0.2);
    transform: translateX(4px);
  }

  .course-thumb {
    width: 88px; height: 62px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--db-bg);
  }
  .course-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .course-info { flex: 1; min-width: 0; }
  .course-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 4px;
    color: var(--db-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .course-meta {
    font-size: 0.72rem;
    color: var(--db-ink-3);
    margin: 0 0 8px;
  }
  .course-progress-track {
    height: 5px;
    background: var(--db-bg);
    border-radius: 100px;
    overflow: hidden;
  }
  .course-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--db-blue), var(--db-accent-to));
    border-radius: 100px;
    position: relative;
    transition: width 0.8s ease;
  }
  .course-progress-glow {
    position: absolute;
    right: 0; top: 50%;
    transform: translateY(-50%);
    width: 8px; height: 8px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 0 6px var(--db-blue);
  }

  .course-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .action-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s var(--db-ease);
    text-decoration: none;
    flex-shrink: 0;
  }
  .action-btn--play {
    background: var(--db-blue);
    color: white;
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  }
  .action-btn--play:hover {
    background: var(--db-blue-dark);
    transform: scale(1.08);
    box-shadow: 0 6px 18px rgba(99,102,241,0.4);
    color: white;
  }
  .action-btn--cert {
    background: var(--db-emerald-light);
    color: var(--db-emerald);
  }
  .action-btn--cert:hover {
    background: #a7f3d0;
    transform: scale(1.08);
  }
  .action-btn--cert:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(16,185,129,0.3);
    border-top-color: var(--db-emerald);
    border-radius: 50%;
    display: block;
    animation: db-spin 0.7s linear infinite;
  }
  @keyframes db-spin { to { transform: rotate(360deg); } }

  /* Empty */
  .db-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 50px 20px;
    text-align: center;
    gap: 12px;
    color: var(--db-ink-2);
    font-size: 0.875rem;
  }
  .db-empty-icon {
    width: 60px; height: 60px;
    background: var(--db-blue-light);
    color: var(--db-blue);
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }

  /* Upcoming */
  .db-upcoming-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 16px;
    text-align: center;
    gap: 14px;
  }
  .upcoming-icon {
    width: 52px; height: 52px;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .db-upcoming-empty p {
    font-size: 0.82rem;
    color: var(--db-ink-3);
    margin: 0;
    line-height: 1.6;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .db-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .db-root { padding: 24px 18px 48px; }
    .db-stats { grid-template-columns: 1fr; }
    .db-stat-card--accent { flex-direction: column; align-items: flex-start; }
    .course-thumb { width: 64px; height: 48px; }
    .db-cta-btn { display: none; }
  }
`;