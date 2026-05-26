import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileApi } from '../../api/userApi';

const avatarColors = [
  ['#ede9fe', '#4f46e5'], ['#d1fae5', '#059669'],
  ['#fef3c7', '#d97706'], ['#fee2e2', '#dc2626'],
  ['#e0f2fe', '#0284c7'],
];

function getAvatarColor(name) {
  const idx = (name?.charCodeAt(0) || 65) % avatarColors.length;
  return avatarColors[idx];
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '8 caractères', ok: password.length >= 8 },
    { label: 'Majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Chiffre', ok: /[0-9]/.test(password) },
    { label: 'Symbole', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const labels = ['Très faible', 'Faible', 'Correct', 'Fort'];
  return (
    <div className="pp-strength">
      <div className="pp-strength-bars">
        {[0,1,2,3].map(i => (
          <div key={i} className="pp-strength-bar" style={{ background: i < score ? colors[score - 1] : 'rgba(0,0,0,.08)' }} />
        ))}
      </div>
      <span className="pp-strength-label" style={{ color: colors[score - 1] || '#a1a1aa' }}>
        {score > 0 ? labels[score - 1] : 'Entrez un mot de passe'}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    motDePasse: '',
    confirmMotDePasse: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState('info'); // 'info' | 'security'

  const [bgColor, textColor] = getAvatarColor(user?.nom);
  const initials = `${user?.prenom?.[0] ?? ''}${user?.nom?.[0] ?? ''}`.toUpperCase();

  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (activeSection === 'security') {
      if (!formData.motDePasse) {
        setError('Veuillez saisir un nouveau mot de passe.');
        setLoading(false);
        return;
      }
      if (formData.motDePasse !== formData.confirmMotDePasse) {
        setError('Les mots de passe ne correspondent pas.');
        setLoading(false);
        return;
      }
      if (formData.motDePasse.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
      };
      if (activeSection === 'security' && formData.motDePasse) {
        payload.motDePasse = formData.motDePasse;
      }

      const res = await updateProfileApi(payload);
      const { token, role, nom, prenom, email } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ nom, prenom, email, role }));

      setSuccess(activeSection === 'security' ? 'Mot de passe mis à jour avec succès.' : 'Profil mis à jour avec succès.');
      setFormData(prev => ({ ...prev, motDePasse: '', confirmMotDePasse: '' }));

      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.motDePasse && formData.confirmMotDePasse && formData.motDePasse === formData.confirmMotDePasse;
  const passwordsMismatch = formData.motDePasse && formData.confirmMotDePasse && formData.motDePasse !== formData.confirmMotDePasse;

  return (
    <div className="pp-root">
      <style>{css}</style>

      {/* Header */}
      <header className="pp-header">
        <div>
          <p className="pp-eyebrow">Mon compte</p>
          <h1 className="pp-title">Profil <em>& Sécurité</em></h1>
        </div>
      </header>

      <div className="pp-layout">

        {/* Identity card */}
        <div className="pp-identity-card">
          <div className="pp-avatar" style={{ background: bgColor, color: textColor }}>
            {initials}
          </div>
          <div className="pp-identity-info">
            <span className="pp-identity-name">{user?.prenom} {user?.nom}</span><br />
            <span className="pp-identity-role">
              {user?.role === 'ROLE_ADMIN' ? '⚡ Administrateur' : user?.role === 'ROLE_TEACHER' ? '🎓 Enseignant' : '📖 Étudiant'}
            </span>
          </div>

          {/* Section tabs */}
          <div className="pp-tabs">
            <button
              className={`pp-tab ${activeSection === 'info' ? 'pp-tab--on' : ''}`}
              onClick={() => { setActiveSection('info'); setError(''); setSuccess(''); }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations
            </button>
            <button
              className={`pp-tab ${activeSection === 'security' ? 'pp-tab--on' : ''}`}
              onClick={() => { setActiveSection('security'); setError(''); setSuccess(''); }}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sécurité
            </button>
          </div>
        </div>

        {/* Form panel */}
        <div className="pp-panel">

          {/* Toast */}
          {success && (
            <div className="pp-toast pp-toast--success">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="pp-toast pp-toast--error">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── INFO SECTION ── */}
            {activeSection === 'info' && (
              <div className="pp-section">
                <div className="pp-section-head">
                  <div className="pp-section-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="pp-section-title">Informations personnelles</h2>
                    <p className="pp-section-sub">Mettez à jour votre nom et votre adresse email.</p>
                  </div>
                </div>

                <div className="pp-row-2">
                  <div className="pp-field">
                    <label className="pp-label">Prénom <span className="pp-req">*</span></label>
                    <input
                      type="text" name="prenom"
                      className="pp-input"
                      value={formData.prenom}
                      onChange={handleChange}
                      placeholder="Marie"
                      required
                    />
                  </div>
                  <div className="pp-field">
                    <label className="pp-label">Nom <span className="pp-req">*</span></label>
                    <input
                      type="text" name="nom"
                      className="pp-input"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div className="pp-field">
                  <label className="pp-label">Adresse email <span className="pp-req">*</span></label>
                  <div className="pp-input-wrap">
                    <svg className="pp-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="email" name="email"
                      className="pp-input pp-input--icon"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="marie@exemple.com"
                      required
                    />
                  </div>
                </div>

                <div className="pp-info-note">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Modifier votre email vous déconnectera et nécessitera une reconnexion.
                </div>

                <button type="submit" className="pp-submit-btn" disabled={loading}>
                  {loading ? <span className="pp-spinner" /> : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {loading ? 'Sauvegarde…' : 'Sauvegarder les modifications'}
                </button>
              </div>
            )}

            {/* ── SECURITY SECTION ── */}
            {activeSection === 'security' && (
              <div className="pp-section">
                <div className="pp-section-head">
                  <div className="pp-section-icon pp-section-icon--amber">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="pp-section-title">Changer le mot de passe</h2>
                    <p className="pp-section-sub">Choisissez un mot de passe fort d'au moins 8 caractères.</p>
                  </div>
                </div>

                <div className="pp-field">
                  <label className="pp-label">Nouveau mot de passe <span className="pp-req">*</span></label>
                  <div className="pp-input-wrap">
                    <svg className="pp-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPass ? 'text' : 'password'}
                      name="motDePasse"
                      className="pp-input pp-input--icon pp-input--icon-r"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                    <button type="button" className="pp-eye-btn" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                      {showPass
                        ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                  <PasswordStrength password={formData.motDePasse} />
                </div>

                <div className="pp-field">
                  <label className="pp-label">
                    Confirmer le mot de passe <span className="pp-req">*</span>
                    {passwordsMatch && <span className="pp-match-ok">✓ Identique</span>}
                    {passwordsMismatch && <span className="pp-match-err">✕ Différent</span>}
                  </label>
                  <div className="pp-input-wrap">
                    <svg className="pp-input-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmMotDePasse"
                      className={`pp-input pp-input--icon pp-input--icon-r ${passwordsMismatch ? 'pp-input--error' : ''} ${passwordsMatch ? 'pp-input--ok' : ''}`}
                      value={formData.confirmMotDePasse}
                      onChange={handleChange}
                      placeholder="Retapez le mot de passe"
                      required
                    />
                    <button type="button" className="pp-eye-btn" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                      {showConfirm
                        ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                </div>

                <div className="pp-security-tips">
                  <p className="pp-tips-title">Conseils pour un mot de passe fort :</p>
                  {[
                    { label: 'Au moins 8 caractères', ok: formData.motDePasse.length >= 8 },
                    { label: 'Une lettre majuscule', ok: /[A-Z]/.test(formData.motDePasse) },
                    { label: 'Un chiffre', ok: /[0-9]/.test(formData.motDePasse) },
                    { label: 'Un symbole (!@#…)', ok: /[^A-Za-z0-9]/.test(formData.motDePasse) },
                  ].map(tip => (
                    <div key={tip.label} className={`pp-tip ${tip.ok ? 'pp-tip--ok' : ''}`}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        {tip.ok
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          : <circle cx="12" cy="12" r="9" />
                        }
                      </svg>
                      {tip.label}
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="pp-submit-btn pp-submit-btn--amber"
                  disabled={loading || passwordsMismatch}
                >
                  {loading ? <span className="pp-spinner" /> : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {loading ? 'Mise à jour…' : 'Changer le mot de passe'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --pp-ink:    #111117;
    --pp-ink-2:  #52525b;
    --pp-ink-3:  #a1a1aa;
    --pp-bg:     #f5f5f8;
    --pp-card:   #ffffff;
    --pp-border: rgba(0,0,0,.08);
    --pp-violet: #6366f1;
    --pp-vl:     #eef2ff;
    --pp-vd:     #4338ca;
    --pp-amber:  #f59e0b;
    --pp-al:     #fffbeb;
    --pp-ad:     #d97706;
    --pp-green:  #059669;
    --pp-gl:     #d1fae5;
    --pp-red:    #dc2626;
    --pp-rl:     #fee2e2;
    --pp-r:      18px;
    --pp-ease:   cubic-bezier(.22,1,.36,1);
    --pp-font:   'Sora', system-ui, sans-serif;
    --pp-serif:  'Lora', Georgia, serif;
  }

  .pp-root {
    font-family: var(--pp-font);
    color: var(--pp-ink);
    padding: 36px 40px 64px;
    max-width: 880px;
    animation: pp-fade .35s ease both;
  }
  @keyframes pp-fade { from{opacity:0} to{opacity:1} }

  /* Header */
  .pp-header { margin-bottom: 32px; }
  .pp-eyebrow { font-size:.68rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--pp-violet); margin:0 0 8px; }
  .pp-title { font-size:clamp(1.5rem,2.5vw,2rem); font-weight:700; letter-spacing:-.02em; margin:0; line-height:1.15; }
  .pp-title em { font-family:var(--pp-serif); font-style:italic; color:var(--pp-violet); }

  /* Layout */
  .pp-layout { display:grid; grid-template-columns:240px 1fr; gap:24px; align-items:start; }

  /* Identity card */
  .pp-identity-card {
    background: var(--pp-card);
    border-radius: var(--pp-r);
    padding: 24px 18px;
    border: 1.5px solid var(--pp-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
    display: flex; flex-direction: column;
    align-items: center; text-align: center; gap: 10px;
    position: sticky; top: 24px;
  }
  .pp-avatar {
    width: 68px; height: 68px; border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 800;
    letter-spacing: .02em;
    box-shadow: 0 4px 16px rgba(0,0,0,.1);
    margin-bottom: 4px;
  }
  .pp-identity-name { font-size:.9rem; font-weight:700; color:var(--pp-ink); }
  .pp-identity-email { font-size:.72rem; color:var(--pp-ink-3); word-break:break-all; }
  .pp-identity-role { font-size:.7rem; font-weight:700; color:var(--pp-violet); background:var(--pp-vl); padding:4px 12px; border-radius:100px; }

  /* Tabs */
  .pp-tabs { display:flex; flex-direction:column; gap:4px; width:100%; margin-top:12px; padding-top:16px; border-top:1px solid var(--pp-border); }
  .pp-tab { display:flex; align-items:center; gap:9px; width:100%; padding:10px 14px; border-radius:11px; border:none; background:none; font-family:var(--pp-font); font-size:.82rem; font-weight:600; color:var(--pp-ink-2); cursor:pointer; transition:all .18s var(--pp-ease); text-align:left; }
  .pp-tab:hover { background:var(--pp-bg); color:var(--pp-ink); }
  .pp-tab--on { background:var(--pp-vl); color:var(--pp-violet); }

  /* Panel */
  .pp-panel {
    background: var(--pp-card);
    border-radius: var(--pp-r);
    padding: 32px;
    border: 1.5px solid var(--pp-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }

  /* Toast */
  .pp-toast { display:flex; align-items:center; gap:10px; border-radius:12px; padding:13px 16px; font-size:.85rem; font-weight:600; margin-bottom:24px; animation:pp-slide .3s var(--pp-ease); }
  @keyframes pp-slide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  .pp-toast--success { background:var(--pp-gl); color:var(--pp-green); border:1px solid rgba(5,150,105,.2); }
  .pp-toast--error   { background:var(--pp-rl); color:var(--pp-red);   border:1px solid rgba(220,38,38,.2); }

  /* Section */
  .pp-section {}
  .pp-section-head { display:flex; align-items:flex-start; gap:14px; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--pp-border); }
  .pp-section-icon { width:38px; height:38px; border-radius:11px; background:var(--pp-vl); color:var(--pp-violet); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .pp-section-icon--amber { background:var(--pp-al); color:var(--pp-amber); }
  .pp-section-title { font-size:.92rem; font-weight:700; margin:0 0 4px; }
  .pp-section-sub { font-size:.78rem; color:var(--pp-ink-2); margin:0; line-height:1.5; }

  /* Row */
  .pp-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

  /* Fields */
  .pp-field { margin-bottom:20px; }
  .pp-label { display:flex; align-items:center; gap:6px; font-size:.72rem; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:var(--pp-ink-2); margin-bottom:8px; }
  .pp-req { color:var(--pp-violet); }
  .pp-match-ok  { color:var(--pp-green); font-size:.65rem; font-weight:800; margin-left:auto; }
  .pp-match-err { color:var(--pp-red);   font-size:.65rem; font-weight:800; margin-left:auto; }

  .pp-input-wrap { position:relative; }
  .pp-input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--pp-ink-3); pointer-events:none; }
  .pp-eye-btn { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--pp-ink-3); padding:4px; transition:color .2s; }
  .pp-eye-btn:hover { color:var(--pp-ink); }

  .pp-input {
    width:100%; background:#fafafa; border:1.5px solid var(--pp-border);
    border-radius:12px; padding:12px 14px;
    font-family:var(--pp-font); font-size:.875rem; color:var(--pp-ink);
    outline:none; transition:border-color .2s,box-shadow .2s;
    box-sizing:border-box;
  }
  .pp-input--icon   { padding-left:40px; }
  .pp-input--icon-r { padding-right:40px; }
  .pp-input:focus { border-color:var(--pp-violet); box-shadow:0 0 0 3px rgba(99,102,241,.12); background:#fff; }
  .pp-input--error { border-color:var(--pp-red) !important; box-shadow:0 0 0 3px rgba(220,38,38,.1) !important; }
  .pp-input--ok    { border-color:var(--pp-green) !important; }
  .pp-input::placeholder { color:var(--pp-ink-3); }

  /* Password strength */
  .pp-strength { display:flex; align-items:center; gap:10px; margin-top:8px; }
  .pp-strength-bars { display:flex; gap:4px; flex:1; }
  .pp-strength-bar { height:4px; flex:1; border-radius:100px; transition:background .3s; }
  .pp-strength-label { font-size:.7rem; font-weight:700; white-space:nowrap; }

  /* Security tips */
  .pp-security-tips { background:var(--pp-bg); border-radius:12px; padding:14px 16px; margin-bottom:24px; }
  .pp-tips-title { font-size:.72rem; font-weight:700; color:var(--pp-ink-2); text-transform:uppercase; letter-spacing:.06em; margin:0 0 10px; }
  .pp-tip { display:flex; align-items:center; gap:7px; font-size:.76rem; color:var(--pp-ink-3); margin-bottom:6px; font-weight:500; }
  .pp-tip:last-child { margin-bottom:0; }
  .pp-tip--ok { color:var(--pp-green); }
  .pp-tip--ok svg { color:var(--pp-green); }

  /* Info note */
  .pp-info-note { display:flex; align-items:flex-start; gap:8px; font-size:.75rem; color:var(--pp-ink-3); line-height:1.5; margin-bottom:24px; }
  .pp-info-note svg { flex-shrink:0; margin-top:1px; }

  /* Submit */
  .pp-submit-btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:12px 28px; border-radius:100px;
    background:var(--pp-violet); color:#fff;
    font-family:var(--pp-font); font-size:.85rem; font-weight:700;
    border:none; cursor:pointer;
    box-shadow:0 4px 14px rgba(99,102,241,.3);
    transition:background .2s,transform .2s var(--pp-ease),box-shadow .2s;
  }
  .pp-submit-btn:hover:not(:disabled) { background:var(--pp-vd); transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.4); }
  .pp-submit-btn:disabled { opacity:.65; cursor:not-allowed; transform:none; }
  .pp-submit-btn--amber { background:var(--pp-amber); box-shadow:0 4px 14px rgba(245,158,11,.3); }
  .pp-submit-btn--amber:hover:not(:disabled) { background:var(--pp-ad); box-shadow:0 6px 20px rgba(245,158,11,.4); }

  /* Spinner */
  .pp-spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; animation:pp-spin .7s linear infinite; display:block; }
  @keyframes pp-spin { to{transform:rotate(360deg)} }

  @media (max-width:720px) {
    .pp-root { padding:22px 16px 48px; }
    .pp-layout { grid-template-columns:1fr; }
    .pp-identity-card { position:static; flex-direction:row; text-align:left; flex-wrap:wrap; }
    .pp-avatar { width:52px; height:52px; flex-shrink:0; }
    .pp-tabs { flex-direction:row; }
    .pp-row-2 { grid-template-columns:1fr; }
    .pp-panel { padding:22px; }
  }
`;