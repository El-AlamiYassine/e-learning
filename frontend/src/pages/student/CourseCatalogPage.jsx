import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, enrolledData] = await Promise.all([
          studentApi.getCategories(),
          studentApi.getEnrolledCourses()
        ]);
        setCategories(categoriesData);
        setEnrolledCourseIds(new Set(enrolledData.map(c => c.id)));
        const coursesData = await studentApi.getCatalog();
        setCourses(coursesData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger le catalogue pour le moment.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      const data = await studentApi.getCatalog(categoryId);
      setCourses(data);
    } catch (err) {
      setError('Erreur lors du filtrage des cours.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollLoading(courseId);
      await studentApi.enroll(courseId);
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setEnrollLoading(null);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="cc-root">
      <style>{css}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="cc-hero">
        <div className="cc-hero-bg">
          <div className="cc-orb cc-orb-a" />
          <div className="cc-orb cc-orb-b" />
          <div className="cc-orb cc-orb-c" />
          <div className="cc-grid-lines" />
        </div>
        <div className="cc-hero-inner">
          <div className="cc-hero-badge">
            <span className="cc-badge-dot" />
            Catalogue 2025
          </div>
          <h1 className="cc-hero-title">
            <span className="cc-title-muted">Développez</span>
            <span className="cc-title-main">vos <em>compétences</em></span>
          </h1>
          <p className="cc-hero-sub">
            Des formations certifiantes conçues pour booster votre carrière.
          </p>
          <div className="cc-search-wrap">
            <div className="cc-search">
              <svg className="cc-search-icon" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" className="cc-search-input"
                placeholder="Rechercher une formation…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="cc-search-clear" onClick={() => setSearchQuery('')}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="cc-hero-stats">
            <div className="cc-stat"><span className="cc-stat-n">{courses.length}+</span><span className="cc-stat-l">formations</span></div>
            <div className="cc-stat-sep" />
            <div className="cc-stat"><span className="cc-stat-n">{categories.length}</span><span className="cc-stat-l">catégories</span></div>
            <div className="cc-stat-sep" />
            <div className="cc-stat"><span className="cc-stat-n">100%</span><span className="cc-stat-l">certifiants</span></div>
          </div>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────── */}
      <div className="cc-body">

        {/* Toolbar */}
        <div className="cc-toolbar">
          <div className="cc-cats">
            <button className={`cc-cat ${selectedCategory === null ? 'cc-cat--on' : ''}`} onClick={() => handleCategoryChange(null)}>Tous</button>
            {categories.map(cat => (
              <button key={cat.id} className={`cc-cat ${selectedCategory === cat.id ? 'cc-cat--on' : ''}`} onClick={() => handleCategoryChange(cat.id)}>
                {cat.nom}
              </button>
            ))}
          </div>
          <div className="cc-toolbar-right">
            <span className="cc-count"><strong>{filteredCourses.length}</strong> formation{filteredCourses.length !== 1 ? 's' : ''}</span>
            <div className="cc-view-toggle">
              <button className={`cc-view-btn ${viewMode === 'grid' ? 'cc-view-btn--on' : ''}`} onClick={() => setViewMode('grid')} title="Grille">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/></svg>
              </button>
              <button className={`cc-view-btn ${viewMode === 'list' ? 'cc-view-btn--on' : ''}`} onClick={() => setViewMode('list')} title="Liste">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        {error && <div className="cc-error">{error}</div>}

        {loading ? (
          <div className="cc-loader-wrap">
            <div className="cc-loader" /><span>Chargement des formations…</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="cc-empty">
            <div className="cc-empty-glyph">∅</div>
            <h3>Aucun résultat</h3>
            <p>Essayez d'autres mots-clés ou réinitialisez les filtres.</p>
            <button className="cc-reset-btn" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>Réinitialiser</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="cc-grid">
            {filteredCourses.map((course, i) => {
              const enrolled = enrolledCourseIds.has(course.id);
              const initial = course.formateur?.prenom?.charAt(0) ?? '?';
              return (
                <article key={course.id} className="gc" style={{ animationDelay: `${i * 45}ms` }}>
                  <div className="gc-thumb">
                    <img src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'} alt={course.titre} loading="lazy" />
                    <div className="gc-shade" />
                    <span className="gc-cat-badge">{course.categorie?.nom || 'Général'}</span>
                    <span className="gc-cert-badge">
                      <svg width="9" height="9" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Certifié
                    </span>
                  </div>
                  <div className="gc-body">
                    <h2 className="gc-title">{course.titre}</h2>
                    <p className="gc-desc">{course.description || 'Inscrivez-vous pour accéder au contenu complet.'}</p>
                    <div className="gc-footer">
                      <div className="gc-author">
                        <span className="gc-av">{initial}</span>
                        <span className="gc-av-name">{course.formateur?.prenom} {course.formateur?.nom}</span>
                      </div>
                      {enrolled ? (
                        <Link to={`/student/course/${course.id}`} className="cc-enroll-btn cc-enroll-btn--done">
                          <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8z"/></svg>
                          Continuer
                        </Link>
                      ) : (
                        <button className="cc-enroll-btn cc-enroll-btn--go" disabled={enrollLoading === course.id} onClick={() => handleEnroll(course.id)}>
                          {enrollLoading === course.id
                            ? <span className="cc-spin" />
                            : <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>S'inscrire</>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="cc-list">
            {filteredCourses.map((course, i) => {
              const enrolled = enrolledCourseIds.has(course.id);
              const initial = course.formateur?.prenom?.charAt(0) ?? '?';
              return (
                <article key={course.id} className="lc" style={{ animationDelay: `${i * 35}ms` }}>
                  <div className="lc-thumb">
                    <img src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'} alt={course.titre} loading="lazy" />
                  </div>
                  <div className="lc-body">
                    <div className="lc-meta">
                      <span className="lc-cat">{course.categorie?.nom || 'Général'}</span>
                      <span className="lc-cert-tag">✦ Certifié</span>
                    </div>
                    <h2 className="lc-title">{course.titre}</h2>
                    <p className="lc-desc">{course.description ? course.description.slice(0, 120) + (course.description.length > 120 ? '…' : '') : 'Inscrivez-vous pour accéder au contenu.'}</p>
                    <div className="lc-author"><span className="gc-av">{initial}</span><span>{course.formateur?.prenom} {course.formateur?.nom}</span></div>
                  </div>
                  <div className="lc-actions">
                    {enrolled ? (
                      <Link to={`/student/course/${course.id}`} className="cc-enroll-btn cc-enroll-btn--done">
                        <svg width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8z"/></svg>
                        Continuer
                      </Link>
                    ) : (
                      <button className="cc-enroll-btn cc-enroll-btn--go" disabled={enrollLoading === course.id} onClick={() => handleEnroll(course.id)}>
                        {enrollLoading === course.id ? <span className="cc-spin" /> : <><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>S'inscrire</>}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400;1,9..144,700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

  :root {
    --ci: #0c0c10;
    --ci2: #52525b;
    --ci3: #a1a1aa;
    --cbg: #f7f7fa;
    --ccard: #fff;
    --cbor: rgba(0,0,0,.08);
    --cv: #4f46e5;
    --cvl: #eef2ff;
    --cvd: #3730a3;
    --cg: #059669;
    --cgl: #d1fae5;
    --ease: cubic-bezier(.22,1,.36,1);
    --disp: 'Fraunces', Georgia, serif;
    --body: 'Cabinet Grotesk', system-ui, sans-serif;
  }

  .cc-root { background: var(--cbg); font-family: var(--body); color: var(--ci); min-height: 100vh; }

  /* HERO */
  .cc-hero { position: relative; background: #08080f; overflow: hidden; padding: 72px 24px 64px; }
  .cc-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .cc-orb { position: absolute; border-radius: 50%; filter: blur(90px); }
  .cc-orb-a { width:600px; height:600px; background:radial-gradient(circle,rgba(79,70,229,.4) 0%,transparent 70%); top:-200px; left:-150px; }
  .cc-orb-b { width:350px; height:350px; background:radial-gradient(circle,rgba(139,92,246,.25) 0%,transparent 70%); bottom:-80px; right:-60px; }
  .cc-orb-c { width:200px; height:200px; background:radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%); top:40%; right:20%; }
  .cc-grid-lines { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:48px 48px; }
  .cc-hero-inner { position:relative; max-width:720px; margin:0 auto; text-align:center; }
  .cc-hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); border-radius:100px; padding:6px 16px; font-size:.7rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.5); margin-bottom:28px; backdrop-filter:blur(8px); }
  .cc-badge-dot { width:6px; height:6px; border-radius:50%; background:#10b981; box-shadow:0 0 6px #10b981; flex-shrink:0; animation:cc-blink 2s ease-in-out infinite; }
  @keyframes cc-blink { 0%,100%{opacity:1} 50%{opacity:.35} }
  .cc-hero-title { font-family:var(--disp); font-weight:700; margin:0 0 18px; line-height:1.05; }
  .cc-title-muted { display:block; font-size:clamp(1.6rem,4vw,2.8rem); color:rgba(255,255,255,.35); font-weight:300; letter-spacing:.02em; }
  .cc-title-main { display:block; font-size:clamp(2.8rem,7vw,5rem); color:#fff; }
  .cc-title-main em { font-style:italic; background:linear-gradient(90deg,#a78bfa,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .cc-hero-sub { font-size:.95rem; color:rgba(255,255,255,.4); margin:0 0 32px; line-height:1.65; }
  .cc-search-wrap { max-width:540px; margin:0 auto 32px; }
  .cc-search { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.12); border-radius:100px; padding:8px 10px 8px 22px; backdrop-filter:blur(16px); transition:border-color .2s,background .2s; }
  .cc-search:focus-within { border-color:rgba(167,139,250,.5); background:rgba(255,255,255,.09); }
  .cc-search-icon { color:rgba(255,255,255,.3); flex-shrink:0; }
  .cc-search-input { flex:1; background:transparent; border:none; outline:none; font-family:var(--body); font-size:.9rem; color:#fff; min-width:0; }
  .cc-search-input::placeholder { color:rgba(255,255,255,.28); }
  .cc-search-clear { width:28px; height:28px; border-radius:50%; background:rgba(255,255,255,.1); border:none; color:rgba(255,255,255,.5); cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .2s; }
  .cc-search-clear:hover { background:rgba(255,255,255,.2); }
  .cc-hero-stats { display:inline-flex; align-items:center; gap:0; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:100px; padding:10px 24px; backdrop-filter:blur(8px); }
  .cc-stat { display:flex; flex-direction:column; align-items:center; padding:0 16px; }
  .cc-stat-sep { width:1px; height:24px; background:rgba(255,255,255,.12); }
  .cc-stat-n { font-family:var(--disp); font-style:italic; font-size:1.2rem; font-weight:700; color:#fff; line-height:1.1; }
  .cc-stat-l { font-size:.62rem; color:rgba(255,255,255,.38); text-transform:uppercase; letter-spacing:.08em; margin-top:1px; }

  /* BODY */
  .cc-body { max-width:1280px; margin:0 auto; padding:32px 28px 80px; }

  /* Toolbar */
  .cc-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:28px; position:sticky; top:0; z-index:20; background:var(--cbg); padding:12px 0; border-bottom:1px solid var(--cbor); }
  .cc-cats { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; }
  .cc-cats::-webkit-scrollbar { display:none; }
  .cc-cat { white-space:nowrap; padding:7px 18px; border-radius:100px; border:1.5px solid var(--cbor); background:var(--ccard); font-family:var(--body); font-size:.8rem; font-weight:700; color:var(--ci2); cursor:pointer; transition:all .18s var(--ease); box-shadow:0 1px 3px rgba(0,0,0,.04); }
  .cc-cat:hover { border-color:var(--cv); color:var(--cv); background:var(--cvl); }
  .cc-cat--on { background:var(--cv); border-color:var(--cv); color:#fff; box-shadow:0 4px 14px rgba(79,70,229,.28); }
  .cc-toolbar-right { display:flex; align-items:center; gap:14px; flex-shrink:0; }
  .cc-count { font-size:.8rem; color:var(--ci3); white-space:nowrap; }
  .cc-count strong { color:var(--ci); font-weight:700; }
  .cc-view-toggle { display:flex; gap:2px; background:var(--ccard); border:1.5px solid var(--cbor); border-radius:10px; padding:3px; }
  .cc-view-btn { width:30px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; border:none; background:none; cursor:pointer; color:var(--ci3); transition:all .15s; }
  .cc-view-btn--on { background:var(--cv); color:#fff; }

  /* States */
  .cc-error { background:#fef2f2; border:1px solid #fecaca; color:#991b1b; border-radius:12px; padding:14px 18px; font-size:.875rem; margin-bottom:24px; }
  .cc-loader-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; padding:80px 0; color:var(--ci3); font-size:.875rem; }
  .cc-loader { width:36px; height:36px; border:3px solid var(--cvl); border-top-color:var(--cv); border-radius:50%; animation:cc-spin .8s linear infinite; }
  @keyframes cc-spin { to { transform:rotate(360deg) } }
  .cc-empty { display:flex; flex-direction:column; align-items:center; padding:80px 24px; text-align:center; gap:12px; }
  .cc-empty-glyph { font-family:var(--disp); font-size:5rem; font-style:italic; color:var(--cvl); line-height:1; margin-bottom:4px; }
  .cc-empty h3 { font-family:var(--disp); font-style:italic; font-size:1.6rem; font-weight:700; margin:0; }
  .cc-empty p { font-size:.875rem; color:var(--ci2); margin:0; max-width:300px; line-height:1.6; }
  .cc-reset-btn { background:var(--cv); color:#fff; border:none; border-radius:100px; padding:10px 24px; font-family:var(--body); font-size:.85rem; font-weight:700; cursor:pointer; margin-top:4px; transition:background .2s,transform .2s; }
  .cc-reset-btn:hover { background:var(--cvd); transform:translateY(-1px); }

  /* GRID */
  .cc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(295px,1fr)); gap:22px; }
  @keyframes cc-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .gc { background:var(--ccard); border-radius:20px; overflow:hidden; border:1px solid var(--cbor); box-shadow:0 2px 8px rgba(0,0,0,.04); display:flex; flex-direction:column; animation:cc-up .45s var(--ease) both; transition:transform .3s var(--ease),box-shadow .3s,border-color .2s; }
  .gc:hover { transform:translateY(-7px); box-shadow:0 22px 48px rgba(79,70,229,.12); border-color:rgba(79,70,229,.22); }
  .gc-thumb { position:relative; height:195px; overflow:hidden; flex-shrink:0; }
  .gc-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .55s ease; }
  .gc:hover .gc-thumb img { transform:scale(1.07); }
  .gc-shade { position:absolute; inset:0; background:linear-gradient(to top,rgba(8,8,15,.7) 0%,transparent 50%); }
  .gc-cat-badge { position:absolute; bottom:12px; left:13px; background:rgba(255,255,255,.13); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,.2); color:#fff; font-size:.62rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; padding:4px 11px; border-radius:100px; }
  .gc-cert-badge { position:absolute; top:13px; right:13px; display:inline-flex; align-items:center; gap:4px; background:rgba(79,70,229,.85); backdrop-filter:blur(6px); color:#fff; font-size:.6rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; padding:4px 10px; border-radius:100px; border:1px solid rgba(255,255,255,.15); }
  .gc-body { padding:20px; display:flex; flex-direction:column; flex:1; }
  .gc-title { font-family:var(--disp); font-style:italic; font-size:1.08rem; font-weight:700; line-height:1.3; color:var(--ci); margin:0 0 8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .gc-desc { font-size:.79rem; color:var(--ci3); line-height:1.55; margin:0 0 auto; padding-bottom:16px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .gc-footer { border-top:1px solid var(--cbor); padding-top:14px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .gc-author { display:flex; align-items:center; gap:7px; min-width:0; }
  .gc-av { width:26px; height:26px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,#c7d2fe,#a5b4fc); color:var(--cvd); display:flex; align-items:center; justify-content:center; font-size:.62rem; font-weight:800; }
  .gc-av-name { font-size:.75rem; font-weight:600; color:var(--ci2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  /* Shared enroll button */
  .cc-enroll-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 15px; border-radius:10px; font-family:var(--body); font-size:.78rem; font-weight:700; border:none; cursor:pointer; white-space:nowrap; text-decoration:none; flex-shrink:0; transition:all .2s var(--ease); }
  .cc-enroll-btn--go { background:var(--cv); color:#fff; box-shadow:0 3px 10px rgba(79,70,229,.3); }
  .cc-enroll-btn--go:hover:not(:disabled) { background:var(--cvd); box-shadow:0 6px 16px rgba(79,70,229,.4); transform:translateY(-1px); }
  .cc-enroll-btn--go:disabled { opacity:.65; cursor:not-allowed; transform:none; }
  .cc-enroll-btn--done { background:var(--cgl); color:var(--cg); }
  .cc-enroll-btn--done:hover { background:#a7f3d0; }

  /* Spinner */
  .cc-spin { width:13px; height:13px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:cc-spin .7s linear infinite; display:block; }

  /* LIST */
  .cc-list { display:flex; flex-direction:column; gap:12px; }
  .lc { background:var(--ccard); border-radius:14px; border:1px solid var(--cbor); box-shadow:0 2px 6px rgba(0,0,0,.03); display:flex; align-items:center; gap:18px; padding:14px 18px; animation:cc-up .4s var(--ease) both; transition:border-color .2s,box-shadow .2s,transform .25s var(--ease); }
  .lc:hover { border-color:rgba(79,70,229,.22); box-shadow:0 8px 24px rgba(79,70,229,.09); transform:translateX(5px); }
  .lc-thumb { width:90px; height:65px; border-radius:10px; overflow:hidden; flex-shrink:0; background:var(--cbg); }
  .lc-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
  .lc:hover .lc-thumb img { transform:scale(1.07); }
  .lc-body { flex:1; min-width:0; }
  .lc-meta { display:flex; align-items:center; gap:8px; margin-bottom:5px; }
  .lc-cat { font-size:.62rem; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:var(--cv); background:var(--cvl); padding:3px 9px; border-radius:100px; }
  .lc-cert-tag { font-size:.62rem; font-weight:700; color:var(--ci3); letter-spacing:.04em; }
  .lc-title { font-family:var(--disp); font-style:italic; font-size:.95rem; font-weight:700; line-height:1.3; color:var(--ci); margin:0 0 5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lc-desc { font-size:.75rem; color:var(--ci3); line-height:1.5; margin:0 0 6px; }
  .lc-author { display:flex; align-items:center; gap:6px; font-size:.74rem; color:var(--ci2); font-weight:600; }
  .lc-actions { flex-shrink:0; }

  @media (max-width:640px) {
    .cc-hero { padding:56px 20px 48px; }
    .cc-body { padding:20px 16px 56px; }
    .cc-grid { grid-template-columns:1fr; }
    .cc-toolbar { flex-direction:column; align-items:flex-start; position:static; }
    .cc-hero-stats { display:none; }
    .lc { flex-wrap:wrap; }
    .lc-actions { width:100%; padding-top:8px; border-top:1px solid var(--cbor); }
  }
`;