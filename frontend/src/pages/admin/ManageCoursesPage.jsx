import { useEffect, useState } from 'react';
import { getAllCourses, updateCourseStatus } from '../../api/adminApi';

const STATUS_META = {
  PUBLIE:    { label: 'Publié',    bg: '#d1fae5', color: '#059669' },
  BROUILLON: { label: 'En attente', bg: '#fef3c7', color: '#d97706' },
  ARCHIVE:   { label: 'Archivé',   bg: '#f4f4f5', color: '#71717a' },
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des cours.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdatingId(`${id}-${status}`);
      await updateCourseStatus(id, status);
      setCourses(prev => prev.map(c => c.id === id ? { ...c, statut: status } : c));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    ALL:       courses.length,
    BROUILLON: courses.filter(c => c.statut === 'BROUILLON').length,
    PUBLIE:    courses.filter(c => c.statut === 'PUBLIE').length,
    ARCHIVE:   courses.filter(c => c.statut === 'ARCHIVE').length,
  };

  const filtered = courses.filter(c => {
    const matchFilter = filter === 'ALL' || c.statut === filter;
    const matchSearch = `${c.titre} ${c.formateur?.nom} ${c.formateur?.prenom}`
      .toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pendingCount = counts.BROUILLON;

  if (loading) {
    return (
      <div className="mc-loading">
        <div className="mc-loader" />
        <span>Chargement des cours…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .mc-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .mc-loader { width:32px; height:32px; border:3px solid #fecdd3; border-top-color:#e11d48; border-radius:50%; animation:mc-spin .8s linear infinite; }
          @keyframes mc-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mc-root">
      <style>{css}</style>

      {/* Header */}
      <header className="mc-header">
        <div>
          <p className="mc-eyebrow">Administration</p>
          <h1 className="mc-title">Modération des <em>Cours</em></h1>
          <p className="mc-sub">{courses.length} cours au total</p>
        </div>
        <div className="mc-search">
          <svg className="mc-search-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="mc-search-input"
            placeholder="Titre, enseignant…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="mc-search-clear" onClick={() => setSearch('')}>✕</button>}
        </div>
      </header>

      {/* Pending banner */}
      {pendingCount > 0 && (
        <div className="mc-banner">
          <span className="mc-banner-dot" />
          <div>
            <strong>{pendingCount} cours</strong> en attente de validation — action requise.
          </div>
          <button className="mc-banner-btn" onClick={() => setFilter('BROUILLON')}>
            Voir →
          </button>
        </div>
      )}

      {error && (
        <div className="mc-error">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="mc-tabs">
        {[
          { key: 'ALL',       label: 'Tous' },
          { key: 'BROUILLON', label: '⏳ En attente' },
          { key: 'PUBLIE',    label: '✅ Publiés' },
          { key: 'ARCHIVE',   label: '📦 Archivés' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`mc-tab ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className={`mc-tab-count ${tab.key === 'BROUILLON' && counts.BROUILLON > 0 ? 'mc-tab-count--urgent' : ''}`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
        {search && (
          <span className="mc-filter-hint">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mc-empty">
          <div className="mc-empty-icon">
            <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3>Aucun cours trouvé</h3>
          <p>{search ? `Aucun résultat pour "${search}".` : 'Aucun cours dans cette catégorie.'}</p>
          {(search || filter !== 'ALL') && (
            <button className="mc-reset-btn" onClick={() => { setSearch(''); setFilter('ALL'); }}>
              Réinitialiser
            </button>
          )}
        </div>
      ) : (
        <div className="mc-list">
          {filtered.map((course, i) => {
            const statusMeta = STATUS_META[course.statut] || STATUS_META.ARCHIVE;
            const isPending = course.statut === 'BROUILLON';
            const isArchived = course.statut === 'ARCHIVE';
            const approvingKey = `${course.id}-PUBLIE`;
            const archivingKey = `${course.id}-ARCHIVE`;

            return (
              <div
                key={course.id}
                className={`mc-card ${isPending ? 'mc-card--pending' : ''}`}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {/* Thumb */}
                <div className="mc-thumb">
                  <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=200&q=80'}
                    alt={course.titre}
                    loading="lazy"
                  />
                  {isPending && <div className="mc-thumb-pending-ring" />}
                </div>

                {/* Info */}
                <div className="mc-info">
                  <div className="mc-info-top">
                    <span
                      className="mc-status-badge"
                      style={{ background: statusMeta.bg, color: statusMeta.color }}
                    >
                      <span className="mc-status-dot" />
                      {statusMeta.label}
                    </span>
                    {course.categorie?.nom && (
                      <span className="mc-cat">{course.categorie.nom}</span>
                    )}
                  </div>
                  <h2 className="mc-course-title">{course.titre}</h2>
                  {course.description && (
                    <p className="mc-course-desc">
                      {course.description.length > 80
                        ? course.description.substring(0, 80) + '…'
                        : course.description}
                    </p>
                  )}
                  <div className="mc-teacher">
                    <div className="mc-teacher-avatar">
                      {course.formateur?.nom?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <span>{course.formateur?.nom} {course.formateur?.prenom}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mc-actions">
                  {isPending && (
                    <button
                      className="mc-action-btn mc-action-btn--approve"
                      onClick={() => handleStatusUpdate(course.id, 'PUBLIE')}
                      disabled={updatingId === approvingKey}
                    >
                      {updatingId === approvingKey ? (
                        <span className="mc-spinner mc-spinner--green" />
                      ) : (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      Approuver
                    </button>
                  )}
                  {!isArchived && (
                    <button
                      className="mc-action-btn mc-action-btn--archive"
                      onClick={() => handleStatusUpdate(course.id, 'ARCHIVE')}
                      disabled={updatingId === archivingKey}
                    >
                      {updatingId === archivingKey ? (
                        <span className="mc-spinner mc-spinner--gray" />
                      ) : (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                      Archiver
                    </button>
                  )}
                  {isArchived && (
                    <button
                      className="mc-action-btn mc-action-btn--restore"
                      onClick={() => handleStatusUpdate(course.id, 'PUBLIE')}
                      disabled={updatingId === approvingKey}
                    >
                      {updatingId === approvingKey ? (
                        <span className="mc-spinner mc-spinner--violet" />
                      ) : (
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      Restaurer
                    </button>
                  )}
                </div>
              </div>
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
    --mc-ink:     #111117;
    --mc-ink-2:   #52525b;
    --mc-ink-3:   #a1a1aa;
    --mc-bg:      #f5f5f8;
    --mc-card:    #ffffff;
    --mc-border:  rgba(0,0,0,0.07);
    --mc-rose:    #e11d48;
    --mc-rose-l:  #fff1f2;
    --mc-rose-d:  #be123c;
    --mc-green:   #059669;
    --mc-green-l: #d1fae5;
    --mc-amber:   #f59e0b;
    --mc-amber-l: #fffbeb;
    --mc-violet:  #7c3aed;
    --mc-violet-l:#f5f3ff;
    --mc-r:       16px;
    --mc-ease:    cubic-bezier(0.22,1,0.36,1);
    --mc-font:    'Sora', system-ui, sans-serif;
    --mc-serif:   'Lora', Georgia, serif;
  }

  .mc-root {
    font-family: var(--mc-font);
    color: var(--mc-ink);
    padding: 36px 40px 64px;
    max-width: 1000px;
    animation: mc-fade .35s ease both;
  }
  @keyframes mc-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes mc-up {
    from { opacity:0; transform:translateY(12px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* Header */
  .mc-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 24px;
  }
  .mc-eyebrow {
    font-size: .68rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--mc-rose); margin: 0 0 8px;
  }
  .mc-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700; letter-spacing: -.02em;
    margin: 0 0 4px; line-height: 1.15;
  }
  .mc-title em { font-family: var(--mc-serif); font-style: italic; color: var(--mc-rose); }
  .mc-sub { font-size: .82rem; color: var(--mc-ink-2); margin: 0; }

  /* Search */
  .mc-search {
    display: flex; align-items: center; gap: 9px;
    background: var(--mc-card);
    border: 1.5px solid var(--mc-border);
    border-radius: 100px;
    padding: 9px 16px; width: 250px;
    transition: border-color .2s, box-shadow .2s;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    align-self: flex-start;
  }
  .mc-search:focus-within {
    border-color: var(--mc-rose);
    box-shadow: 0 0 0 3px rgba(225,29,72,.1);
  }
  .mc-search-icon { color: var(--mc-ink-3); flex-shrink: 0; }
  .mc-search-input {
    flex: 1; border: none; outline: none;
    font-family: var(--mc-font); font-size: .85rem;
    color: var(--mc-ink); background: transparent; min-width: 0;
  }
  .mc-search-input::placeholder { color: var(--mc-ink-3); }
  .mc-search-clear {
    background: none; border: none; cursor: pointer;
    color: var(--mc-ink-3); font-size: .7rem; padding: 0;
    transition: color .2s;
  }
  .mc-search-clear:hover { color: var(--mc-ink); }

  /* Banner */
  .mc-banner {
    display: flex; align-items: center; gap: 12px;
    background: var(--mc-amber-l);
    border: 1.5px solid rgba(245,158,11,.3);
    border-radius: 14px;
    padding: 14px 18px;
    font-size: .85rem;
    color: #92400e;
    margin-bottom: 20px;
  }
  .mc-banner-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--mc-amber); flex-shrink: 0;
    animation: mc-pulse 1.5s ease-out infinite;
  }
  @keyframes mc-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(245,158,11,.6) }
    70%  { box-shadow: 0 0 0 8px rgba(245,158,11,0) }
    100% { box-shadow: 0 0 0 0 rgba(245,158,11,0) }
  }
  .mc-banner div { flex: 1; }
  .mc-banner-btn {
    background: var(--mc-amber); color: #fff;
    border: none; border-radius: 100px;
    padding: 5px 14px; font-family: var(--mc-font);
    font-size: .75rem; font-weight: 700;
    cursor: pointer; transition: background .2s; flex-shrink: 0;
  }
  .mc-banner-btn:hover { background: #d97706; }

  /* Error */
  .mc-error {
    display: flex; align-items: center; gap: 10px;
    background: var(--mc-rose-l);
    border: 1px solid rgba(225,29,72,.2);
    color: var(--mc-rose-d);
    border-radius: 12px; padding: 13px 16px;
    font-size: .85rem; margin-bottom: 20px;
  }

  /* Tabs */
  .mc-tabs {
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 20px; flex-wrap: wrap;
  }
  .mc-tab {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 16px; border-radius: 100px;
    border: 1.5px solid var(--mc-border);
    background: var(--mc-card);
    font-family: var(--mc-font); font-size: .78rem;
    font-weight: 600; color: var(--mc-ink-2);
    cursor: pointer; transition: all .2s var(--mc-ease);
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .mc-tab:hover:not(.active) { border-color: var(--mc-rose); color: var(--mc-rose); }
  .mc-tab.active {
    background: var(--mc-ink); border-color: var(--mc-ink);
    color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,.15);
  }
  .mc-tab-count {
    background: rgba(0,0,0,.1); border-radius: 100px;
    padding: 1px 7px; font-size: .65rem; font-weight: 700;
  }
  .mc-tab.active .mc-tab-count { background: rgba(255,255,255,.2); }
  .mc-tab-count--urgent {
    background: var(--mc-amber) !important;
    color: #fff;
  }
  .mc-filter-hint { font-size: .75rem; color: var(--mc-ink-3); margin-left: 6px; font-weight: 500; }

  /* List */
  .mc-list { display: flex; flex-direction: column; gap: 12px; }

  .mc-card {
    display: flex; align-items: center; gap: 16px;
    background: var(--mc-card);
    border-radius: var(--mc-r);
    padding: 14px 18px;
    border: 1.5px solid var(--mc-border);
    box-shadow: 0 2px 6px rgba(0,0,0,.03);
    animation: mc-up .4s var(--mc-ease) both;
    transition: border-color .2s, box-shadow .2s, transform .25s var(--mc-ease);
  }
  .mc-card:hover {
    border-color: rgba(225,29,72,.18);
    box-shadow: 0 8px 24px rgba(0,0,0,.07);
    transform: translateX(4px);
  }
  .mc-card--pending {
    border-color: rgba(245,158,11,.35);
    background: linear-gradient(135deg, #fffdf5 0%, #fff 50%);
  }
  .mc-card--pending:hover { border-color: rgba(245,158,11,.55); }

  /* Thumb */
  .mc-thumb {
    width: 80px; height: 58px;
    border-radius: 10px; overflow: hidden;
    flex-shrink: 0; background: var(--mc-bg);
    position: relative;
  }
  .mc-thumb img { width:100%; height:100%; object-fit:cover; transition: transform .4s ease; }
  .mc-card:hover .mc-thumb img { transform: scale(1.07); }
  .mc-thumb-pending-ring {
    position: absolute; inset: 0;
    border: 2px solid var(--mc-amber);
    border-radius: 10px;
    pointer-events: none;
  }

  /* Info */
  .mc-info { flex: 1; min-width: 0; }
  .mc-info-top {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 5px; flex-wrap: wrap;
  }
  .mc-status-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .68rem; font-weight: 700;
    padding: 3px 10px; border-radius: 100px;
  }
  .mc-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%; background: currentColor; flex-shrink: 0;
  }
  .mc-cat {
    font-size: .68rem; font-weight: 600;
    color: var(--mc-ink-3); background: var(--mc-bg);
    padding: 3px 10px; border-radius: 100px;
  }
  .mc-course-title {
    font-size: .9rem; font-weight: 700;
    margin: 0 0 4px; color: var(--mc-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mc-course-desc {
    font-size: .73rem; color: var(--mc-ink-3);
    margin: 0 0 6px; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 1;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .mc-teacher {
    display: flex; align-items: center; gap: 6px;
  }
  .mc-teacher-avatar {
    width: 20px; height: 20px; border-radius: 6px;
    background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
    color: #3730a3;
    display: flex; align-items: center; justify-content: center;
    font-size: .62rem; font-weight: 700; flex-shrink: 0;
  }
  .mc-teacher span { font-size: .72rem; color: var(--mc-ink-2); font-weight: 500; }

  /* Actions */
  .mc-actions {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }
  .mc-action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mc-font); font-size: .78rem; font-weight: 600;
    padding: 8px 14px; border-radius: 10px;
    border: none; cursor: pointer; transition: all .2s var(--mc-ease);
    white-space: nowrap;
  }
  .mc-action-btn--approve {
    background: var(--mc-green-l); color: var(--mc-green);
  }
  .mc-action-btn--approve:hover:not(:disabled) {
    background: #a7f3d0; transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(5,150,105,.2);
  }
  .mc-action-btn--archive {
    background: var(--mc-bg);
    color: var(--mc-ink-2);
    border: 1.5px solid var(--mc-border);
  }
  .mc-action-btn--archive:hover:not(:disabled) {
    border-color: var(--mc-rose); color: var(--mc-rose);
    background: var(--mc-rose-l); transform: translateY(-1px);
  }
  .mc-action-btn--restore {
    background: var(--mc-violet-l); color: var(--mc-violet);
  }
  .mc-action-btn--restore:hover:not(:disabled) {
    background: #ede9fe; transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124,58,237,.15);
  }
  .mc-action-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }

  /* Spinner */
  .mc-spinner {
    width: 12px; height: 12px; border-radius: 50%;
    border: 2px solid transparent;
    animation: mc-spin .7s linear infinite; display: block;
  }
  .mc-spinner--green  { border-color: rgba(5,150,105,.25);   border-top-color: var(--mc-green); }
  .mc-spinner--gray   { border-color: rgba(100,116,139,.25); border-top-color: #64748b; }
  .mc-spinner--violet { border-color: rgba(124,58,237,.25);  border-top-color: var(--mc-violet); }
  @keyframes mc-spin { to { transform: rotate(360deg) } }

  /* Empty */
  .mc-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center; gap: 12px;
    background: var(--mc-card); border-radius: var(--mc-r);
    border: 1.5px dashed var(--mc-border);
  }
  .mc-empty-icon {
    width: 62px; height: 62px; background: var(--mc-rose-l);
    color: var(--mc-rose); border-radius: 18px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
  }
  .mc-empty h3 { font-size: 1.05rem; font-weight: 700; margin: 0; }
  .mc-empty p  { font-size: .85rem; color: var(--mc-ink-2); margin: 0; max-width: 280px; line-height: 1.6; }
  .mc-reset-btn {
    background: var(--mc-rose); color: #fff; border: none;
    border-radius: 100px; padding: 8px 20px;
    font-family: var(--mc-font); font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: background .2s; margin-top: 4px;
  }
  .mc-reset-btn:hover { background: var(--mc-rose-d); }

  @media (max-width: 700px) {
    .mc-root { padding: 22px 16px 48px; }
    .mc-header { flex-direction: column; align-items: stretch; }
    .mc-search { width: 100%; }
    .mc-card { flex-wrap: wrap; }
    .mc-actions { width: 100%; padding-top: 10px; border-top: 1px solid var(--mc-border); }
    .mc-thumb { width: 60px; height: 44px; }
    .mc-course-desc { display: none; }
  }
`;