import { Link } from 'react-router-dom';

export default function TeacherCoursesPage() {
  const myCourses = [
    { id: 1, title: 'Développement Web Moderne', students: 45, status: 'Publié', rating: 4.8 },
    { id: 2, title: 'Algorithmique en JS', students: 12, status: 'Draft', rating: 0 },
    { id: 3, title: 'Base de données SQL', students: 88, status: 'Publié', rating: 4.5 }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Mes Cours</h2>
        <button className="btn btn-success d-flex align-items-center gap-2 px-4 shadow-sm">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Créer un cours
        </button>
      </div>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted">
              <tr>
                <th className="px-4 py-3">Cours</th>
                <th className="py-3">Élèves</th>
                <th className="py-3">Status</th>
                <th className="py-3">Note</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCourses.map(course => (
                <tr key={course.id}>
                  <td className="px-4 py-3 fw-medium">{course.title}</td>
                  <td className="py-3">{course.students} inscrits</td>
                  <td className="py-3">
                    <span className={`badge rounded-pill ${course.status === 'Publié' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'}`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-3 text-warning fw-bold">
                    {course.rating > 0 ? `★ ${course.rating}` : 'Pas encore noté'}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-outline-primary">Éditer</button>
                      <button className="btn btn-sm btn-outline-danger">Supprimer</button>
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
