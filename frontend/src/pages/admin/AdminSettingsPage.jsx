import { useState, useEffect } from 'react';
import { getMaintenanceStatus, updateMaintenanceStatus } from '../../api/adminApi';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const res = await getMaintenanceStatus();
        setMaintenanceMode(res.data.maintenanceMode);
      } catch (err) {
        console.error('Erreur lors du chargement des paramètres', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenance();
  }, []);

  const handleToggleMaintenance = async () => {
    const newStatus = !maintenanceMode;
    const confirmMsg = newStatus 
      ? "Voulez-vous vraiment activer le mode maintenance ? Tous les utilisateurs non-admins seront bloqués." 
      : "Voulez-vous désactiver le mode maintenance ?";
      
    if (window.confirm(confirmMsg)) {
      try {
        await updateMaintenanceStatus(newStatus);
        setMaintenanceMode(newStatus);
      } catch (err) {
        alert("Erreur lors de la mise à jour");
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement des paramètres...</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4">Paramètres du Système</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-bold mb-4">Configuration Générale</h5>
            <div className="mb-3">
              <label className="form-label small fw-medium">Nom de la Plateforme</label>
              <input type="text" className="form-control" defaultValue="E-Learning Pro" />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-medium">Email de Support</label>
              <input type="email" className="form-control" defaultValue="support@elearning.pro" />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-medium">Fuseau Horaire</label>
              <select className="form-select">
                <option>(GMT+01:00) Casablanca / Paris</option>
                <option>(GMT+00:00) London</option>
              </select>
            </div>
            <button className="btn btn-danger px-4 shadow-sm fw-bold">Enregistrer les modifications</button>
          </div>

          <div className="card shadow-sm border-0 p-4 shadow-sm">
            <h5 className="fw-bold mb-4 text-danger">Zone de danger</h5>
            <div className="d-flex align-items-center justify-content-between p-3 border rounded mb-3 bg-light bg-opacity-10">
              <div>
                <h6 className="fw-bold mb-0">Mode Maintenance</h6>
                <p className="text-muted small mb-0">Rendre le site inaccessible pendant les mises à jour.</p>
              </div>
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  checked={maintenanceMode}
                  onChange={handleToggleMaintenance}
                  style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                />
              </div>
            </div>
            <p className="text-muted small">
              Note: Activer le mode maintenance déconnectera virtuellement tous les utilisateurs non-admins en les redirigeant vers une page dédiée.
            </p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 mb-4">
            <h5 className="fw-bold mb-4">Branding</h5>
            <div className="text-center p-4 border border-dashed rounded mb-3 bg-light">
              <div className="bg-danger text-white rounded p-2 d-inline-block mb-2">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
              <p className="small text-muted mb-0">Logo de la plateforme</p>
            </div>
            <button className="btn btn-outline-dark btn-sm w-100 mb-2">Changer le Logo</button>
            <div className="mt-3">
              <label className="form-label small fw-medium">Couleur Primaire</label>
              <div className="d-flex gap-2">
                <div className="rounded-circle border" style={{ width: '24px', height: '24px', backgroundColor: '#dc3545', cursor: 'pointer' }}></div>
                <div className="rounded-circle border" style={{ width: '24px', height: '24px', backgroundColor: '#0d6efd', cursor: 'pointer' }}></div>
                <div className="rounded-circle border" style={{ width: '24px', height: '24px', backgroundColor: '#198754', cursor: 'pointer' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
