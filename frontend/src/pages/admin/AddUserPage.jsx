import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCreateUser } from '../../api/adminApi';

const ROLES = [
  {
    value: 'ROLE_STUDENT',
    label: 'Étudiant',
    desc: 'Accès aux cours et au catalogue',
    icon: '📖',
    bg: '#eff6ff', color: '#2563eb',
  },
  {
    value: 'ROLE_TEACHER',
    label: 'Enseignant',
    desc: 'Création et gestion de cours',
    icon: '🎓',
    bg: '#f5f3ff', color: '#7c3aed',
  },
  {
    value: 'ROLE_ADMIN',
    label: 'Administrateur',
    desc: 'Accès complet à la plateforme',
    icon: '⚡',
    bg: '#fff1f2', color: '#e11d48',
  },
];

export default function AddUserPage() {
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', motDePasse: '', role: 'ROLE_STUDENT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminCreateUser(form);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Erreur lors de la création de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === form.role);

  return (
    <div className="au-root">
      <style>{css}</style>

      {/* Header */}
      <header className="au-header">
        <button className="au-back-btn" onClick={() => navigate('/admin/users')}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <div>
          <p className="au-eyebrow">Administration</p>
          <h1 className="au-title">Ajouter un <em>utilisateur</em></h1>
        </div>
      </header>

      <div className="au-layout">
        {/* Form */}
        <div className="au-card">
          {error && (
            <div className="au-error">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div className="au-row-2">
              <div className="au-field">
                <label className="au-label">Prénom <span className="au-req">*</span></label>
                <input
                  type="text" name="prenom"
                  className="au-input"
                  placeholder="Marie"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="au-field">
                <label className="au-label">Nom <span className="au-req">*</span></label>
                <input
                  type="text" name="nom"
                  className="au-input"
                  placeholder="Dupont"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="au-field">
              <label className="au-label">Adresse email <span className="au-req">*</span></label>
              <div className="au-input-wrap">
                <svg className="au-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email" name="email"
                  className="au-input au-input--icon"
                  placeholder="marie.dupont@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="au-field">
              <label className="au-label">Mot de passe temporaire <span className="au-req">*</span></label>
              <div className="au-input-wrap">
                <svg className="au-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="motDePasse"
                  className="au-input au-input--icon au-input--icon-r"
                  placeholder="••••••••"
                  value={form.motDePasse}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="au-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <span className="au-hint">L'utilisateur devra changer son mot de passe à la première connexion.</span>
            </div>

            {/* Role picker */}
            <div className="au-field">
              <label className="au-label">Rôle <span className="au-req">*</span></label>
              <div className="au-roles">
                {ROLES.map(role => (
                  <label
                    key={role.value}
                    className={`au-role-option ${form.role === role.value ? 'au-role-option--selected' : ''}`}
                    style={form.role === role.value
                      ? { borderColor: role.color, background: role.bg }
                      : {}}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={handleChange}
                      className="au-role-radio"
                    />
                    <span className="au-role-emoji">{role.icon}</span>
                    <span className="au-role-body">
                      <span className="au-role-name" style={form.role === role.value ? { color: role.color } : {}}>
                        {role.label}
                      </span>
                      <span className="au-role-desc">{role.desc}</span>
                    </span>
                    {form.role === role.value && (
                      <span className="au-role-check" style={{ color: role.color }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="au-actions">
              <button type="button" className="au-cancel-btn" onClick={() => navigate('/admin/users')}>
                Annuler
              </button>
              <button type="submit" className="au-submit-btn" disabled={loading}>
                {loading ? <span className="au-spinner" /> : (
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
                {loading ? 'Création…' : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="au-preview">
          <p className="au-preview-label">Aperçu du compte</p>
          <div className="au-preview-card">
            <div
              className="au-preview-avatar"
              style={{ background: `linear-gradient(135deg, ${selectedRole?.color}33, ${selectedRole?.color}66)`, color: selectedRole?.color }}
            >
              {form.prenom?.charAt(0)?.toUpperCase() || '?'}{form.nom?.charAt(0)?.toUpperCase() || ''}
            </div>
            <span className="au-preview-name">
              {form.prenom || 'Prénom'} {form.nom || 'Nom'}
            </span>
            <span className="au-preview-email">{form.email || 'email@exemple.com'}</span>
            <span
              className="au-preview-role"
              style={{ background: selectedRole?.bg, color: selectedRole?.color }}
            >
              {selectedRole?.icon} {selectedRole?.label}
            </span>
          </div>

          <div className="au-preview-info">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Un email de bienvenue sera envoyé automatiquement à l'adresse renseignée.
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --au-ink:    #111117;
    --au-ink-2:  #52525b;
    --au-ink-3:  #a1a1aa;
    --au-bg:     #f5f5f8;
    --au-card:   #ffffff;
    --au-border: rgba(0,0,0,0.08);
    --au-rose:   #e11d48;
    --au-rose-l: #fff1f2;
    --au-rose-d: #be123c;
    --au-r:      18px;
    --au-ease:   cubic-bezier(0.22,1,0.36,1);
    --au-font:   'Sora', system-ui, sans-serif;
    --au-serif:  'Lora', Georgia, serif;
  }

  .au-root {
    font-family: var(--au-font);
    color: var(--au-ink);
    padding: 36px 40px 64px;
    max-width: 960px;
    animation: au-fade .35s ease both;
  }
  @keyframes au-fade { from { opacity:0 } to { opacity:1 } }

  /* Header */
  .au-header {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .au-back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--au-card);
    border: 1.5px solid var(--au-border);
    border-radius: 100px;
    padding: 8px 16px;
    font-family: var(--au-font); font-size: .8rem; font-weight: 600;
    color: var(--au-ink-2); cursor: pointer;
    transition: all .2s; white-space: nowrap;
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
    margin-top: 4px;
  }
  .au-back-btn:hover { border-color: var(--au-rose); color: var(--au-rose); }
  .au-eyebrow {
    font-size: .68rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--au-rose); margin: 0 0 6px;
  }
  .au-title {
    font-size: clamp(1.4rem, 2.5vw, 1.9rem); font-weight: 700;
    letter-spacing: -.02em; margin: 0; line-height: 1.15;
  }
  .au-title em { font-family: var(--au-serif); font-style: italic; color: var(--au-rose); }

  /* Layout */
  .au-layout {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: 24px;
    align-items: start;
  }

  /* Card */
  .au-card {
    background: var(--au-card);
    border-radius: var(--au-r);
    padding: 32px;
    border: 1.5px solid var(--au-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }

  /* Error */
  .au-error {
    display: flex; align-items: center; gap: 10px;
    background: var(--au-rose-l);
    border: 1px solid rgba(225,29,72,.2);
    color: var(--au-rose-d);
    border-radius: 12px; padding: 13px 16px;
    font-size: .85rem; margin-bottom: 24px;
  }

  /* Fields */
  .au-row-2 {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 16px; margin-bottom: 20px;
  }
  .au-field { margin-bottom: 20px; }
  .au-label {
    display: block; font-size: .72rem; font-weight: 700;
    letter-spacing: .07em; text-transform: uppercase;
    color: var(--au-ink-2); margin-bottom: 8px;
  }
  .au-req { color: var(--au-rose); }
  .au-hint {
    display: block; font-size: .72rem; color: var(--au-ink-3);
    margin-top: 6px; line-height: 1.5;
  }

  .au-input-wrap { position: relative; }
  .au-input-icon {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%);
    color: var(--au-ink-3); pointer-events: none;
  }
  .au-eye-btn {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: var(--au-ink-3); padding: 4px;
    transition: color .2s;
  }
  .au-eye-btn:hover { color: var(--au-ink); }

  .au-input {
    width: 100%; background: #fafafa;
    border: 1.5px solid var(--au-border);
    border-radius: 12px; padding: 12px 14px;
    font-family: var(--au-font); font-size: .88rem;
    color: var(--au-ink); outline: none;
    transition: border-color .2s, box-shadow .2s;
    box-sizing: border-box;
  }
  .au-input--icon  { padding-left: 38px; }
  .au-input--icon-r { padding-right: 38px; }
  .au-input:focus {
    border-color: var(--au-rose);
    box-shadow: 0 0 0 3px rgba(225,29,72,.1);
    background: #fff;
  }
  .au-input::placeholder { color: var(--au-ink-3); }

  /* Role picker */
  .au-roles { display: flex; flex-direction: column; gap: 10px; }
  .au-role-option {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px;
    border-radius: 13px;
    border: 1.5px solid var(--au-border);
    background: var(--au-bg);
    cursor: pointer;
    transition: all .2s var(--au-ease);
  }
  .au-role-option:hover { border-color: var(--au-ink-3); }
  .au-role-option--selected { box-shadow: 0 4px 12px rgba(0,0,0,.07); }
  .au-role-radio { display: none; }
  .au-role-emoji { font-size: 1.1rem; flex-shrink: 0; }
  .au-role-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .au-role-name { font-size: .85rem; font-weight: 700; color: var(--au-ink); }
  .au-role-desc { font-size: .72rem; color: var(--au-ink-3); }
  .au-role-check { flex-shrink: 0; }

  /* Actions */
  .au-actions {
    display: flex; gap: 12px; margin-top: 28px;
    padding-top: 24px; border-top: 1px solid var(--au-border);
  }
  .au-cancel-btn {
    display: inline-flex; align-items: center;
    padding: 11px 22px; border-radius: 100px;
    border: 1.5px solid var(--au-border);
    background: var(--au-bg); color: var(--au-ink-2);
    font-family: var(--au-font); font-size: .82rem; font-weight: 600;
    cursor: pointer; transition: all .2s var(--au-ease);
  }
  .au-cancel-btn:hover { border-color: var(--au-rose); color: var(--au-rose); }
  .au-submit-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 24px; border-radius: 100px;
    border: none; background: var(--au-rose); color: #fff;
    font-family: var(--au-font); font-size: .82rem; font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(225,29,72,.3);
    transition: background .2s, transform .2s var(--au-ease), box-shadow .2s;
  }
  .au-submit-btn:hover:not(:disabled) {
    background: var(--au-rose-d);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(225,29,72,.4);
  }
  .au-submit-btn:disabled { opacity: .65; cursor: not-allowed; transform: none; }
  .au-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%; display: block;
    animation: au-spin .7s linear infinite;
  }
  @keyframes au-spin { to { transform: rotate(360deg) } }

  /* Preview */
  .au-preview { position: sticky; top: 80px; }
  .au-preview-label {
    font-size: .68rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--au-ink-3); margin: 0 0 12px 4px;
  }
  .au-preview-card {
    background: var(--au-card);
    border: 1.5px solid var(--au-border);
    border-radius: var(--au-r);
    padding: 24px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .au-preview-avatar {
    width: 56px; height: 56px;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; font-weight: 700;
    margin-bottom: 4px;
    transition: all .3s var(--au-ease);
  }
  .au-preview-name {
    font-size: .9rem; font-weight: 700; color: var(--au-ink);
  }
  .au-preview-email {
    font-size: .72rem; color: var(--au-ink-3);
    word-break: break-all;
  }
  .au-preview-role {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .72rem; font-weight: 700;
    padding: 4px 12px; border-radius: 100px;
    margin-top: 4px;
  }
  .au-preview-info {
    display: flex; align-items: flex-start; gap: 8px;
    margin-top: 14px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 12px;
    padding: 12px 14px;
    font-size: .75rem; color: #0369a1; line-height: 1.5;
  }
  .au-preview-info svg { flex-shrink: 0; margin-top: 1px; color: #0ea5e9; }

  @media (max-width: 768px) {
    .au-root { padding: 22px 16px 48px; }
    .au-layout { grid-template-columns: 1fr; }
    .au-preview { position: static; }
    .au-row-2 { grid-template-columns: 1fr; }
  }
`;