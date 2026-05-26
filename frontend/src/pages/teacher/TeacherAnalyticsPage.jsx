import { useState, useEffect } from 'react';
import { getTeacherStats, getTeacherCourses } from '../../api/teacherApi';

export default function TeacherAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [coursesData, setCoursesData] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          getTeacherStats(),
          getTeacherCourses()
        ]);
        
        setData(statsRes.data);
        
        // Process teacher courses
        const courses = coursesRes.data;
        const statusCount = { PUBLIE: 0, BROUILLON: 0, ARCHIVE: 0 };
        courses.forEach(c => {
          if (statusCount[c.statut] !== undefined) statusCount[c.statut]++;
        });
        
        setCoursesData({
          total: courses.length,
          ...statusCount
        });

      } catch (err) {
        console.error("Erreur lors de la récupération des stats", err);
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

  const stats = data || {};
  const cData = coursesData || { total: 0, PUBLIE: 0, BROUILLON: 0 };
  const getPct = (val, tot) => tot > 0 ? Math.round((val / tot) * 100) : 0;

  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonthIdx = new Date().getMonth();
  const displayMonths = [];
  for (let i = 11; i >= 0; i--) {
    let idx = (currentMonthIdx - i + 12) % 12;
    displayMonths.push(months[idx]);
  }

  const monthlyEnrollments = stats.monthlyEnrollments || stats.monthlyRevenues || Array(12).fill(0);
  const maxEnrollments = Math.max(...monthlyEnrollments, 10);

  return (
    <div className="aa-root">
      <style>{css}</style>

      <header className="aa-header">
        <p className="aa-eyebrow">Performances</p>
        <h1 className="aa-title">Vos <em>Statistiques</em></h1>
        <p className="aa-sub">Analysez vos performances, vos cours et l'engagement de vos étudiants.</p>
      </header>

      {/* KPIs */}
      <div className="aa-kpis">
        <div className="aa-kpi">
          <div className="aa-kpi-icon aa-kpi-icon--blue">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="aa-kpi-info">
            <h3>Total Étudiants</h3>
            <strong>{stats.totalStudents || 0}</strong>
          </div>
        </div>
        
        <div className="aa-kpi">
          <div className="aa-kpi-icon aa-kpi-icon--purple">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
          <div className="aa-kpi-info">
            <h3>Cours Populaire</h3>
            <strong style={{ fontSize: '1.2rem', marginTop: '10px' }}>{stats.topCourse || "N/A"}</strong>
          </div>
        </div>
      </div>

      <div className="aa-grid">
        
        {/* Chart */}
        <div className="aa-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="aa-panel-header">
            <h2>Évolution des Inscriptions</h2>
            <span className="aa-badge">Derniers 12 mois</span>
          </div>
          
          <div className="aa-chart-container">
            <div className="aa-chart-grid"></div>
            <div className="aa-chart-grid-mid"></div>
            
            {monthlyEnrollments.map((h, i) => {
              const heightPercentage = Math.max((h / maxEnrollments) * 100, 2); 
              const isHovered = hoverIndex === i;
              return (
                <div 
                  key={i}
                  className="aa-chart-bar-wrap"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div 
                    className={`aa-chart-bar ${isHovered ? 'aa-chart-bar--hover' : ''}`}
                    style={{ height: `${heightPercentage}%` }}
                  >
                    {isHovered && (
                      <div className="aa-tooltip">
                        {h} inscrits
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="aa-chart-labels">
            {displayMonths.map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        {/* Courses Breakdown */}
        <div className="aa-panel">
          <h2>Statut de vos cours</h2>
          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Publiés</span>
              <span>{cData.PUBLIE} ({getPct(cData.PUBLIE, cData.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(cData.PUBLIE, cData.total)}%`, background: '#10b981' }} />
            </div>
          </div>

          <div className="aa-bar-group">
            <div className="aa-bar-label">
              <span>Brouillons</span>
              <span>{cData.BROUILLON} ({getPct(cData.BROUILLON, cData.total)}%)</span>
            </div>
            <div className="aa-bar-track">
              <div className="aa-bar-fill" style={{ width: `${getPct(cData.BROUILLON, cData.total)}%`, background: '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* Engagement Donut */}
        <div className="aa-panel aa-donut-panel">
          <h2>Taux d'Engagement</h2>
          <div className="aa-donut-wrap">
            <svg width="180" height="180" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <path fill="none" stroke="#f1f5f9" strokeWidth="4" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                fill="none" stroke="url(#donut-gradient)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${stats.engagement || 0}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
              />
              <defs>
                <linearGradient id="donut-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
            </svg>
            <div className="aa-donut-value">
              {stats.engagement || 0}%
            </div>
          </div>
          <p className="aa-donut-desc">
            L'engagement moyen basé sur la complétion des leçons.
          </p>
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
    display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
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
  .aa-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .aa-panel h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
  .aa-panel-header h2 { margin: 0; }
  
  .aa-badge { background: #f4f4f5; border: 1px solid #e4e4e7; color: #3f3f46; font-size: .75rem; font-weight: 600; padding: 4px 10px; border-radius: 100px; }

  .aa-bar-group { margin-bottom: 20px; margin-top: 24px; }
  .aa-bar-group:last-child { margin-bottom: 0; }
  .aa-bar-label { display: flex; justify-content: space-between; font-size: .85rem; font-weight: 600; color: #3f3f46; margin-bottom: 8px; }
  .aa-bar-track { height: 10px; background: #f4f4f5; border-radius: 10px; overflow: hidden; }
  .aa-bar-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }

  /* Chart */
  .aa-chart-container {
    height: 250px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
    position: relative; padding: 0 10px; border-bottom: 2px solid #f1f5f9; margin-bottom: 16px;
  }
  .aa-chart-grid { position: absolute; top: 0; left: 0; right: 0; border-top: 1px solid #f1f5f9; }
  .aa-chart-grid-mid { position: absolute; top: 50%; left: 0; right: 0; border-top: 1px solid #f1f5f9; }
  
  .aa-chart-bar-wrap { flex: 1; height: 100%; position: relative; display: flex; align-items: flex-end; z-index: 1; }
  .aa-chart-bar {
    width: 100%; border-radius: 6px 6px 0 0;
    background: linear-gradient(180deg, #93c5fd 0%, #3b82f6 100%);
    transition: all 0.3s ease; position: relative;
  }
  .aa-chart-bar--hover {
    background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
    box-shadow: 0 -4px 14px rgba(59,130,246,.4);
  }
  
  .aa-tooltip {
    position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
    background: #111117; color: #fff; font-size: .75rem; font-weight: 600;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap; pointer-events: none;
  }

  .aa-chart-labels {
    display: flex; justify-content: space-between; padding: 0 10px;
    font-size: .75rem; font-weight: 600; color: #71717a;
  }
  .aa-chart-labels span { flex: 1; text-align: center; }

  /* Donut */
  .aa-donut-panel { display: flex; flex-direction: column; align-items: center; text-align: center; }
  .aa-donut-wrap { position: relative; display: inline-flex; justify-content: center; align-items: center; margin: 20px 0; }
  .aa-donut-value { position: absolute; font-size: 2.2rem; font-weight: 800; color: #4c1d95; }
  .aa-donut-desc { font-size: .85rem; color: #71717a; line-height: 1.5; margin: 0; padding: 0 10px; }

  @media (max-width: 768px) {
    .aa-grid { grid-template-columns: 1fr; }
    .aa-kpis { grid-template-columns: 1fr; }
  }
`;
