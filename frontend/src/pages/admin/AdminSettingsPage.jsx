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
      </div>
    </div>
  );
}
