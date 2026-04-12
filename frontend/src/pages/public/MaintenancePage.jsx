import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="text-center" style={{ maxWidth: '500px' }}>
        <div className="mb-4 text-danger">
          <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1113.5 17.25l-5.83-5.83m.917-2.146l3.5-3.5a2.5 2.5 0 013.536 0l3.08 3.08a2.5 2.5 0 010 3.536l-3.5 3.5m-6.364-3.536l-3.08-3.08a2.5 2.5 0 00-3.536 0l-3.5 3.5a2.5 2.5 0 000 3.536l3.08 3.08a2.5 2.5 0 003.536 0l3.5-3.5" />
          </svg>
        </div>
        <h1 className="fw-bold display-5 mb-3">Maintenance en cours</h1>
        <p className="text-muted fs-5 mb-4">
          Nous effectuons actuellement quelques mises à jour pour améliorer votre expérience. 
          Revenez dans quelques instants !
        </p>
        <div className="p-3 bg-white shadow-sm rounded-4 border">
          <p className="small text-muted mb-0">
            L'accès à la plateforme est temporairement restreint par l'administrateur.
          </p>
        </div>
      </div>
    </div>
  );
}
