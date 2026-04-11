import { useAuth } from '../../context/AuthContext';

export default function DashboardOverview() {
  const { user } = useAuth();

  return (
    <div className="container-fluid p-0">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h3 fw-bold mb-1">
            Rebonjour, <span className="gradient-text">{user?.prenom}</span> 👋
          </h1>
          <p className="text-secondary mb-0">Voici ce qui se passe dans votre apprentissage aujourd'hui.</p>
        </div>
        <div className="d-none d-sm-block">
          <button className="btn btn-primary rounded-pill px-4 py-2 hover-lift fw-medium shadow-sm">
            Explorer les cours
          </button>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="glass-card rounded-4 p-4 hover-lift h-100 d-flex flex-column border-0 bg-white">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 me-3">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h6 className="text-secondary fw-semibold m-0">Cours en cours</h6>
            </div>
            <h2 className="display-5 fw-bold m-0 mt-auto text-dark">3</h2>
          </div>
        </div>
        
        <div className="col-12 col-md-4">
          <div className="glass-card rounded-4 p-4 hover-lift h-100 d-flex flex-column border-0 bg-white">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 text-success p-2 rounded-3 me-3">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h6 className="text-secondary fw-semibold m-0">Cours terminés</h6>
            </div>
            <h2 className="display-5 fw-bold m-0 mt-auto text-dark">5</h2>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-card rounded-4 p-4 flex-column hover-lift h-100 border-0 bg-gradient-primary d-flex align-items-start position-relative overflow-hidden">
             {/* Decorative circle */}
            <div className="position-absolute bg-white rounded-circle opacity-10" style={{ width: '150px', height: '150px', top: '-30px', right: '-30px' }}></div>
            
            <h6 className="text-white fw-semibold mb-3">Taux d'assiduité</h6>
            <h2 className="display-5 fw-bold text-white mb-2 z-1">94%</h2>
            <div className="w-100 bg-white bg-opacity-25 rounded-pill h-25 mt-auto z-1" style={{ height: '6px' }}>
              <div className="bg-white rounded-pill h-100" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Upcomings */}
      <div className="row g-4">
        {/* Left Col: Recents */}
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold m-0 text-dark">Poursuivre mon apprentissage</h5>
            <button className="btn btn-link text-decoration-none fw-medium p-0">Tout voir</button>
          </div>
          
          <div className="d-flex flex-column gap-3">
            {/* Course Card 1 */}
            <div className="glass-card bg-white p-3 rounded-4 d-flex align-items-center hover-lift border-0 shadow-sm">
              <div className="rounded-3 bg-light overflow-hidden me-3" style={{ width: '100px', height: '70px' }}>
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80" alt="Code" className="w-100 h-100 object-fit-cover" />
              </div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1 text-dark">Introduction à React.js</h6>
                <p className="text-secondary small mb-2">Avancement : Module 4/10</p>
                <div className="progress rounded-pill bg-light" style={{ height: '6px' }}>
                  <div className="progress-bar bg-primary rounded-pill" style={{ width: '40%' }}></div>
                </div>
              </div>
              <button className="btn btn-outline-primary rounded-circle ms-4 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>
              </button>
            </div>

            {/* Course Card 2 */}
            <div className="glass-card bg-white p-3 rounded-4 d-flex align-items-center hover-lift border-0 shadow-sm">
              <div className="rounded-3 bg-light overflow-hidden me-3" style={{ width: '100px', height: '70px' }}>
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=300&q=80" alt="Design" className="w-100 h-100 object-fit-cover" />
              </div>
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1 text-dark">Spring Boot pour les Débutants</h6>
                <p className="text-secondary small mb-2">Avancement : Module 8/12</p>
                <div className="progress rounded-pill bg-light" style={{ height: '6px' }}>
                  <div className="progress-bar bg-primary rounded-pill" style={{ width: '75%' }}></div>
                </div>
              </div>
              <button className="btn btn-outline-primary rounded-circle ms-4 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Timeline/Deadlines */}
        <div className="col-12 col-lg-4">
          <div className="bg-white rounded-4 p-4 border-0 shadow-sm h-100">
            <h5 className="fw-bold mb-4 text-dark">Prochainement</h5>
            <div className="position-relative border-start border-2 border-primary border-opacity-25 ms-2 ps-4 pb-4">
              <div className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 border-white bg-primary" style={{ width: '14px', height: '14px' }}></div>
              <p className="mb-1 fw-bold text-dark small">Quiz : Composants React</p>
              <p className="mb-0 text-secondary" style={{ fontSize: '13px' }}>Aujourd'hui, 23h59</p>
            </div>
            <div className="position-relative border-start border-2 border-warning border-opacity-25 ms-2 ps-4 pb-4">
              <div className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 border-white bg-warning" style={{ width: '14px', height: '14px' }}></div>
              <p className="mb-1 fw-bold text-dark small">Rendu Projet Java</p>
              <p className="mb-0 text-secondary" style={{ fontSize: '13px' }}>Demain, 12h00</p>
            </div>
            <div className="position-relative ms-2 ps-4">
              <div className="position-absolute top-0 start-0 translate-middle rounded-circle border border-2 border-white bg-secondary" style={{ width: '14px', height: '14px' }}></div>
              <p className="mb-1 fw-bold text-dark small">Visioconférence Groupe</p>
              <p className="mb-0 text-secondary" style={{ fontSize: '13px' }}>Vendredi, 18h00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
