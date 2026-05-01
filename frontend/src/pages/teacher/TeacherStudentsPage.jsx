import { useState, useEffect } from 'react';
import { getTeacherStudents } from '../../api/teacherApi';

export default function TeacherStudentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getTeacherStudents();
        setEnrollments(res.data);
      } catch (err) {
        console.error('Erreur students teacher', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = enrollments.filter(e => {
    const name = `${e.etudiant.nom} ${e.etudiant.prenom} ${e.etudiant.email}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || e.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: enrollments.length,
    ACTIVE: enrollments.filter(e => e.statut === 'ACTIVE').length,
    INACTIVE: enrollments.filter(e => e.statut !== 'ACTIVE').length,
  };

  // Generate a consistent pastel color per student initial
  const avatarColor = (letter) => {
    const colors = [
      ['#fef3c7','#92400e'], ['#ede9fe','#5b21b6'], ['#d1fae5','#065f46'],
      ['#fee2e2','#991b1b'], ['#e0f2fe','#0c4a6e'], ['#fce7f3','#9d174d'],
      ['#f3f4f6','#374151'], ['#ecfdf5','#064e3b'],
    ];
    const idx = (letter?.toUpperCase().charCodeAt(0) || 65) % colors.length;
    return colors[idx];
  };

  if (loading) {
    return (
      <div className="ts-loading">
        <div className="ts-loader" />
        <span>Chargement des élèves…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .ts-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .ts-loader { width:32px; height:32px; border:3px solid #fde68a; border-top-color:#f59e0b; border-radius:50%; animation:ts-spin .8s linear infinite; }
          @keyframes ts-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ts-root">
      <style>{css}</style>

      {/* Header */}
      <header className="ts-header">
        <div>
          <p className="ts-eyebrow">Gestion des apprenants</p>
          <h1 className="ts-title">Mes <em>Élèves</em></h1>
          <p className="ts-sub">{enrollments.length} inscription{enrollments.length !== 1 ? 's' : ''} au total</p>
        </div>

        {/* Search */}
        <div className="ts-search">
          <svg className="ts-search-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="ts-search-input"
            placeholder="Rechercher un élève…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="ts-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </header>

      {/* Filter tabs */}
      <div className="ts-tabs">
        {[
          { key: 'ALL',      label: 'Tous' },
          { key: 'ACTIVE',   label: 'Actifs' },
          { key: 'INACTIVE', label: 'Inactifs' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`ts-tab ${filterStatus === tab.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(tab.key)}
          >
            {tab.label}
            <span className="ts-tab-count">{counts[tab.key]}</span>
          </button>
        ))}
        {filtered.length !== enrollments.length && (
          <span className="ts-filter-hint">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="ts-empty">
          <div className="ts-empty-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3>{search ? 'Aucun résultat' : 'Aucun élève inscrit'}</h3>
          <p>{search ? `Aucun élève ne correspond à "${search}".` : 'Vos élèves apparaîtront ici une fois inscrits à vos cours.'}</p>
          {search && <button className="ts-reset-btn" onClick={() => setSearch('')}>Effacer la recherche</button>}
        </div>
      ) : (
        <div className="ts-list">
          {filtered.map((enrollment, i) => {
            const initials = `${enrollment.etudiant.nom?.charAt(0) ?? ''}${enrollment.etudiant.prenom?.charAt(0) ?? ''}`.toUpperCase();
            const [bgColor, textColor] = avatarColor(enrollment.etudiant.nom?.charAt(0));
            const isActive = enrollment.statut === 'ACTIVE';

            return (
              <div
                key={enrollment.id}
                className="ts-card"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                {/* Avatar */}
                <div
                  className="ts-avatar"
                  style={{ background: bgColor, color: textColor }}
                >
                  {initials}
                </div>

                {/* Student info */}
                <div className="ts-student-info">
                  <span className="ts-student-name">
                    {enrollment.etudiant.nom} {enrollment.etudiant.prenom}
                  </span>
                  <a href={`mailto:${enrollment.etudiant.email}`} className="ts-student-email">
                    {enrollment.etudiant.email}
                  </a>
                </div>

                {/* Course badge */}
                <div className="ts-course-wrap">
                  <div className="ts-course-badge">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {enrollment.cours.titre}
                  </div>
                </div>

                {/* Status */}
                <div className={`ts-status ${isActive ? 'ts-status--active' : 'ts-status--inactive'}`}>
                  <span className="ts-status-dot" />
                  {isActive ? 'Actif' : 'Inactif'}
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
    --ts-ink:     #111117;
    --ts-ink-2:   #52525b;
    --ts-ink-3:   #a1a1aa;
    --ts-bg:      #f5f5f8;
    --ts-card:    #ffffff;
    --ts-border:  rgba(0,0,0,0.07);
    --ts-amber:   #f59e0b;
    --ts-amber-d: #d97706;
    --ts-amber-l: #fffbeb;
    --ts-green:   #059669;
    --ts-green-l: #d1fae5;
    --ts-red:     #dc2626;
    --ts-red-l:   #fee2e2;
    --ts-r:       16px;
    --ts-ease:    cubic-bezier(0.22,1,0.36,1);
    --ts-font:    'Sora', system-ui, sans-serif;
    --ts-serif:   'Lora', Georgia, serif;
  }

  .ts-root {
    font-family: var(--ts-font);
    color: var(--ts-ink);
    padding: 36px 40px 64px;
    max-width: 1000px;
    animation: ts-fade .35s ease both;
  }
  @keyframes ts-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes ts-up {
    from { opacity:0; transform:translateY(12px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* ── Header ─────────────────────────────────── */
  .ts-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 28px;
  }
  .ts-eyebrow {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--ts-amber);
    margin: 0 0 8px;
  }
  .ts-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 4px;
    line-height: 1.15;
  }
  .ts-title em {
    font-family: var(--ts-serif);
    font-style: italic;
    color: var(--ts-amber);
  }
  .ts-sub {
    font-size: .82rem;
    color: var(--ts-ink-2);
    margin: 0;
  }

  /* Search */
  .ts-search {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--ts-card);
    border: 1.5px solid var(--ts-border);
    border-radius: 100px;
    padding: 9px 16px;
    width: 280px;
    transition: border-color .2s, box-shadow .2s;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .ts-search:focus-within {
    border-color: var(--ts-amber);
    box-shadow: 0 0 0 3px rgba(245,158,11,.1);
  }
  .ts-search-icon { color: var(--ts-ink-3); flex-shrink: 0; }
  .ts-search-input {
    flex: 1;
    border: none;
    outline: none;
    font-family: var(--ts-font);
    font-size: .85rem;
    color: var(--ts-ink);
    background: transparent;
    min-width: 0;
  }
  .ts-search-input::placeholder { color: var(--ts-ink-3); }
  .ts-search-clear {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--ts-ink-3);
    font-size: .7rem;
    padding: 0;
    line-height: 1;
    transition: color .2s;
  }
  .ts-search-clear:hover { color: var(--ts-ink); }

  /* ── Tabs ────────────────────────────────────── */
  .ts-tabs {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .ts-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 100px;
    border: 1.5px solid var(--ts-border);
    background: var(--ts-card);
    font-family: var(--ts-font);
    font-size: .78rem;
    font-weight: 600;
    color: var(--ts-ink-2);
    cursor: pointer;
    transition: all .2s var(--ts-ease);
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .ts-tab:hover { border-color: var(--ts-amber); color: var(--ts-amber); }
  .ts-tab.active {
    background: var(--ts-amber);
    border-color: var(--ts-amber);
    color: #fff;
    box-shadow: 0 4px 14px rgba(245,158,11,.3);
  }
  .ts-tab-count {
    background: rgba(0,0,0,.08);
    border-radius: 100px;
    padding: 1px 7px;
    font-size: .65rem;
    font-weight: 700;
  }
  .ts-tab.active .ts-tab-count { background: rgba(255,255,255,.25); }
  .ts-filter-hint {
    font-size: .75rem;
    color: var(--ts-ink-3);
    margin-left: 6px;
    font-weight: 500;
  }

  /* ── List ────────────────────────────────────── */
  .ts-list { display: flex; flex-direction: column; gap: 10px; }

  .ts-card {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--ts-card);
    border-radius: var(--ts-r);
    padding: 14px 20px;
    border: 1.5px solid var(--ts-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.03);
    animation: ts-up .4s var(--ts-ease) both;
    transition: border-color .2s, box-shadow .2s, transform .25s var(--ts-ease);
  }
  .ts-card:hover {
    border-color: rgba(245,158,11,.28);
    box-shadow: 0 8px 24px rgba(0,0,0,.07);
    transform: translateX(4px);
  }

  /* Avatar */
  .ts-avatar {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: .75rem;
    font-weight: 700;
    letter-spacing: .03em;
    flex-shrink: 0;
    transition: transform .25s var(--ts-ease);
  }
  .ts-card:hover .ts-avatar { transform: scale(1.08) rotate(-3deg); }

  /* Student */
  .ts-student-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ts-student-name {
    font-size: .88rem;
    font-weight: 700;
    color: var(--ts-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ts-student-email {
    font-size: .72rem;
    color: var(--ts-ink-3);
    text-decoration: none;
    transition: color .2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ts-student-email:hover { color: var(--ts-amber); }

  /* Course */
  .ts-course-wrap { flex: 1; min-width: 0; }
  .ts-course-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--ts-bg);
    border: 1px solid var(--ts-border);
    border-radius: 8px;
    padding: 5px 11px;
    font-size: .72rem;
    font-weight: 600;
    color: var(--ts-ink-2);
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Status */
  .ts-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: .72rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 100px;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .ts-status--active   { background: var(--ts-green-l); color: var(--ts-green); }
  .ts-status--inactive { background: #fef3c7; color: #92400e; }
  .ts-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* Detail btn */
  .ts-detail-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: 1.5px solid var(--ts-border);
    border-radius: 9px;
    padding: 7px 13px;
    font-family: var(--ts-font);
    font-size: .75rem;
    font-weight: 600;
    color: var(--ts-ink-2);
    cursor: pointer;
    transition: all .2s var(--ts-ease);
    flex-shrink: 0;
    white-space: nowrap;
  }
  .ts-detail-btn:hover {
    border-color: var(--ts-amber);
    color: var(--ts-amber);
    background: var(--ts-amber-l);
    transform: translateY(-1px);
  }
  .ts-detail-btn svg { transition: transform .2s var(--ts-ease); }
  .ts-detail-btn:hover svg { transform: translateX(2px); }

  /* Empty */
  .ts-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px;
    text-align: center;
    gap: 12px;
    background: var(--ts-card);
    border-radius: var(--ts-r);
    border: 1.5px dashed var(--ts-border);
  }
  .ts-empty-icon {
    width: 64px; height: 64px;
    background: var(--ts-amber-l);
    color: var(--ts-amber);
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .ts-empty h3 { font-size:1.05rem; font-weight:700; margin:0; letter-spacing:-.01em; }
  .ts-empty p  { font-size:.85rem; color:var(--ts-ink-2); margin:0; max-width:300px; line-height:1.6; }
  .ts-reset-btn {
    margin-top: 4px;
    background: var(--ts-amber);
    color: #fff;
    border: none;
    border-radius: 100px;
    padding: 9px 22px;
    font-family: var(--ts-font);
    font-size: .8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background .2s;
  }
  .ts-reset-btn:hover { background: var(--ts-amber-d); }

  @media (max-width: 780px) {
    .ts-root { padding: 22px 16px 48px; }
    .ts-header { flex-direction: column; align-items: stretch; }
    .ts-search { width: 100%; }
    .ts-course-wrap { display: none; }
    .ts-card { gap: 12px; }
    .ts-detail-btn span { display: none; }
  }
`;