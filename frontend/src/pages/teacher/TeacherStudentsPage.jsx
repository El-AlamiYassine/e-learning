export default function TeacherStudentsPage() {
  const students = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', course: 'Développement Web Moderne', progress: 85 },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', course: 'Développement Web Moderne', progress: 40 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', course: 'Base de données SQL', progress: 100 }
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">Mes Élèves</h2>
      
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col">
              <input type="text" className="form-control form-control-sm w-25" placeholder="Rechercher un élève..." />
            </div>
            <div className="col-auto">
              <select className="form-select form-select-sm">
                <option>Tous les cours</option>
                <option>Développement Web Moderne</option>
                <option>Base de données SQL</option>
              </select>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light text-muted">
              <tr>
                <th className="px-4 py-3">Élève</th>
                <th className="py-3">Email</th>
                <th className="py-3">Cours suivi</th>
                <th className="py-3">Progression</th>
                <th className="px-4 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="px-4 py-3">
                    <div className="fw-bold text-dark">{student.name}</div>
                  </td>
                  <td className="py-3 small text-muted">{student.email}</td>
                  <td className="py-3">
                    <span className="small fw-medium">{student.course}</span>
                  </td>
                  <td className="py-3" style={{ width: '150px' }}>
                    <div className="progress" style={{ height: '6px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${student.progress}%` }}></div>
                    </div>
                    <span className="small text-muted" style={{ fontSize: '10px' }}>{student.progress}% complété</span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button className="btn btn-sm btn-link text-primary text-decoration-none fw-bold">Détails</button>
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
