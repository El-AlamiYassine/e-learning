import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import studentApi from '../../api/studentApi';

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, enrolledData] = await Promise.all([
          studentApi.getCategories(),
          studentApi.getEnrolledCourses()
        ]);
        setCategories(categoriesData);
        setEnrolledCourseIds(new Set(enrolledData.map(c => c.id)));
        
        // Load all courses initially
        const coursesData = await studentApi.getCatalog();
        setCourses(coursesData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
        setError('Impossible de charger le catalogue.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    try {
      setLoading(true);
      setSelectedCategory(categoryId);
      const data = await studentApi.getCatalog(categoryId);
      setCourses(data);
    } catch (err) {
      setError('Erreur lors du filtrage des cours.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollLoading(courseId);
      await studentApi.enroll(courseId);
      setEnrolledCourseIds(prev => new Set([...prev, courseId]));
      // Success modal or toast could be added here
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setEnrollLoading(null);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 p-0">
      <div className="row g-4">
        {/* Categories Sidebar */}
        <div className="col-lg-3">
          <div className="glass-panel p-4 sticky-top" style={{ top: '20px' }}>
            <h5 className="fw-bold mb-4 text-dark">Catégories</h5>
            <div className="d-flex flex-column gap-2">
              <button 
                onClick={() => handleCategoryChange(null)}
                className={`btn text-start rounded-3 px-3 py-2 fw-medium transition-all ${selectedCategory === null ? 'btn-primary shadow-sm' : 'btn-light text-secondary hover-bg-light'}`}
              >
                Toutes les catégories
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`btn text-start rounded-3 px-3 py-2 fw-medium transition-all ${selectedCategory === cat.id ? 'btn-primary shadow-sm' : 'btn-light text-secondary hover-bg-light'}`}
                >
                  {cat.nom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0 text-dark">Explorer les cours</h2>
            <div className="text-secondary small">{courses.length} cours disponibles</div>
          </div>

          {error && <div className="alert alert-danger rounded-4 border-0 shadow-sm">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="col-md-6 col-xl-4">
                    <div className="glass-panel overflow-hidden hover-lift d-flex flex-column h-100 fade-in-up">
                      <div className="position-relative">
                        <img 
                          src={course.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'} 
                          className="card-img-top" 
                          alt={course.titre} 
                          style={{ height: '180px', objectFit: 'cover' }} 
                        />
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill fw-bold">
                            {course.categorie?.nom || 'Général'}
                          </span>
                        </div>
                      </div>
                      <div className="card-body p-4 d-flex flex-column">
                        <h5 className="card-title fw-bold mb-2 text-dark line-clamp-2" style={{ height: '3rem', overflow: 'hidden' }}>
                          {course.titre}
                        </h5>
                        <p className="text-secondary small mb-4 line-clamp-3" style={{ height: '3.5rem', overflow: 'hidden' }}>
                          {course.description || "Aucune description disponible pour ce cours."}
                        </p>
                        
                        <div className="mt-auto pt-3 border-top border-light d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-2">
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="small fw-semibold text-secondary">
                              {course.formateur?.prenom} {course.formateur?.nom}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          {enrolledCourseIds.has(course.id) ? (
                            <Link to={`/student/course/${course.id}`} className="btn w-100 rounded-pill fw-bold border-0 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                              Déjà inscrit - Voir
                            </Link>
                          ) : (
                            <button 
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrollLoading === course.id}
                              className="btn-premium w-100 rounded-pill mt-top d-flex align-items-center justify-content-center gap-2"
                            >
                              {enrollLoading === course.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : (
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              )}
                              S'inscrire
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="bg-light rounded-4 p-5">
                    <h4 className="fw-bold text-dark">Aucun cours trouvé</h4>
                    <p className="text-secondary">Désolé, nous n'avons pas trouvé de cours dans cette catégorie pour le moment.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
