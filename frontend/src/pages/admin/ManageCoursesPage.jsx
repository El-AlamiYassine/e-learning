import { useEffect, useState } from 'react';
import { getAllCourses, updateCourseStatus } from '../../api/adminApi';

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des cours');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateCourseStatus(id, status);
      setCourses(courses.map(c => c.id === id ? { ...c, statut: status } : c));
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement...</div>;

  const pendingCoursesCount = courses.filter(c => c.statut === 'BROUILLON').length;

  return (
    <div>
      <h2 className="fw-bold mb-4">Modération des Cours</h2>

      <div className="alert alert-info border-0 shadow-sm d-flex align-items-center gap-3 py-3 mb-4">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          Il y a <strong>{pendingCoursesCount} cours</strong> en attente de validation.
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light text-muted">
              <tr>
                <th className="px-4 py-3">Cours</th>
                <th className="py-3">Enseignant</th>
                <th className="py-3">Statut</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold">{course.titre}</div>
                    <div className="text-muted small">{course.description?.substring(0, 50)}...</div>
                  </td>
                  <td className="py-3 text-muted small">{course.formateur?.nom} {course.formateur?.prenom}</td>
                  <td className="py-3">
                    <span className={`badge rounded-pill ${course.statut === 'PUBLIE' ? 'bg-success text-white' : course.statut === 'BROUILLON' ? 'bg-warning text-dark' : 'bg-secondary text-white'}`}>
                      {course.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                       {course.statut === 'BROUILLON' && (
                         <button 
                           onClick={() => handleStatusUpdate(course.id, 'PUBLIE')}
                           className="btn btn-sm btn-success px-3"
                         >
                           Approuver
                         </button>
                       )}
                       {course.statut !== 'ARCHIVE' && (
                         <button 
                           onClick={() => handleStatusUpdate(course.id, 'ARCHIVE')}
                           className="btn btn-sm btn-outline-danger"
                         >
                           Archiver
                         </button>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
