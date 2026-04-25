import { useState, useEffect } from 'react';
import { getTeacherCourses, deleteCourse, updateCourseStatus } from '../../api/teacherApi';
import { Link } from 'react-router-dom';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getTeacherCourses();
      setCourses(res.data);
    } catch (err) {
      console.error('Erreur courses teacher', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce cours ?')) return;
    try {
      setDeletingId(id);
      await deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Publier ce cours ? Il sera visible par tous les étudiants.')) return;
    try {
      setPublishingId(id);
      await updateCourseStatus(id, 'PUBLIE');
      setCourses(prev => prev.map(c => c.id === id ? { ...c, statut: 'PUBLIE' } : c));
    } catch (err) {
      alert('Erreur lors de la publication.');
    } finally {
      setPublishingId(null);
    }
  };

  const filtered = filter === 'ALL' ? courses : courses.filter(c => c.statut === filter);
  const counts = {
    ALL: courses.length,
    PUBLIE: courses.filter(c => c.statut === 'PUBLIE').length,
    BROUILLON: courses.filter(c => c.statut === 'BROUILLON').length,
  };

  if (loading) {
    return (
      <div className="tc-loading">
        <div className="tc-loader" />
        <span>Chargement de vos cours…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .tc-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .tc-loader { width:32px; height:32px; border:3px solid #fde68a; border-top-color:#f59e0b; border-radius:50%; animation:tc-spin .8s linear infinite; }
          @keyframes tc-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tc-root">
      <style>{css}</style>

      {/* Header */}
      <header className="tc-header">
        <div>
          <p className="tc-eyebrow">Gestion des contenus</p>
          <h1 className="tc-title">Mes <em>Cours</em></h1>
          <p className="tc-sub">Gérez vos contenus et suivez vos publications.</p>
        </div>
        <Link to="/teacher/courses/create" className="tc-create-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nouveau cours
        </Link>
      </header>

      {/* Filter tabs */}
      <div className="tc-tabs">
        {[
          { key: 'ALL', label: 'Tous' },
          { key: 'PUBLIE', label: 'Publiés' },
          { key: 'BROUILLON', label: 'Brouillons' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`tc-tab ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="tc-tab-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="tc-empty">
          <div className="tc-empty-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3>Aucun cours {filter !== 'ALL' ? (filter === 'PUBLIE' ? 'publié' : 'en brouillon') : 'créé'}</h3>
          <p>{filter === 'ALL' ? 'Commencez par créer votre premier cours.' : 'Changez de filtre ou créez un nouveau cours.'}</p>
          {filter === 'ALL' && (
            <Link to="/teacher/courses/create" className="tc-create-btn tc-create-btn--sm">
              Créer mon premier cours
            </Link>
          )}
        </div>
      ) : (
        <div className="tc-list">
          {filtered.map((course, i) => (
            <div
              key={course.id}
              className={`tc-card ${deletingId === course.id ? 'tc-card--deleting' : ''}`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              {/* Thumb */}
              <div className="tc-thumb">
                <img
                  src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop'}
                  alt={course.titre}
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="tc-info">
                <div className="tc-info-top">
                  <span className={`tc-badge ${course.statut === 'PUBLIE' ? 'tc-badge--published' : 'tc-badge--draft'}`}>
                    <span className="tc-badge-dot" />
                    {course.statut === 'PUBLIE' ? 'Publié' : 'Brouillon'}
                  </span>
                  {course.categorie?.nom && (
                    <span className="tc-cat">{course.categorie.nom}</span>
                  )}
                </div>
                <h2 className="tc-course-title">{course.titre}</h2>
                <p className="tc-date">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(course.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Actions */}
              <div className="tc-actions">
                {course.statut === 'BROUILLON' && (
                  <button
                    className="tc-action-btn tc-action-btn--publish"
                    onClick={() => handlePublish(course.id)}
                    disabled={publishingId === course.id}
                  >
                    {publishingId === course.id ? <span className="tc-spinner tc-spinner--green" /> : (
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    Publier
                  </button>
                )}

                <Link to={`/teacher/courses/${course.id}/lessons`} className="tc-action-btn tc-action-btn--content">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" />
                  </svg>
                  Contenu
                </Link>

                <Link to={`/teacher/courses/${course.id}/edit`} className="tc-icon-btn" title="Modifier">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>

                <button
                  className="tc-icon-btn tc-icon-btn--danger"
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingId === course.id}
                  title="Supprimer"
                >
                  {deletingId === course.id ? (
                    <span className="tc-spinner tc-spinner--red" />
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --tc-ink:     #111117;
    --tc-ink-2:   #52525b;
    --tc-ink-3:   #a1a1aa;
    --tc-bg:      #f5f5f8;
    --tc-card:    #ffffff;
    --tc-border:  rgba(0,0,0,0.07);
    --tc-amber:   #f59e0b;
    --tc-amber-d: #d97706;
    --tc-amber-l: #fffbeb;
    --tc-green:   #059669;
    --tc-green-l: #d1fae5;
    --tc-red:     #dc2626;
    --tc-red-l:   #fee2e2;
    --tc-r:       16px;
    --tc-ease:    cubic-bezier(0.22,1,0.36,1);
    --tc-font:    'Sora', system-ui, sans-serif;
    --tc-serif:   'Lora', Georgia, serif;
  }

  .tc-root {
    font-family: var(--tc-font);
    color: var(--tc-ink);
    padding: 36px 40px 64px;
    max-width: 1000px;
    animation: tc-fade .35s ease both;
  }
  @keyframes tc-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes tc-up {
    from { opacity:0; transform:translateY(12px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* ── Header ────────────────────────────────────── */
  .tc-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 32px;
  }
  .tc-eyebrow {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--tc-amber);
    margin: 0 0 8px;
  }
  .tc-title {
    font-family: var(--tc-font);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 4px;
    line-height: 1.15;
  }
  .tc-title em {
    font-family: var(--tc-serif);
    font-style: italic;
    color: var(--tc-amber);
  }
  .tc-sub {
    font-size: .82rem;
    color: var(--tc-ink-2);
    margin: 0;
  }

  .tc-create-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--tc-ink);
    color: #fff;
    font-family: var(--tc-font);
    font-size: .82rem;
    font-weight: 600;
    padding: 11px 22px;
    border-radius: 100px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,.14);
    transition: background .2s, transform .2s var(--tc-ease), box-shadow .2s;
    white-space: nowrap;
  }
  .tc-create-btn:hover {
    background: var(--tc-amber-d);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(245,158,11,.35);
  }
  .tc-create-btn--sm { padding: 9px 18px; font-size: .78rem; }

  /* ── Filter tabs ───────────────────────────────── */
  .tc-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
  }
  .tc-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    border-radius: 100px;
    border: 1.5px solid var(--tc-border);
    background: var(--tc-card);
    font-family: var(--tc-font);
    font-size: .8rem;
    font-weight: 600;
    color: var(--tc-ink-2);
    cursor: pointer;
    transition: all .2s var(--tc-ease);
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .tc-tab:hover { border-color: var(--tc-amber); color: var(--tc-amber); }
  .tc-tab.active {
    background: var(--tc-amber);
    border-color: var(--tc-amber);
    color: #fff;
    box-shadow: 0 4px 14px rgba(245,158,11,.3);
  }
  .tc-tab-count {
    background: rgba(0,0,0,.08);
    border-radius: 100px;
    padding: 1px 7px;
    font-size: .68rem;
    font-weight: 700;
  }
  .tc-tab.active .tc-tab-count { background: rgba(255,255,255,.25); }

  /* ── Course list ───────────────────────────────── */
  .tc-list { display: flex; flex-direction: column; gap: 14px; }

  .tc-card {
    display: flex;
    align-items: center;
    gap: 18px;
    background: var(--tc-card);
    border-radius: var(--tc-r);
    padding: 16px 20px;
    border: 1.5px solid var(--tc-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    animation: tc-up .4s var(--tc-ease) both;
    transition: border-color .2s, box-shadow .2s, transform .25s var(--tc-ease), opacity .3s;
  }
  .tc-card:hover {
    border-color: rgba(245,158,11,.3);
    box-shadow: 0 8px 24px rgba(0,0,0,.07);
    transform: translateX(4px);
  }
  .tc-card--deleting {
    opacity: .4;
    pointer-events: none;
    transform: scale(.98);
  }

  /* Thumb */
  .tc-thumb {
    width: 80px; height: 60px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--tc-bg);
  }
  .tc-thumb img { width:100%; height:100%; object-fit:cover; transition: transform .4s ease; }
  .tc-card:hover .tc-thumb img { transform: scale(1.06); }

  /* Info */
  .tc-info { flex: 1; min-width: 0; }
  .tc-info-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 5px;
    flex-wrap: wrap;
  }
  .tc-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .68rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
  }
  .tc-badge--published { background: var(--tc-green-l); color: var(--tc-green); }
  .tc-badge--draft     { background: #fef3c7; color: #92400e; }
  .tc-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }
  .tc-cat {
    font-size: .68rem;
    font-weight: 600;
    color: var(--tc-ink-3);
    background: var(--tc-bg);
    padding: 3px 10px;
    border-radius: 100px;
  }
  .tc-course-title {
    font-size: .92rem;
    font-weight: 700;
    margin: 0 0 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--tc-ink);
  }
  .tc-date {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: .72rem;
    color: var(--tc-ink-3);
    margin: 0;
  }

  /* Actions */
  .tc-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .tc-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--tc-font);
    font-size: .78rem;
    font-weight: 600;
    padding: 8px 14px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all .2s var(--tc-ease);
    white-space: nowrap;
  }
  .tc-action-btn--publish {
    background: var(--tc-green-l);
    color: var(--tc-green);
  }
  .tc-action-btn--publish:hover:not(:disabled) {
    background: #a7f3d0;
    transform: translateY(-1px);
  }
  .tc-action-btn--content {
    background: var(--tc-bg);
    color: var(--tc-ink-2);
    border: 1.5px solid var(--tc-border);
  }
  .tc-action-btn--content:hover {
    border-color: var(--tc-amber);
    color: var(--tc-amber);
    background: var(--tc-amber-l);
  }
  .tc-action-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .tc-icon-btn {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--tc-border);
    background: var(--tc-bg);
    color: var(--tc-ink-2);
    cursor: pointer;
    text-decoration: none;
    transition: all .2s var(--tc-ease);
    flex-shrink: 0;
  }
  .tc-icon-btn:hover { border-color: var(--tc-amber); color: var(--tc-amber); background: var(--tc-amber-l); transform: translateY(-1px); }
  .tc-icon-btn--danger:hover { border-color: var(--tc-red); color: var(--tc-red); background: var(--tc-red-l); }
  .tc-icon-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  /* Spinner */
  .tc-spinner {
    width: 13px; height: 13px;
    border: 2px solid transparent;
    border-radius: 50%;
    animation: tc-spin .7s linear infinite;
    display: block;
  }
  .tc-spinner--green { border-color: rgba(5,150,105,.25); border-top-color: var(--tc-green); }
  .tc-spinner--red   { border-color: rgba(220,38,38,.25); border-top-color: var(--tc-red); }
  @keyframes tc-spin { to { transform: rotate(360deg) } }

  /* Empty */
  .tc-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px;
    text-align: center;
    gap: 12px;
    background: var(--tc-card);
    border-radius: var(--tc-r);
    border: 1.5px dashed var(--tc-border);
  }
  .tc-empty-icon {
    width: 64px; height: 64px;
    background: var(--tc-amber-l);
    color: var(--tc-amber);
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .tc-empty h3 {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -.01em;
  }
  .tc-empty p {
    font-size: .85rem;
    color: var(--tc-ink-2);
    margin: 0 0 4px;
    max-width: 300px;
    line-height: 1.6;
  }

  @media (max-width: 700px) {
    .tc-root { padding: 22px 16px 48px; }
    .tc-card { flex-wrap: wrap; }
    .tc-actions { width: 100%; justify-content: flex-end; padding-top: 8px; border-top: 1px solid var(--tc-border); }
    .tc-thumb { width: 56px; height: 44px; }
    .tc-course-title { font-size: .85rem; }
  }
`;