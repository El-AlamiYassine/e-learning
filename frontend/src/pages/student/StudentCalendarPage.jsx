import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function StudentCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getCalendarEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Impossible de charger le calendrier.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to get days in month
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = (getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) + 6) % 7; // Adjust for Monday start

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const hasEventOnDay = (day) => {
    return events.some(event => {
      const d = new Date(event.eventDate);
      return d.getDate() === day && 
             d.getMonth() === currentDate.getMonth() && 
             d.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Mon <span className="gradient-text">Calendrier</span></h2>
          <p className="text-secondary mb-0">Suivez vos sessions live et vos dates d'échéance.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Calendar Grid */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 border-0 shadow-sm h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 text-capitalize text-dark">{monthName}</h5>
              <div className="btn-group shadow-sm rounded-pill overflow-hidden border">
                <button onClick={prevMonth} className="btn btn-light btn-sm px-3">
                   <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
                </button>
                <button onClick={resetToToday} className="btn btn-light btn-sm px-3 small fw-bold">Aujourd'hui</button>
                <button onClick={nextMonth} className="btn btn-light btn-sm px-3">
                   <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
                </button>
              </div>
            </div>

            <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'rgba(0,0,0,0.05)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="bg-light p-3 fw-bold text-secondary small text-center">{day}</div>
              ))}
              
              {/* Empty days before first day of month */}
              {[...Array(firstDay)].map((_, i) => (
                <div key={`empty-${i}`} className="bg-white p-4 opacity-25"></div>
              ))}

              {/* Actual days */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const hasEvent = hasEventOnDay(day);
                const isToday = day === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() && 
                              currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div 
                    key={day} 
                    className={`bg-white p-3 p-md-4 text-center position-relative transition-all hover-bg-light cursor-pointer ${isToday ? 'fw-bold' : ''}`}
                    style={{ minHeight: '80px' }}
                  >
                    <span className={isToday ? 'bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center' : ''} 
                          style={isToday ? { width: '28px', height: '28px' } : {}}>
                      {day}
                    </span>
                    {hasEvent && (
                      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
                        <div className="bg-primary rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 border-0 shadow-sm h-100">
            <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
               <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               Événements à venir
            </h5>
            
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '500px' }}>
              {Array.isArray(events) && events.length > 0 ? (
                [...events]
                  .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                  .filter(e => new Date(e.eventDate) >= new Date().setHours(0,0,0,0))
                  .map(event => (
                    <div key={event.id} className="p-3 rounded-4 border-0 bg-light hover-lift transition-all">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className={`badge rounded-pill small px-2 py-1 ${
                          event.type === 'LIVE' ? 'bg-danger-subtle text-danger border-danger-subtle' :
                          event.type === 'DEADLINE' ? 'bg-warning-subtle text-warning border-warning-subtle' :
                          'bg-primary-subtle text-primary border-primary-subtle'
                        } border`}>
                          {event.type}
                        </span>
                        <span className="small text-secondary fw-medium">
                          {new Date(event.eventDate).toLocaleTimeString('fr-FR', { hour: '2h', minute: '2h' })}
                        </span>
                      </div>
                      <h6 className="fw-bold mb-1 text-dark">{event.title}</h6>
                      <p className="text-secondary small mb-2">{event.courseTitle}</p>
                      <div className="d-flex align-items-center gap-1 text-primary small fw-bold">
                         <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         {new Date(event.eventDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-5 text-muted">
                  <p className="small mb-0">Aucun événement prévu prochainement.</p>
                </div>
              )}
            </div>
            
            <Link to="/student/dashboard" className="btn btn-link text-primary text-decoration-none mt-4 p-0 fw-bold small">
              Retour au tableau de bord →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
