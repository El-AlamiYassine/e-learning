export default function StudentCalendarPage() {
  const events = [
    { id: 1, title: 'Session Live React', date: 'Demain, 14:00', type: 'Live' },
    { id: 2, title: 'Date limite Quiz Node.js', date: 'Mardi, 23:59', type: 'Deadline' },
    { id: 3, title: 'Nouveau cours: Python', date: 'Mercredi, 09:00', type: 'Release' }
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">Mon Calendrier</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 bg-white" style={{ minHeight: '400px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Avril 2026</h5>
              <div className="btn-group shadow-sm rounded">
                <button className="btn btn-outline-secondary btn-sm">Précédent</button>
                <button className="btn btn-outline-secondary btn-sm">Aujourd'hui</button>
                <button className="btn btn-outline-secondary btn-sm">Suivant</button>
              </div>
            </div>
            {/* Simple representation of a grid calendar */}
            <div className="calendar-grid text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="fw-bold text-muted small pb-2">{day}</div>
              ))}
              {[...Array(30).keys()].map(i => (
                <div key={i} className={`p-3 rounded-3 ${i + 1 === 12 ? 'bg-primary text-white shadow' : 'bg-light'}`} style={{ cursor: 'pointer' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Événements à venir</h5>
            <div className="d-flex flex-column gap-3">
              {events.map(event => (
                <div key={event.id} className="p-3 rounded-3 border-start border-4 border-primary bg-light">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="fw-bold mb-1">{event.title}</h6>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill small">{event.type}</span>
                  </div>
                  <p className="text-muted small mb-0 d-flex align-items-center gap-1">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {event.date}
                  </p>
                </div>
              ))}
            </div>
            <button className="btn btn-link text-primary text-decoration-none mt-4 p-0 fw-medium">
              Voir tout l'agenda →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
