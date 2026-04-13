import { useState, useEffect } from 'react';
import { getTeacherStudents } from '../../api/teacherApi';

export default function TeacherStudentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getTeacherStudents();
        setEnrollments(res.data);
      } catch (err) {
        console.error('Erreur students teacher', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <div className="p-4 text-center">Chargement de la liste des élèves...</div>;

  return (
    <div>
      <h2 className="fw-bold mb-4 text-primary">Mes Élèves</h2>
      
      <div className="card shadow-sm border-0 bg-white">
        <div className="card-header bg-white py-4 border-0">
          <div className="row align-items-center">
            <div className="col">
              <div className="input-group input-group-sm w-50">
                <span className="input-group-text bg-light border-0"><svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg></span>
                <input type="text" className="form-control bg-light border-0" placeholder="Rechercher un élève..." />
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover">
            <thead className="bg-light text-muted small text-uppercase fw-bold">
              <tr>
                <th className="px-4 py-3">Élève</th>
                <th className="py-3">Email</th>
                <th className="py-3">Cours suivi</th>
                <th className="py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Aucun élève n'est encore inscrit à vos cours.
                  </td>
                </tr>
              ) : (
                enrollments.map(enrollment => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '12px'}}>
                          {enrollment.etudiant.nom.charAt(0)}{enrollment.etudiant.prenom.charAt(0)}
                        </div>
                        <span className="fw-bold text-dark">{enrollment.etudiant.nom} {enrollment.etudiant.prenom}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{enrollment.etudiant.email}</td>
                    <td className="py-3">
                      <span className="badge bg-light text-dark border fw-normal">{enrollment.cours.titre}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`badge rounded-pill ${enrollment.statut === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                        {enrollment.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold">Détails</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
