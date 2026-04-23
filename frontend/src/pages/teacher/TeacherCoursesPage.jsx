import { useState, useEffect } from 'react';
import { getTeacherCourses, deleteCourse, updateCourseStatus } from '../../api/teacherApi';
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
    if (window.confirm('Voulez-vous vraiment supprimer ce cours ? Cette action est irréversible.')) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const handleUpdateStatus = async (id, status, message) => {
    if (window.confirm(message)) {
      try {
        await updateCourseStatus(id, status);
        fetchCourses();
      } catch (err) {
        alert('Erreur lors du changement de statut.');
      }
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h2 className="fw-bold mb-1 text-dark">Mes Cours</h2>
           <p className="text-secondary small mb-0">Gérez vos contenus et suivez vos publications.</p>
        </div>
        <Link to="/teacher/courses/create" className="btn-premium rounded-pill px-4 shadow-sm text-decoration-none d-flex align-items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Nouveau cours
        </Link>
      </div>

      <div className="glass-panel overflow-hidden fade-in-up">
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
                    <div className="mb-3 opacity-25">
                      <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    Vous n'avez pas encore créé de cours.
                  </td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={course.imageUrl || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=200&auto=format&fit=crop'} 
                          alt="" 
                          className="rounded-3 shadow-sm border" 
                          style={{width: '50px', height: '50px', objectFit: 'cover'}} 
                        />
                        <div>
                          <span className="fw-bold text-dark d-block">{course.titre}</span>
                          <span className="text-secondary small">{course.categorie?.nom || 'Sans catégorie'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-3 py-2 fw-bold small ${
                        course.statut === 'PUBLIE' ? 'bg-success-subtle text-success' : 
                        course.statut === 'ARCHIVE' ? 'bg-danger-subtle text-danger' :
                        'bg-warning-subtle text-warning'
                      }`}>
                        {course.statut === 'PUBLIE' ? '● Publié' : 
                         course.statut === 'ARCHIVE' ? '● Archivé' : '○ Brouillon'}
                      </span>
                    </td>
                    <td className="py-3 text-muted small">
                      {new Date(course.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="text-end px-4 py-3">
                      <div className="d-flex gap-2 justify-content-end">
                        {course.statut === 'BROUILLON' && (
                          <button onClick={() => handleUpdateStatus(course.id, 'PUBLIE', 'Voulez-vous publier ce cours ?')} className="btn btn-sm text-success bg-success bg-opacity-10 rounded-pill px-3 fw-bold hover-lift border-0">
                            Publier
                          </button>
                        )}
                        {course.statut === 'ARCHIVE' && (
                          <button onClick={() => handleUpdateStatus(course.id, 'PUBLIE', 'Voulez-vous republier ce cours ?')} className="btn btn-sm text-success bg-success bg-opacity-10 rounded-pill px-3 fw-bold hover-lift border-0">
                            Republier
                          </button>
                        )}
                        <Link to={`/teacher/courses/${course.id}/lessons`} className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold d-flex align-items-center gap-1 hover-lift text-decoration-none text-dark">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Contenu
                        </Link>
                        <Link 
                          to={`/teacher/courses/${course.id}/edit`} 
                          className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center hover-lift" 
                          style={{ width: '32px', height: '32px' }}
                          title="Modifier les informations"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(course.id)} 
                          className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center hover-lift" 
                          style={{ width: '32px', height: '32px' }}
                          title="Supprimer"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <div className="dropdown">
                          <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2 glass-panel">
                            {course.statut === 'PUBLIE' && (
                              <>
                                <li><button className="dropdown-item rounded-3 py-2 fw-medium text-dark" onClick={() => handleUpdateStatus(course.id, 'BROUILLON', 'Arrêter la publication du cours ?')}>Arrêter la publication</button></li>
                                <li><button className="dropdown-item rounded-3 py-2 fw-medium text-dark" onClick={() => handleUpdateStatus(course.id, 'ARCHIVE', 'Archiver ce cours ?')}>Archiver</button></li>
                              </>
                            )}
                            {course.statut === 'ARCHIVE' && (
                              <li><button className="dropdown-item rounded-3 py-2 fw-medium text-dark" onClick={() => handleUpdateStatus(course.id, 'BROUILLON', 'Désarchiver ce cours ?')}>Désarchiver (Brouillon)</button></li>
                            )}
                          </ul>
                        </div>
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
