import { useState, useEffect } from 'react';
import { getTeacherCourses, deleteCourse } from '../../api/teacherApi';
import { Link } from 'react-router-dom';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getTeacherCourses();
      setCourses(res.data);
    } catch (err) {
      console.error('Erreur courses teacher', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ?')) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Chargement de vos cours...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Mes Cours</h2>
        <Link to="/teacher/courses/create" className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm rounded-pill py-2 fw-bold text-decoration-none">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Nouveau cours
        </Link>
      </div>

      <div className="card shadow-sm border-0 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase fw-bold">
              <tr>
                <th className="px-4 py-3">Cours</th>
                <th className="py-3">Status</th>
                <th className="py-3">Date de création</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    Vous n'avez pas encore créé de cours.
                  </td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        {course.imageUrl && <img src={course.imageUrl} alt="" className="rounded shadow-sm" style={{width: '40px', height: '40px', objectFit: 'cover'}} />}
                        <span className="fw-bold text-dark">{course.titre}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-3 py-2 ${
                        course.statut === 'PUBLIE' ? 'bg-success-subtle text-success' : 
                        course.statut === 'BROUILLON' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'
                      }`}>
                        {course.statut}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(course.dateCreation).toLocaleDateString()}
                    </td>
                    <td className="text-end px-4 py-3">
                      <div className="d-flex gap-2 justify-content-end">
                        <Link to={`/teacher/courses/${course.id}/lessons`} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Contenu
                        </Link>
                          <Link to={`/teacher/courses/${course.id}/edit`} className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold text-decoration-none">Éditer</Link>
                          <button onClick={() => handleDelete(course.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">Supprimer</button>
                      </div>
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
