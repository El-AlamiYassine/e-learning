import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../api/adminApi';

const ROLE_META = {
  ROLE_ADMIN:   { label: 'Admin',      bg: '#fff1f2', color: '#e11d48', icon: '⚡' },
  ROLE_TEACHER: { label: 'Enseignant', bg: '#f5f3ff', color: '#7c3aed', icon: '🎓' },
  ROLE_STUDENT: { label: 'Étudiant',   bg: '#eff6ff', color: '#2563eb', icon: '📖' },
};

const avatarColors = (letter) => {
  const palette = [
    ['#fef3c7','#92400e'], ['#ede9fe','#5b21b6'], ['#d1fae5','#065f46'],
    ['#fee2e2','#991b1b'], ['#e0f2fe','#0c4a6e'], ['#fce7f3','#9d174d'],
    ['#f3f4f6','#374151'], ['#ecfdf5','#064e3b'],
  ];
  const idx = (letter?.toUpperCase().charCodeAt(0) || 65) % palette.length;
  return palette[idx];
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      setDeletingId(id);
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const roles = ['ALL', 'ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_STUDENT'];
  const roleCounts = {
    ALL: users.length,
    ROLE_ADMIN:   users.filter(u => u.role === 'ROLE_ADMIN').length,
    ROLE_TEACHER: users.filter(u => u.role === 'ROLE_TEACHER').length,
    ROLE_STUDENT: users.filter(u => u.role === 'ROLE_STUDENT').length,
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchSearch = `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) {
    return (
      <div className="mu-loading">
        <div className="mu-loader" />
        <span>Chargement des utilisateurs…</span>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap');
          .mu-loading { min-height:50vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; font-family:'Sora',sans-serif; color:#71717a; font-size:.875rem; }
          .mu-loader { width:32px; height:32px; border:3px solid #fecdd3; border-top-color:#e11d48; border-radius:50%; animation:mu-spin .8s linear infinite; }
          @keyframes mu-spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="mu-root">
      <style>{css}</style>

      {/* Header */}
      <header className="mu-header">
        <div>
          <p className="mu-eyebrow">Administration</p>
          <h1 className="mu-title">Gestion des <em>Utilisateurs</em></h1>
          <p className="mu-sub">{users.length} compte{users.length !== 1 ? 's' : ''} enregistré{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="mu-header-actions">
          <div className="mu-search">
            <svg className="mu-search-icon" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="mu-search-input"
              placeholder="Nom, email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="mu-search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
          <Link to="/admin/users/add" className="mu-add-btn">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter
          </Link>
        </div>
      </header>

      {error && (
        <div className="mu-error">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Role filter tabs */}
      <div className="mu-tabs">
        {roles.map(role => {
          const meta = ROLE_META[role];
          return (
            <button
              key={role}
              className={`mu-tab ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
              style={roleFilter === role && meta ? { background: meta.bg, color: meta.color, borderColor: meta.color + '44' } : {}}
            >
              {meta ? `${meta.icon} ${meta.label}` : 'Tous'}
              <span className="mu-tab-count">{roleCounts[role]}</span>
            </button>
          );
        })}
        {filtered.length !== users.length && roleFilter === 'ALL' && (
          <span className="mu-filter-hint">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mu-empty">
          <div className="mu-empty-icon">
            <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3>Aucun utilisateur trouvé</h3>
          <p>{search ? `Aucun résultat pour "${search}".` : 'Aucun compte dans cette catégorie.'}</p>
          {search && <button className="mu-reset-btn" onClick={() => setSearch('')}>Effacer</button>}
        </div>
      ) : (
        <div className="mu-list">
          {filtered.map((user, i) => {
            const initials = `${user.nom?.charAt(0) ?? ''}${user.prenom?.charAt(0) ?? ''}`.toUpperCase();
            const [bgColor, textColor] = avatarColors(user.nom?.charAt(0));
            const role = ROLE_META[user.role] || { label: user.role, bg: '#f4f4f5', color: '#52525b' };
            const isDeleting = deletingId === user.id;

            return (
              <div
                key={user.id}
                className={`mu-card ${isDeleting ? 'mu-card--deleting' : ''}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Avatar */}
                <div className="mu-avatar" style={{ background: bgColor, color: textColor }}>
                  {initials}
                </div>

                {/* Name + email */}
                <div className="mu-user-info">
                  <span className="mu-user-name">{user.nom} {user.prenom}</span>
                  <a href={`mailto:${user.email}`} className="mu-user-email">{user.email}</a>
                </div>

                {/* Role badge */}
                <span
                  className="mu-role-badge"
                  style={{ background: role.bg, color: role.color }}
                >
                  {role.icon && <span>{role.icon}</span>}
                  {role.label}
                </span>

                {/* Status */}
                <span className={`mu-status ${user.actif ? 'mu-status--active' : 'mu-status--inactive'}`}>
                  <span className="mu-status-dot" />
                  {user.actif ? 'Actif' : 'Inactif'}
                </span>

                {/* Delete */}
                <button
                  className="mu-delete-btn"
                  onClick={() => handleDelete(user.id)}
                  disabled={isDeleting}
                  title="Supprimer l'utilisateur"
                >
                  {isDeleting ? (
                    <span className="mu-spinner" />
                  ) : (
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
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
    --mu-ink:    #111117;
    --mu-ink-2:  #52525b;
    --mu-ink-3:  #a1a1aa;
    --mu-bg:     #f5f5f8;
    --mu-card:   #ffffff;
    --mu-border: rgba(0,0,0,0.07);
    --mu-rose:   #e11d48;
    --mu-rose-l: #fff1f2;
    --mu-rose-d: #be123c;
    --mu-green:  #059669;
    --mu-green-l:#d1fae5;
    --mu-r:      15px;
    --mu-ease:   cubic-bezier(0.22,1,0.36,1);
    --mu-font:   'Sora', system-ui, sans-serif;
    --mu-serif:  'Lora', Georgia, serif;
  }

  .mu-root {
    font-family: var(--mu-font);
    color: var(--mu-ink);
    padding: 36px 40px 64px;
    max-width: 1000px;
    animation: mu-fade .35s ease both;
  }
  @keyframes mu-fade { from { opacity:0 } to { opacity:1 } }
  @keyframes mu-up {
    from { opacity:0; transform:translateY(12px) }
    to   { opacity:1; transform:translateY(0) }
  }

  /* Header */
  .mu-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 28px;
  }
  .mu-eyebrow {
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--mu-rose);
    margin: 0 0 8px;
  }
  .mu-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 700;
    letter-spacing: -.02em;
    margin: 0 0 4px;
    line-height: 1.15;
  }
  .mu-title em { font-family: var(--mu-serif); font-style: italic; color: var(--mu-rose); }
  .mu-sub { font-size: .82rem; color: var(--mu-ink-2); margin: 0; }

  .mu-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* Search */
  .mu-search {
    display: flex;
    align-items: center;
    gap: 9px;
    background: var(--mu-card);
    border: 1.5px solid var(--mu-border);
    border-radius: 100px;
    padding: 9px 16px;
    width: 240px;
    transition: border-color .2s, box-shadow .2s;
    box-shadow: 0 2px 8px rgba(0,0,0,.04);
  }
  .mu-search:focus-within {
    border-color: var(--mu-rose);
    box-shadow: 0 0 0 3px rgba(225,29,72,.1);
  }
  .mu-search-icon { color: var(--mu-ink-3); flex-shrink: 0; }
  .mu-search-input {
    flex: 1; border: none; outline: none;
    font-family: var(--mu-font); font-size: .85rem;
    color: var(--mu-ink); background: transparent; min-width: 0;
  }
  .mu-search-input::placeholder { color: var(--mu-ink-3); }
  .mu-search-clear {
    background: none; border: none; cursor: pointer;
    color: var(--mu-ink-3); font-size: .7rem; padding: 0; line-height: 1;
    transition: color .2s;
  }
  .mu-search-clear:hover { color: var(--mu-ink); }

  /* Add btn */
  .mu-add-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--mu-rose);
    color: #fff;
    font-family: var(--mu-font);
    font-size: .82rem;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 100px;
    text-decoration: none;
    border: none;
    box-shadow: 0 4px 14px rgba(225,29,72,.3);
    transition: background .2s, transform .2s var(--mu-ease), box-shadow .2s;
    white-space: nowrap;
  }
  .mu-add-btn:hover {
    background: var(--mu-rose-d);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(225,29,72,.4);
  }

  /* Error */
  .mu-error {
    display: flex; align-items: center; gap: 10px;
    background: var(--mu-rose-l);
    border: 1px solid rgba(225,29,72,.2);
    color: var(--mu-rose-d);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: .85rem;
    margin-bottom: 20px;
  }

  /* Tabs */
  .mu-tabs {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .mu-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 16px;
    border-radius: 100px;
    border: 1.5px solid var(--mu-border);
    background: var(--mu-card);
    font-family: var(--mu-font);
    font-size: .78rem;
    font-weight: 600;
    color: var(--mu-ink-2);
    cursor: pointer;
    transition: all .2s var(--mu-ease);
    box-shadow: 0 1px 4px rgba(0,0,0,.04);
  }
  .mu-tab:hover:not(.active) { border-color: var(--mu-rose); color: var(--mu-rose); }
  .mu-tab.active {
    box-shadow: 0 4px 14px rgba(0,0,0,.08);
    font-weight: 700;
  }
  .mu-tab-count {
    background: rgba(0,0,0,.07);
    border-radius: 100px;
    padding: 1px 7px;
    font-size: .65rem;
    font-weight: 700;
  }
  .mu-tab.active .mu-tab-count { background: rgba(0,0,0,.1); }
  .mu-filter-hint { font-size: .75rem; color: var(--mu-ink-3); margin-left: 6px; font-weight: 500; }

  /* List */
  .mu-list { display: flex; flex-direction: column; gap: 9px; }

  .mu-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--mu-card);
    border-radius: var(--mu-r);
    padding: 13px 18px;
    border: 1.5px solid var(--mu-border);
    box-shadow: 0 2px 6px rgba(0,0,0,.03);
    animation: mu-up .4s var(--mu-ease) both;
    transition: border-color .2s, box-shadow .2s, transform .25s var(--mu-ease), opacity .3s;
  }
  .mu-card:hover {
    border-color: rgba(225,29,72,.2);
    box-shadow: 0 6px 20px rgba(0,0,0,.07);
    transform: translateX(4px);
  }
  .mu-card--deleting { opacity: .35; pointer-events: none; transform: scale(.98); }

  /* Avatar */
  .mu-avatar {
    width: 38px; height: 38px;
    border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .02em;
    flex-shrink: 0;
    transition: transform .25s var(--mu-ease);
  }
  .mu-card:hover .mu-avatar { transform: scale(1.1) rotate(-4deg); }

  /* User info */
  .mu-user-info {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column; gap: 2px;
  }
  .mu-user-name {
    font-size: .88rem; font-weight: 700; color: var(--mu-ink);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mu-user-email {
    font-size: .72rem; color: var(--mu-ink-3);
    text-decoration: none; transition: color .2s;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .mu-user-email:hover { color: var(--mu-rose); }

  /* Role badge */
  .mu-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .71rem;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 100px;
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* Status */
  .mu-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .7rem;
    font-weight: 700;
    padding: 4px 11px;
    border-radius: 100px;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .mu-status--active   { background: var(--mu-green-l); color: var(--mu-green); }
  .mu-status--inactive { background: #f4f4f5; color: #71717a; }
  .mu-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%; background: currentColor; flex-shrink: 0;
  }

  /* Delete */
  .mu-delete-btn {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--mu-border);
    background: var(--mu-bg);
    color: var(--mu-ink-3);
    cursor: pointer;
    transition: all .2s var(--mu-ease);
    flex-shrink: 0;
  }
  .mu-delete-btn:hover:not(:disabled) {
    border-color: var(--mu-rose);
    color: var(--mu-rose);
    background: var(--mu-rose-l);
    transform: translateY(-1px);
  }
  .mu-delete-btn:disabled { opacity: .5; cursor: not-allowed; }

  .mu-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(225,29,72,.2);
    border-top-color: var(--mu-rose);
    border-radius: 50%;
    animation: mu-spin .7s linear infinite;
    display: block;
  }
  @keyframes mu-spin { to { transform: rotate(360deg) } }

  /* Empty */
  .mu-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px; text-align: center; gap: 12px;
    background: var(--mu-card);
    border-radius: var(--mu-r);
    border: 1.5px dashed var(--mu-border);
  }
  .mu-empty-icon {
    width: 62px; height: 62px;
    background: var(--mu-rose-l); color: var(--mu-rose);
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .mu-empty h3 { font-size: 1.05rem; font-weight: 700; margin: 0; letter-spacing: -.01em; }
  .mu-empty p  { font-size: .85rem; color: var(--mu-ink-2); margin: 0; max-width: 280px; line-height: 1.6; }
  .mu-reset-btn {
    background: var(--mu-rose); color: #fff; border: none;
    border-radius: 100px; padding: 8px 20px;
    font-family: var(--mu-font); font-size: .8rem; font-weight: 600;
    cursor: pointer; transition: background .2s; margin-top: 4px;
  }
  .mu-reset-btn:hover { background: var(--mu-rose-d); }

  @media (max-width: 700px) {
    .mu-root { padding: 22px 16px 48px; }
    .mu-header { flex-direction: column; align-items: stretch; }
    .mu-header-actions { flex-direction: column; }
    .mu-search { width: 100%; }
    .mu-add-btn { justify-content: center; }
    .mu-status { display: none; }
  }
`;