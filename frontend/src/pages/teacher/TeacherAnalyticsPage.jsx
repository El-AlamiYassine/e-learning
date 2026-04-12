export default function TeacherAnalyticsPage() {
  return (
    <div>
      <h2 className="fw-bold mb-4">Statistiques & Analyses</h2>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Revenus mensuels (€)</h5>
            {/* Visual placeholder for a chart */}
            <div className="d-flex align-items-end justify-content-between gap-2 px-2" style={{ height: '240px' }}>
              {[40, 60, 45, 90, 75, 100, 85, 120, 95, 110, 130, 150].map((h, i) => (
                <div key={i} className="bg-success rounded-top flex-grow-1" style={{ height: `${h}px`, opacity: 0.7 }}></div>
              ))}
            </div>
            <div className="d-flex justify-content-between small text-muted mt-3 font-monospace">
              <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Juin</span>
              <span>Juil</span><span>Août</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Engagement (%)</h5>
            <div className="text-center py-4">
              <div className="position-relative d-inline-block">
                <svg width="150" height="150" viewBox="0 0 36 36">
                  <path fill="none" stroke="#eee" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path fill="none" stroke="#198754" strokeWidth="3" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <h2 className="fw-bold mb-0">75%</h2>
                </div>
              </div>
              <p className="text-muted mt-4 small px-3">
                L'engagement moyen de vos étudiants a augmenté de <strong>+12%</strong> ce mois-ci.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Cours les plus suivis</h6>
            <h4 className="fw-bold fs-3 mb-0">Développement Web</h4>
            <span className="small text-success fw-bold">+24 inscrits</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Note moyenne globale</h6>
            <h4 className="fw-bold fs-3 mb-0">4.7 / 5</h4>
            <span className="small text-muted">Sur 150 avis</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4 text-center">
            <h6 className="text-muted mb-2">Total des revenus</h6>
            <h4 className="fw-bold fs-3 mb-0">2 450.00 €</h4>
            <span className="small text-success fw-bold">Paiement en attente: 450€</span>
          </div>
        </div>
      </div>
    </div>
  );
}
