import { useState, useEffect } from 'react';
import { getAllUsers, getAllCourses } from '../../api/adminApi';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          getAllUsers(),
          getAllCourses()
        ]);
        
        const users = usersRes.data;
        const courses = coursesRes.data;

        // Process users
        const roleCount = { ADMIN: 0, TEACHER: 0, STUDENT: 0 };
        users.forEach(u => {
          const r = u.role?.replace('ROLE_', '');
          if (roleCount[r] !== undefined) roleCount[r]++;
        });

        // Process courses
        const statusCount = { PUBLIE: 0, BROUILLON: 0, ARCHIVE: 0 };
        courses.forEach(c => {
          if (statusCount[c.statut] !== undefined) statusCount[c.statut]++;
        });

        setData({
          users: { total: users.length, ...roleCount },
          courses: { total: courses.length, ...statusCount }
        });

      } catch (err) {
        console.error('Erreur analytiques', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="aa-loading">
        <div className="aa-loader" />
        <span>Chargement des statistiques…</span>
      </div>
    );
  }

  const { users, courses } = data || { users: {}, courses: {} };
  const getPct = (val, tot) => tot > 0 ? Math.round((val / tot) * 100) : 0;

  return (
    <div className="aa-root">
      <style>{css}</style>

      <header className="aa-header">
        <p className="aa-eyebrow">Rapports & Indicateurs</p>
        <h1 className="aa-title">Statistiques <em>Détaillées</em></h1>
        <p className="aa-sub">Analysez la répartition des utilisateurs et l'état des cours.</p>
      </header>

      {/* KPIs */}
      <div className="aa-kpis">
        <div className="aa-kpi">
          <div className="aa-kpi-icon aa-kpi-icon--blue">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div className="aa-kpi-info">
            <h3>Total Utilisateurs</h3>
            <strong>{users.total}</strong>
          </div>
        </div>
        <div className="aa-kpi">
          <div className="aa-kpi-icon aa-kpi-icon--purple">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div className="aa-kpi-info">
            <h3>Total des Cours</h3>
            <strong>{courses.total}</strong>
          </div>
        </div>
      </div>

      <div className="aa-grid">
        
        {/* Users Breakdown */}
        <div className="aa-panel">
          <h2>Répartition des rôles</h2>
          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Étudiants</span>
              <span>{users.STUDENT} ({getPct(users.STUDENT, users.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(users.STUDENT, users.total)}%`, background: '#3b82f6' }} />
            </div>
          </div>
          
          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Enseignants</span>
              <span>{users.TEACHER} ({getPct(users.TEACHER, users.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(users.TEACHER, users.total)}%`, background: '#8b5cf6' }} />
            </div>
          </div>

          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Administrateurs</span>
              <span>{users.ADMIN} ({getPct(users.ADMIN, users.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(users.ADMIN, users.total)}%`, background: '#ef4444' }} />
            </div>
          </div>
        </div>

        {/* Courses Breakdown */}
        <div className="aa-panel">
          <h2>Statut des cours</h2>
          
          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Publiés</span>
              <span>{courses.PUBLIE} ({getPct(courses.PUBLIE, courses.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(courses.PUBLIE, courses.total)}%`, background: '#10b981' }} />
            </div>
          </div>

          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>En attente (Brouillon)</span>
              <span>{courses.BROUILLON} ({getPct(courses.BROUILLON, courses.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(courses.BROUILLON, courses.total)}%`, background: '#f59e0b' }} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Lora:ital,wght@1,700&display=swap');

  .aa-root {
    font-family: 'Sora', sans-serif;
    color: #111117;
    padding: 36px 40px 64px;
    max-width: 1000px;
    animation: aa-fade .35s ease both;
  }
  @keyframes aa-fade { from { opacity:0 } to { opacity:1 } }

  .aa-loading { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; color: #71717a; font-size: .875rem; }
  .aa-loader { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: aa-spin .8s linear infinite; }
  @keyframes aa-spin { to { transform: rotate(360deg) } }

  .aa-header { margin-bottom: 36px; }
  .aa-eyebrow { font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #3b82f6; margin: 0 0 10px; }
  .aa-title { font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 700; letter-spacing: -.02em; margin: 0 0 6px; line-height: 1.15; }
  .aa-title em { font-family: 'Lora', serif; font-style: italic; color: #8b5cf6; }
  .aa-sub { font-size: .82rem; color: #52525b; margin: 0; }

  .aa-kpis { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
  .aa-kpi {
    background: #fff; border-radius: 18px; padding: 24px;
    border: 1.5px solid rgba(0,0,0,.06);
    box-shadow: 0 4px 14px rgba(0,0,0,.03);
    display: flex; align-items: center; gap: 20px;
  }
  .aa-kpi-icon {
    width: 60px; height: 60px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center; color: #fff;
  }
  .aa-kpi-icon--blue { background: linear-gradient(135deg, #60a5fa, #2563eb); }
  .aa-kpi-icon--purple { background: linear-gradient(135deg, #a78bfa, #7c3aed); }
  
  .aa-kpi-info h3 { margin: 0; font-size: .8rem; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: .05em; }
  .aa-kpi-info strong { display: block; font-size: 2rem; font-weight: 700; color: #18181b; margin-top: 4px; line-height: 1; }

  .aa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .aa-panel {
    background: #fff; border-radius: 18px; padding: 32px;
    border: 1.5px solid rgba(0,0,0,.06);
    box-shadow: 0 4px 14px rgba(0,0,0,.03);
  }
  .aa-panel h2 { font-size: 1.1rem; font-weight: 700; margin: 0 0 24px; }

  .aa-bar-group { margin-bottom: 20px; }
  .aa-bar-group:last-child { margin-bottom: 0; }
  .aa-bar-label { display: flex; justify-content: space-between; font-size: .85rem; font-weight: 600; color: #3f3f46; margin-bottom: 8px; }
  .aa-bar-track { height: 10px; background: #f4f4f5; border-radius: 10px; overflow: hidden; }
  .aa-bar-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }
`;
