import { useState, useEffect } from 'react';
import studentApi from '../../api/studentApi';
import { generateCertificatePDF } from '../../utils/CertificatePdf';

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getCertificates();
      setCertificates(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Impossible de charger vos certificats.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cert) => {
    try {
      setDownloadingCert(cert.id);
      generateCertificatePDF(cert);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Erreur lors de la génération du PDF.');
    } finally {
      setDownloadingCert(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
           <h2 className="fw-bold mb-1 text-dark">Mes Certificats</h2>
           <p className="text-secondary mb-0">Validez vos compétences et partagez vos réussites.</p>
        </div>
      </div>
      
      {certificates.length > 0 ? (
        <div className="row g-4">
          {certificates.map(cert => (
            <div key={cert.id} className="col-md-6 col-lg-4">
              <div className="glass-panel hover-lift h-100 p-4 border-top border-4 d-flex flex-column" style={{ borderColor: 'var(--color-primary)' }}>
                <div className="mb-3">
                  <div className="mb-3 text-white d-flex align-items-center justify-content-center rounded-3 shadow-sm" style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary))' }}>
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <h5 className="fw-bold mb-1 text-dark">{cert.courseTitle}</h5>
                  <p className="text-secondary small">Obtenu le {formatDate(cert.issueDate)}</p>
                </div>
                <div className="mt-auto">
                  <div className="p-2 rounded mb-3 small text-center font-monospace fw-medium" style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-muted)' }}>
                    ID: {cert.verificationCode}
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleDownload(cert)}
                      disabled={downloadingCert === cert.id}
                      className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-pill fw-bold hover-lift"
                    >
                      {downloadingCert === cert.id ? (
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                      ) : (
                        <>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Télécharger PDF
                        </>
                      )}
                    </button>
                    <button className="btn-premium btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-pill shadow-sm" style={{ padding: '0.4rem' }}>
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
        <div className="glass-panel p-5 text-center fade-in-up">
          <div className="mb-4 text-muted mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.03)' }}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h5 className="fw-bold text-dark text-gradient mb-2">Aucun certificat obtenu</h5>
          <p className="text-secondary mx-auto" style={{ maxWidth: '400px' }}>Terminez des cours à 100% avec succès pour débloquer vos diplômes et les ajouter à votre profil.</p>
          <div className="mt-4">
            <button className="btn-premium rounded-pill px-5 shadow-sm">Explorer les cours</button>
          </div>
        </div>
      )}
    </div>
  );
}
