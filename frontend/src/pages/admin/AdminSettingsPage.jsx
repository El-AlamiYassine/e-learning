import { useState, useEffect } from 'react';
import { getMaintenanceStatus, updateMaintenanceStatus } from '../../api/adminApi';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await getMaintenanceStatus();
        setMaintenanceMode(res.data.maintenanceMode);
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleMaintenance = async () => {
    const newStatus = !maintenanceMode;
    const confirmMsg = newStatus
      ? 'Activer le mode maintenance ? Les utilisateurs non-admins seront redirigés vers une page dédiée.'
      : 'Désactiver le mode maintenance ? Le site redeviendra accessible à tous.';
    if (!window.confirm(confirmMsg)) return;
    try {
      setToggling(true);
      await updateMaintenanceStatus(newStatus);
      setMaintenanceMode(newStatus);
      showToast(
        newStatus ? 'Mode maintenance activé.' : 'Mode maintenance désactivé.',
        newStatus ? 'warn' : 'success'
      );
    } catch (err) {
      showToast('Erreur lors de la mise à jour.', 'error');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="as-loading">
        <div className="as-loader" />
        <span>Chargement des paramètres…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .as-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .as-loader { width:32px; height:32px; border:3px solid #fecdd3; border-top-color:#e11d48; border-radius:50%; animation:as-spin .8s linear infinite; }
          @keyframes as-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="as-root">
      <style>{css}</style>

      {/* Toast */}
      {toastMsg && (
        <div className={`as-toast as-toast--${toastMsg.type}`}>
          {toastMsg.type === 'success' && (
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toastMsg.type === 'warn' && (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {toastMsg.type === 'error' && (
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {toastMsg.msg}
        </div>
      )}

      {/* Header */}
      <header className="as-header">
        <div>
          <p className="as-eyebrow">Administration</p>
          <h1 className="as-title">Paramètres du <em>Système</em></h1>
          <p className="as-sub">Configurez les options critiques de la plateforme.</p>
        </div>
      </header>

      <div className="as-layout">

        {/* System status card */}
        <div className="as-panel as-panel--status">
          <div className="as-panel-head">
            <div className="as-panel-icon as-panel-icon--green">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="as-panel-title">État du système</h2>
          </div>
          <div className="as-status-grid">
            <div className="as-status-row">
              <span className="as-status-label">Plateforme</span>
              <span className={`as-status-pill ${maintenanceMode ? 'as-pill--warn' : 'as-pill--green'}`}>
                <span className="as-pill-dot" />
                {maintenanceMode ? 'Maintenance' : 'En ligne'}
              </span>
            </div>
            <div className="as-status-row">
              <span className="as-status-label">Base de données</span>
              <span className="as-status-pill as-pill--green">
                <span className="as-pill-dot" />Connectée
              </span>
            </div>
            <div className="as-status-row">
              <span className="as-status-label">API</span>
              <span className="as-status-pill as-pill--green">
                <span className="as-pill-dot" />Opérationnelle
              </span>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="as-panel as-panel--danger">
          <div className="as-panel-head">
            <div className="as-panel-icon as-panel-icon--rose">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="as-panel-title">Zone de danger</h2>
          </div>
          <p className="as-danger-desc">
            Ces paramètres ont un impact direct sur la disponibilité de la plateforme. Agissez avec précaution.
          </p>

          {/* Maintenance toggle row */}
          <div className={`as-setting-row ${maintenanceMode ? 'as-setting-row--active' : ''}`}>
            <div className="as-setting-left">
              <div className="as-setting-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="as-setting-name">Mode Maintenance</span>
                <p className="as-setting-desc">
                  Redirige tous les utilisateurs non-admins vers une page de maintenance dédiée.
                </p>
              </div>
            </div>

            <div className="as-toggle-wrap">
              {maintenanceMode && (
                <span className="as-toggle-label">Actif</span>
              )}
              <button
                className={`as-toggle ${maintenanceMode ? 'as-toggle--on' : ''} ${toggling ? 'as-toggle--loading' : ''}`}
                onClick={handleToggleMaintenance}
                disabled={toggling}
                aria-label="Basculer le mode maintenance"
              >
                <span className="as-toggle-thumb">
                  {toggling && <span className="as-toggle-spinner" />}
                </span>
              </button>
            </div>
          </div>

          {maintenanceMode && (
            <div className="as-maintenance-warning">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Le site est actuellement inaccessible aux utilisateurs non-admins. Désactivez le mode maintenance dès que possible.
            </div>
          )}

          {!maintenanceMode && (
            <p className="as-note">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              L'activation déconnecte virtuellement tous les utilisateurs non-admins en cours de session.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@1,700&display=swap');

  :root {
    --as-ink:     #111117;
    --as-ink-2:   #52525b;
    --as-ink-3:   #a1a1aa;
    --as-bg:      #f5f5f8;
    --as-card:    #ffffff;
    --as-border:  rgba(0,0,0,0.07);
    --as-rose:    #e11d48;
    --as-rose-l:  #fff1f2;
    --as-rose-d:  #be123c;
    --as-green:   #059669;
    --as-green-l: #d1fae5;
    --as-amber:   #f59e0b;
    --as-amber-l: #fffbeb;
    --as-r:       18px;
    --as-ease:    cubic-bezier(0.22,1,0.36,1);
    --as-font:    'Sora', system-ui, sans-serif;
    --as-serif:   'Lora', Georgia, serif;
  }

  .as-root {
    font-family: var(--as-font);
    color: var(--as-ink);
    padding: 36px 40px 64px;
    max-width: 860px;
    animation: as-fade .35s ease both;
    position: relative;
  }
  @keyframes as-fade { from { opacity:0 } to { opacity:1 } }

  /* Toast */
  .as-toast {
    position: fixed;
    bottom: 28px; right: 28px;
    display: flex; align-items: center; gap: 10px;
    padding: 13px 20px;
    border-radius: 14px;
    font-size: .85rem; font-weight: 600;
    box-shadow: 0 8px 28px rgba(0,0,0,.14);
    z-index: 9999;
    animation: as-toast-in .35s var(--as-ease) both;
    max-width: 320px;
  }
  @keyframes as-toast-in {
    from { opacity:0; transform:translateY(12px) }
    to   { opacity:1; transform:translateY(0) }
  }
  .as-toast--success { background: var(--as-green-l); color: var(--as-green); border: 1px solid rgba(5,150,105,.2); }
  .as-toast--warn    { background: var(--as-amber-l);  color: #92400e; border: 1px solid rgba(245,158,11,.25); }
  .as-toast--error   { background: var(--as-rose-l);   color: var(--as-rose-d); border: 1px solid rgba(225,29,72,.2); }

  /* Header */
  .as-header {
    margin-bottom: 36px;
  }
  .as-eyebrow {
    font-size: .68rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--as-rose); margin: 0 0 8px;
  }
  .as-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700; letter-spacing: -.02em;
    margin: 0 0 4px; line-height: 1.15;
  }
  .as-title em { font-family: var(--as-serif); font-style: italic; color: var(--as-rose); }
  .as-sub { font-size: .82rem; color: var(--as-ink-2); margin: 0; }

  /* Layout */
  .as-layout { display: flex; flex-direction: column; gap: 20px; }

  /* Panel */
  .as-panel {
    background: var(--as-card);
    border-radius: var(--as-r);
    padding: 28px;
    border: 1.5px solid var(--as-border);
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .as-panel--danger {
    border-color: rgba(225,29,72,.15);
  }
  .as-panel-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 22px;
  }
  .as-panel-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .as-panel-icon--green { background: var(--as-green-l); color: var(--as-green); }
  .as-panel-icon--rose  { background: var(--as-rose-l);  color: var(--as-rose); }
  .as-panel-title {
    font-size: .95rem; font-weight: 700; margin: 0; letter-spacing: -.01em;
  }

  /* Status grid */
  .as-status-grid { display: flex; flex-direction: column; gap: 10px; }
  .as-status-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 14px;
    background: var(--as-bg);
    border-radius: 11px;
  }
  .as-status-label { font-size: .82rem; font-weight: 600; color: var(--as-ink-2); }
  .as-status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .72rem; font-weight: 700;
    padding: 4px 12px; border-radius: 100px;
  }
  .as-pill--green { background: var(--as-green-l); color: var(--as-green); }
  .as-pill--warn  { background: var(--as-amber-l); color: #92400e; }
  .as-pill-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor; flex-shrink: 0;
    animation: as-blink 2s ease-in-out infinite;
  }
  @keyframes as-blink {
    0%, 100% { opacity: 1 }
    50%       { opacity: .4 }
  }

  /* Danger desc */
  .as-danger-desc {
    font-size: .82rem; color: var(--as-ink-2);
    line-height: 1.6; margin: 0 0 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--as-border);
  }

  /* Setting row */
  .as-setting-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 20px; padding: 18px 20px;
    border-radius: 14px;
    border: 1.5px solid var(--as-border);
    background: var(--as-bg);
    transition: border-color .2s, background .2s;
    margin-bottom: 14px;
  }
  .as-setting-row--active {
    border-color: rgba(245,158,11,.4);
    background: linear-gradient(135deg, #fffdf5 0%, #f5f5f8 100%);
  }
  .as-setting-left {
    display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 0;
  }
  .as-setting-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--as-rose-l); color: var(--as-rose);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }
  .as-setting-name {
    display: block;
    font-size: .88rem; font-weight: 700; color: var(--as-ink);
    margin-bottom: 4px;
  }
  .as-setting-desc {
    font-size: .75rem; color: var(--as-ink-2); margin: 0; line-height: 1.5;
  }

  /* Toggle */
  .as-toggle-wrap {
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .as-toggle-label {
    font-size: .72rem; font-weight: 700;
    color: var(--as-amber); letter-spacing: .04em; text-transform: uppercase;
  }
  .as-toggle {
    position: relative;
    width: 52px; height: 28px;
    border-radius: 100px;
    border: none; cursor: pointer;
    background: #d4d4d8;
    transition: background .25s var(--as-ease);
    flex-shrink: 0;
  }
  .as-toggle--on { background: var(--as-amber); }
  .as-toggle--loading { opacity: .75; cursor: not-allowed; }
  .as-toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.18);
    transition: transform .25s var(--as-ease);
    display: flex; align-items: center; justify-content: center;
  }
  .as-toggle--on .as-toggle-thumb { transform: translateX(24px); }
  .as-toggle-spinner {
    width: 12px; height: 12px;
    border: 2px solid rgba(245,158,11,.3);
    border-top-color: var(--as-amber);
    border-radius: 50%;
    display: block;
    animation: as-spin .7s linear infinite;
  }
  @keyframes as-spin { to { transform: rotate(360deg) } }

  /* Maintenance warning */
  .as-maintenance-warning {
    display: flex; align-items: flex-start; gap: 10px;
    background: var(--as-amber-l);
    border: 1.5px solid rgba(245,158,11,.3);
    border-radius: 12px;
    padding: 14px 16px;
    font-size: .8rem; color: #92400e; line-height: 1.55;
    margin-bottom: 14px;
  }
  .as-maintenance-warning svg { flex-shrink: 0; margin-top: 1px; }

  /* Note */
  .as-note {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: .75rem; color: var(--as-ink-3);
    line-height: 1.55; margin: 0;
  }
  .as-note svg { flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 640px) {
    .as-root { padding: 22px 16px 48px; }
    .as-setting-row { flex-direction: column; align-items: flex-start; }
    .as-toggle-wrap { width: 100%; justify-content: space-between; }
  }
`;