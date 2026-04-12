import { Link } from 'react-router-dom';

export default function StudentCoursesPage() {
  const courses = [
    { id: 1, title: 'Introduction à React', instructor: 'Jean Dupont', progress: 65, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'Maîtriser Node.js', instructor: 'Marie Curie', progress: 30, image: 'https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'UI/UX Design Avancé', instructor: 'Lucie Bernard', progress: 100, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?q=80&w=2070&auto=format&fit=crop' }
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Mes Cours</h2>
        <Link to="/student/dashboard/catalog" className="btn btn-primary d-flex align-items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Explorer le catalogue
        </Link>
      </div>

      <div className="row g-4">
        {courses.map(course => (
          <div key={course.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm overflow-hidden hover-lift">
              <img src={course.image} className="card-img-top" alt={course.title} style={{ height: '160px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="text-muted small mb-3">Par {course.instructor}</p>
                <div className="progress mb-2" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${course.progress === 100 ? 'bg-success' : 'bg-primary'}`} 
                    role="progressbar" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted">{course.progress}% complété</span>
                  <Link to={`/student/course/${course.id}`} className="btn btn-sm btn-outline-primary px-3">
                    {course.progress === 100 ? 'Revoir' : 'Continuer'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
