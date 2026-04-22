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
    <div className="catalog-root">
      {/* Hero */}
      <header className="catalog-hero">
        <div className="hero-noise" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-inner">
          <p className="hero-eyebrow">Catalogue de formations</p>
          <h1 className="hero-title">
            Développez vos<br />
            <em>compétences</em>
          </h1>
          <p className="hero-sub">
            Accédez à des contenus certifiants et boostez votre carrière dès aujourd'hui.
          </p>
          <div className="search-bar">
            <span className="search-icon">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Qu'allez-vous apprendre aujourd'hui ?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>
      </header>

      <main className="catalog-main">
        {/* Category Filter */}
        <div className="filter-row">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`filter-chip ${selectedCategory === null ? 'active' : ''}`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Results Bar */}
        <div className="results-bar">
          <span className="results-count">
            <strong>{filteredCourses.length}</strong> formation{filteredCourses.length !== 1 ? 's' : ''}
          </span>
          <div className="sort-btn">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M7 12h10M11 17h2" />
            </svg>
            Pertinence
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loader-ring" />
            <span>Chargement des formations…</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3>Aucun résultat</h3>
            <p>Essayez d'autres mots-clés ou explorez toutes les catégories.</p>
            <button
              className="btn-reset"
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map((course, i) => {
              const enrolled = enrolledCourseIds.has(course.id);
              const initial = course.formateur?.prenom?.charAt(0) ?? '?';
              return (
                <article
                  key={course.id}
                  className="course-card"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="card-thumb">
                    <img
                      src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'}
                      alt={course.titre}
                      loading="lazy"
                    />
                    <div className="card-thumb-overlay" />
                    <span className="card-category-badge">
                      {course.categorie?.nom || 'Général'}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-cert-tag">
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Certifié
                    </div>

                    <h2 className="card-title">{course.titre}</h2>
                    <p className="card-desc">
                      {course.description || 'Inscrivez-vous pour accéder au contenu complet.'}
                    </p>

                    <div className="card-footer">
                      <div className="card-author">
                        <span className="author-avatar">{initial}</span>
                        <span className="author-name">
                          {course.formateur?.prenom} {course.formateur?.nom}
                        </span>
                      </div>

                      {enrolled ? (
                        <Link to={`/student/course/${course.id}`} className="btn-enroll btn-enrolled">
                          <svg width="13" height="13" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                          Continuer
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollLoading === course.id}
                          className="btn-enroll btn-enroll-default"
                        >
                          {enrollLoading === course.id ? (
                            <span className="btn-spinner" />
                          ) : (
                            <>
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                              S'inscrire
                            </>
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
      </main>

      <style>{`
        /* ── Tokens ─────────────────────────────────────────────── */
        :root {
          --ink: #0f0f12;
          --ink-soft: #6b6b7a;
          --surface: #f8f8fb;
          --card-bg: #ffffff;
          --border: rgba(0,0,0,0.07);
          --accent: #4f46e5;
          --accent-light: #ede9fe;
          --accent-dark: #3730a3;
          --success: #059669;
          --success-light: #d1fae5;
          --radius-card: 20px;
          --radius-pill: 100px;
          --shadow-card: 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
          --shadow-card-hover: 0 20px 40px rgba(79,70,229,0.12), 0 0 0 1px rgba(79,70,229,0.15);
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --transition: 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Root ───────────────────────────────────────────────── */
        .catalog-root {
          min-height: 100vh;
          background: var(--surface);
          font-family: var(--font-body);
          color: var(--ink);
        }

        /* ── Hero ───────────────────────────────────────────────── */
        .catalog-hero {
          position: relative;
          background: var(--ink);
          overflow: hidden;
          padding: 80px 24px 72px;
          text-align: center;
        }
        .hero-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .hero-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%);
          top: -150px; left: -100px;
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%);
          bottom: -120px; right: -80px;
        }
        .hero-inner {
          position: relative;
          max-width: 680px;
          margin: 0 auto;
        }
        .hero-eyebrow {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a78bfa;
          margin: 0 0 20px;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 6vw, 3.8rem);
          font-weight: 700;
          line-height: 1.12;
          color: #ffffff;
          margin: 0 0 20px;
        }
        .hero-title em {
          font-style: italic;
          color: #a78bfa;
        }
        .hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.55);
          margin: 0 0 36px;
          line-height: 1.6;
        }

        /* ── Search ─────────────────────────────────────────────── */
        .search-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-pill);
          padding: 6px 8px 6px 20px;
          backdrop-filter: blur(12px);
          transition: border-color var(--transition);
          max-width: 540px;
          margin: 0 auto;
        }
        .search-bar:focus-within {
          border-color: rgba(167,139,250,0.5);
          background: rgba(255,255,255,0.1);
        }
        .search-icon {
          color: rgba(255,255,255,0.4);
          display: flex;
          flex-shrink: 0;
          margin-right: 12px;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: var(--font-body);
          font-size: 0.95rem;
          min-width: 0;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.35); }
        .search-clear {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.5);
          width: 28px; height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.7rem;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-right: 6px;
        }
        .search-bar button.search-submit {
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-pill);
          padding: 9px 22px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: background var(--transition);
        }
        .search-bar button.search-submit:hover { background: var(--accent-dark); }

        /* ── Main ───────────────────────────────────────────────── */
        .catalog-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* ── Filters ─────────────────────────────────────────────── */
        .filter-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          margin-bottom: 32px;
          scrollbar-width: none;
        }
        .filter-row::-webkit-scrollbar { display: none; }
        .filter-chip {
          white-space: nowrap;
          padding: 8px 20px;
          border-radius: var(--radius-pill);
          border: 1.5px solid var(--border);
          background: var(--card-bg);
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--ink-soft);
          cursor: pointer;
          transition: all var(--transition);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .filter-chip:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-light);
        }
        .filter-chip.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
          box-shadow: 0 4px 14px rgba(79,70,229,0.3);
        }

        /* ── Results Bar ─────────────────────────────────────────── */
        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .results-count {
          font-size: 0.9rem;
          color: var(--ink-soft);
        }
        .results-count strong {
          color: var(--ink);
          font-weight: 600;
        }
        .sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--ink-soft);
          background: var(--card-bg);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 7px 14px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }

        /* ── Grid ───────────────────────────────────────────────── */
        .course-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }

        /* ── Card ───────────────────────────────────────────────── */
        .course-card {
          background: var(--card-bg);
          border-radius: var(--radius-card);
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform var(--transition), box-shadow var(--transition);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.4s both ease-out;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .course-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-card-hover);
        }

        .card-thumb {
          position: relative;
          height: 190px;
          overflow: hidden;
        }
        .card-thumb img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .course-card:hover .card-thumb img { transform: scale(1.05); }
        .card-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(15,15,18,0.55) 0%, transparent 55%);
        }
        .card-category-badge {
          position: absolute;
          bottom: 12px; left: 14px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
        }

        .card-body {
          padding: 22px 22px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-cert-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          background: var(--accent-light);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          width: fit-content;
          margin-bottom: 12px;
        }
        .card-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.35;
          color: var(--ink);
          margin: 0 0 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-desc {
          font-size: 0.845rem;
          color: var(--ink-soft);
          line-height: 1.55;
          margin: 0 0 auto;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          padding-bottom: 16px;
        }

        .card-footer {
          border-top: 1px solid var(--border);
          padding-top: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .card-author {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .author-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #c7d2fe, #a5b4fc);
          color: var(--accent-dark);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .author-name {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--ink-soft);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Buttons ─────────────────────────────────────────────── */
        .btn-enroll {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          transition: all var(--transition);
          text-decoration: none;
          flex-shrink: 0;
        }
        .btn-enroll-default {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 4px 12px rgba(79,70,229,0.25);
        }
        .btn-enroll-default:hover:not(:disabled) {
          background: var(--accent-dark);
          box-shadow: 0 6px 18px rgba(79,70,229,0.35);
          transform: translateY(-1px);
        }
        .btn-enroll-default:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-enrolled {
          background: var(--success-light);
          color: var(--success);
        }
        .btn-enrolled:hover {
          background: #a7f3d0;
        }
        .btn-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── States ─────────────────────────────────────────────── */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 100px 0;
          color: var(--ink-soft);
          font-size: 0.9rem;
        }
        .loader-ring {
          width: 40px; height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        .empty-state {
          text-align: center;
          padding: 80px 24px;
          max-width: 400px;
          margin: 0 auto;
        }
        .empty-icon {
          width: 72px; height: 72px;
          background: var(--accent-light);
          color: var(--accent);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .empty-state h3 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 10px;
        }
        .empty-state p {
          color: var(--ink-soft);
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 24px;
        }
        .btn-reset {
          display: inline-block;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-pill);
          padding: 10px 28px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition);
        }
        .btn-reset:hover { background: var(--accent-dark); }

        .error-banner {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 0.9rem;
          margin-bottom: 24px;
          text-align: center;
        }

        @media (max-width: 640px) {
          .catalog-hero { padding: 60px 20px 56px; }
          .catalog-main { padding: 28px 16px 60px; }
          .course-grid { grid-template-columns: 1fr; gap: 16px; }
          .results-bar { flex-wrap: wrap; gap: 10px; }
        }
      `}</style>
    </div>
  );
}