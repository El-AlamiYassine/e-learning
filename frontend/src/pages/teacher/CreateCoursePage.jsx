import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCourse } from '../../api/teacherApi';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ titre: '', description: '', imageUrl: '', categoryId: '' });
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createCourse({ ...formData, categoryId: formData.categoryId || null });
      navigate('/teacher/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création du cours.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Informations', 'Contenu', 'Couverture'];

  return (
    <div className="cc-root">
      <style>{css}</style>

      {/* Top bar */}
      <header className="cc-topbar">
        <button className="cc-back-btn" onClick={() => navigate(-1)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="cc-steps">
          {steps.map((s, i) => (
            <button
              key={s}
              className={`cc-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}
              onClick={() => setStep(i + 1)}
              type="button"
            >
              <span className="cc-step-num">
                {step > i + 1
                  ? <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  : i + 1}
              </span>
              <span className="cc-step-label">{s}</span>
            </button>
          ))}
        </div>

        <div style={{ width: '90px' }} />
      </header>

      {/* Main */}
      <div className="cc-body">
        <div className="cc-sidebar">
          <p className="cc-sidebar-eyebrow">Nouveau cours</p>
          <h1 className="cc-sidebar-title">Partagez votre <em>expertise</em></h1>
          <p className="cc-sidebar-sub">
            Créez un cours structuré et engageant pour vos élèves en quelques étapes.
          </p>
          <div className="cc-sidebar-tip">
            <div className="tip-icon">💡</div>
            <p>Un bon titre accrocheur augmente le taux d'inscription de 40%.</p>
          </div>

          {formData.imageUrl && (
            <div className="cc-preview-thumb">
              <img src={formData.imageUrl} alt="Aperçu" />
              <span className="cc-preview-badge">Aperçu couverture</span>
            </div>
          )}
        </div>

        <form className="cc-form" onSubmit={handleSubmit}>
          {error && (
            <div className="cc-error">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="cc-step-panel">
              <div className="cc-field">
                <label className="cc-label">Titre du cours <span className="cc-required">*</span></label>
                <input
                  type="text"
                  name="titre"
                  className="cc-input"
                  placeholder="Ex : Maîtriser React de A à Z"
                  required
                  value={formData.titre}
                  onChange={handleChange}
                />
                <span className="cc-hint">{formData.titre.length}/120 caractères</span>
              </div>

              <div className="cc-field">
                <label className="cc-label">Catégorie <span className="cc-required">*</span></label>
                <div className="cc-select-wrap">
                  <select
                    name="categoryId"
                    className="cc-select"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">Choisir une catégorie…</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                  <svg className="cc-select-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button type="button" className="cc-next-btn" onClick={() => setStep(2)}>
                Suivant : Contenu
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="cc-step-panel">
              <div className="cc-field">
                <label className="cc-label">Description du cours <span className="cc-required">*</span></label>
                <textarea
                  name="description"
                  className="cc-textarea"
                  rows="10"
                  placeholder="Décrivez ce que les élèves apprendront, les prérequis, et ce qui rend ce cours unique…"
                  required
                  value={formData.description}
                  onChange={handleChange}
                />
                <span className="cc-hint">{formData.description.length} caractères</span>
              </div>

              <div className="cc-nav-row">
                <button type="button" className="cc-ghost-btn" onClick={() => setStep(1)}>← Retour</button>
                <button type="button" className="cc-next-btn" onClick={() => setStep(3)}>
                  Suivant : Couverture
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="cc-step-panel">
              <div className="cc-field">
                <label className="cc-label">URL de l'image de couverture</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="cc-input"
                  placeholder="https://images.unsplash.com/…"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <span className="cc-hint">Optionnel — une belle image augmente l'attractivité du cours.</span>
              </div>

              {formData.imageUrl && (
                <div className="cc-image-preview">
                  <img src={formData.imageUrl} alt="Aperçu de couverture" />
                  <div className="cc-image-overlay">
                    <span>Aperçu de couverture</span>
                  </div>
                </div>
              )}

              <div className="cc-summary">
                <h3 className="cc-summary-title">Récapitulatif</h3>
                <div className="cc-summary-row">
                  <span>Titre</span>
                  <strong>{formData.titre || <em>non renseigné</em>}</strong>
                </div>
                <div className="cc-summary-row">
                  <span>Catégorie</span>
                  <strong>{categories.find(c => c.id == formData.categoryId)?.nom || <em>non choisie</em>}</strong>
                </div>
                <div className="cc-summary-row">
                  <span>Description</span>
                  <strong>{formData.description ? `${formData.description.slice(0, 60)}…` : <em>non renseignée</em>}</strong>
                </div>
              </div>

              <div className="cc-nav-row">
                <button type="button" className="cc-ghost-btn" onClick={() => setStep(2)}>← Retour</button>
                <button type="submit" className="cc-submit-btn" disabled={loading}>
                  {loading ? <span className="cc-spinner" /> : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {loading ? 'Publication…' : 'Publier le cours'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --cc-ink:     #111117;
    --cc-ink-2:   #52525b;
    --cc-ink-3:   #a1a1aa;
    --cc-bg:      #f5f5f8;
    --cc-card:    #ffffff;
    --cc-border:  rgba(0,0,0,0.08);
    --cc-amber:   #f59e0b;
    --cc-amber-d: #d97706;
    --cc-amber-l: #fffbeb;
    --cc-r:       18px;
    --cc-ease:    cubic-bezier(0.22,1,0.36,1);
    --cc-font:    'Sora', system-ui, sans-serif;
    --cc-serif:   'Lora', Georgia, serif;
  }

  .cc-root {
    min-height: 100vh;
    background: var(--cc-bg);
    font-family: var(--cc-font);
    color: var(--cc-ink);
    display: flex;
    flex-direction: column;
    animation: cc-fade .3s ease both;
  }
  @keyframes cc-fade { from { opacity:0 } to { opacity:1 } }

  /* ── Topbar ───────────────────────────────────── */
  .cc-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    background: var(--cc-card);
    border-bottom: 1px solid var(--cc-border);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .cc-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1.5px solid var(--cc-border);
    border-radius: 100px;
    padding: 7px 16px;
    font-family: var(--cc-font);
    font-size: .8rem;
    font-weight: 600;
    color: var(--cc-ink-2);
    cursor: pointer;
    transition: all .2s;
    width: 90px;
  }
  .cc-back-btn:hover { border-color: var(--cc-amber); color: var(--cc-amber); }

  .cc-steps {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cc-step {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 16px;
    border-radius: 100px;
    border: none;
    background: none;
    font-family: var(--cc-font);
    font-size: .78rem;
    font-weight: 600;
    color: var(--cc-ink-3);
    cursor: pointer;
    transition: all .2s var(--cc-ease);
  }
  .cc-step.active { background: var(--cc-amber-l); color: var(--cc-amber); }
  .cc-step.done   { color: #059669; }
  .cc-step-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: currentColor;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: .68rem;
    flex-shrink: 0;
  }
  .cc-step.active .cc-step-num { background: var(--cc-amber); }
  .cc-step.done   .cc-step-num { background: #059669; }
  .cc-step:not(.active):not(.done) .cc-step-num { background: #d4d4d8; }

  /* ── Layout ───────────────────────────────────── */
  .cc-body {
    display: grid;
    grid-template-columns: 300px 1fr;
    flex: 1;
    max-width: 1100px;
    width: 100%;
    margin: 40px auto;
    gap: 28px;
    padding: 0 32px;
    align-items: start;
  }

  /* ── Sidebar ──────────────────────────────────── */
  .cc-sidebar {
    position: sticky;
    top: 80px;
    background: var(--cc-card);
    border-radius: var(--cc-r);
    padding: 28px;
    border: 1px solid var(--cc-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .cc-sidebar-eyebrow {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--cc-amber);
    margin: 0 0 10px;
  }
  .cc-sidebar-title {
    font-family: var(--cc-font);
    font-size: 1.35rem;
    font-weight: 700;
    margin: 0 0 10px;
    line-height: 1.25;
    letter-spacing: -.02em;
  }
  .cc-sidebar-title em {
    font-family: var(--cc-serif);
    font-style: italic;
    color: var(--cc-amber);
  }
  .cc-sidebar-sub {
    font-size: .82rem;
    color: var(--cc-ink-2);
    line-height: 1.6;
    margin: 0 0 24px;
  }
  .cc-sidebar-tip {
    display: flex;
    gap: 10px;
    background: var(--cc-amber-l);
    border-radius: 12px;
    padding: 14px;
    font-size: .78rem;
    color: #92400e;
    line-height: 1.5;
  }
  .tip-icon { font-size: 1rem; flex-shrink: 0; }
  .cc-sidebar-tip p { margin: 0; }

  .cc-preview-thumb {
    margin-top: 20px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    height: 140px;
    border: 1px solid var(--cc-border);
  }
  .cc-preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .cc-preview-badge {
    position: absolute;
    bottom: 8px; left: 8px;
    background: rgba(0,0,0,.55);
    color: #fff;
    font-size: .68rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 100px;
    backdrop-filter: blur(4px);
  }

  /* ── Form ─────────────────────────────────────── */
  .cc-form {
    background: var(--cc-card);
    border-radius: var(--cc-r);
    padding: 36px;
    border: 1px solid var(--cc-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .cc-step-panel { animation: cc-pan .3s var(--cc-ease) both; }
  @keyframes cc-pan { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }

  .cc-error {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
    border-radius: 12px;
    padding: 13px 16px;
    font-size: .85rem;
    margin-bottom: 24px;
  }

  .cc-field { margin-bottom: 26px; }
  .cc-label {
    display: block;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--cc-ink-2);
    margin-bottom: 8px;
  }
  .cc-required { color: var(--cc-amber); }
  .cc-hint {
    display: block;
    font-size: .72rem;
    color: var(--cc-ink-3);
    margin-top: 6px;
  }

  .cc-input, .cc-select, .cc-textarea {
    width: 100%;
    background: #fafafa;
    border: 1.5px solid var(--cc-border);
    border-radius: 12px;
    padding: 13px 16px;
    font-family: var(--cc-font);
    font-size: .9rem;
    color: var(--cc-ink);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
    box-sizing: border-box;
  }
  .cc-input:focus, .cc-select:focus, .cc-textarea:focus {
    border-color: var(--cc-amber);
    box-shadow: 0 0 0 3px rgba(245,158,11,.12);
    background: #fff;
  }
  .cc-input::placeholder, .cc-textarea::placeholder { color: var(--cc-ink-3); }
  .cc-textarea { resize: vertical; min-height: 200px; line-height: 1.6; }

  .cc-select-wrap { position: relative; }
  .cc-select { padding-right: 42px; cursor: pointer; }
  .cc-select-icon {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--cc-ink-3);
  }

  /* ── Image preview ────────────────────────────── */
  .cc-image-preview {
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    height: 220px;
    margin-bottom: 28px;
    border: 1px solid var(--cc-border);
  }
  .cc-image-preview img { width: 100%; height: 100%; object-fit: cover; }
  .cc-image-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%);
    display: flex; align-items: flex-end; padding: 14px;
  }
  .cc-image-overlay span {
    color: #fff;
    font-size: .75rem;
    font-weight: 600;
    background: rgba(255,255,255,.15);
    backdrop-filter: blur(4px);
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,.2);
  }

  /* ── Summary ──────────────────────────────────── */
  .cc-summary {
    background: #fafafa;
    border: 1.5px solid var(--cc-border);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 28px;
  }
  .cc-summary-title {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--cc-ink-3);
    margin: 0 0 14px;
  }
  .cc-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    font-size: .85rem;
    padding: 8px 0;
    border-bottom: 1px solid var(--cc-border);
  }
  .cc-summary-row:last-child { border-bottom: none; padding-bottom: 0; }
  .cc-summary-row span { color: var(--cc-ink-2); flex-shrink: 0; }
  .cc-summary-row strong { color: var(--cc-ink); font-weight: 600; text-align: right; overflow: hidden; text-overflow: ellipsis; }
  .cc-summary-row em { color: var(--cc-ink-3); font-style: italic; font-weight: 400; }

  /* ── Buttons ──────────────────────────────────── */
  .cc-nav-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 8px;
  }
  .cc-next-btn, .cc-submit-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--cc-ink);
    color: #fff;
    font-family: var(--cc-font);
    font-size: .85rem;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 100px;
    border: none;
    cursor: pointer;
    transition: background .2s, transform .2s var(--cc-ease), box-shadow .2s;
    box-shadow: 0 4px 14px rgba(0,0,0,.12);
  }
  .cc-next-btn { margin-top: 8px; }
  .cc-next-btn:hover { background: var(--cc-amber-d); box-shadow: 0 8px 20px rgba(245,158,11,.3); transform: translateY(-1px); }
  .cc-submit-btn { background: var(--cc-amber); }
  .cc-submit-btn:hover:not(:disabled) { background: var(--cc-amber-d); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(245,158,11,.4); }
  .cc-submit-btn:disabled { opacity: .7; cursor: not-allowed; transform: none; }

  .cc-ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1.5px solid var(--cc-border);
    border-radius: 100px;
    padding: 11px 20px;
    font-family: var(--cc-font);
    font-size: .82rem;
    font-weight: 600;
    color: var(--cc-ink-2);
    cursor: pointer;
    transition: all .2s;
  }
  .cc-ghost-btn:hover { border-color: var(--cc-amber); color: var(--cc-amber); }

  .cc-spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cc-spin .7s linear infinite;
    display: block;
  }
  @keyframes cc-spin { to { transform: rotate(360deg) } }

  @media (max-width: 860px) {
    .cc-body { grid-template-columns: 1fr; padding: 0 20px; margin: 24px auto; }
    .cc-sidebar { position: static; }
    .cc-steps .cc-step-label { display: none; }
    .cc-topbar { padding: 14px 20px; }
  }
`;