export default function StudentCertificatesPage() {
  const certificates = [
    { id: 1, course: 'UI/UX Design Avancé', date: '15 Mars 2026', id_cert: 'CERT-UIUX-9876' },
    { id: 2, course: 'JavaScript Fondamentaux', date: '02 Janvier 2026', id_cert: 'CERT-JS-5432' }
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">Mes Certificats</h2>
      
      {certificates.length > 0 ? (
        <div className="row g-4">
          {certificates.map(cert => (
            <div key={cert.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 border-top border-4 border-success h-100 p-4">
                <div className="mb-3">
                  <div className="bg-success-subtle text-success p-2 rounded-3 d-inline-block mb-3">
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <h5 className="fw-bold mb-1">{cert.course}</h5>
                  <p className="text-muted small">Obtenu le {cert.date}</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-light p-2 rounded mb-3 small text-center font-monospace text-muted">
                    ID: {cert.id_cert}
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-dark btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      PDF
                    </button>
                    <button className="btn btn-outline-dark btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card shadow-sm border-0 p-5 text-center">
          <div className="mb-3 text-muted">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h5 className="fw-bold">Aucun certificat pour le moment</h5>
          <p className="text-muted">Terminez des cours à 100% pour obtenir vos diplômes.</p>
          <div className="mt-2">
            <button className="btn btn-primary px-4">Voir mes cours</button>
          </div>
        </div>
      )}
    </div>
  );
}
