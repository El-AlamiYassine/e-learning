export default function TeacherDashboardOverview() {
  return (
    <div>
      <h2 className="fw-bold mb-4">Vue d'ensemble Enseignant</h2>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Mes Cours</h5>
              <h2 className="mb-0 fw-bold">8</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Élèves inscrits</h5>
              <h2 className="mb-0 fw-bold">145</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="card-title text-muted fw-normal">Devoirs à corriger</h5>
              <h2 className="mb-0 fw-bold">12</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Mes derniers cours</h5>
          <p className="text-muted">Vous n'avez pas de cours récents.</p>
        </div>
      </div>
      <button className="btn btn-success p-3 fw-bold">
        + Créer un nouveau cours
      </button>
    </div>
  );
}
