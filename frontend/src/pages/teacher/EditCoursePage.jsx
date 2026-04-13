import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, getCourse, updateCourse } from '../../api/teacherApi';

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    imageUrl: '',
    categoryId: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          getCategories(),
          getCourse(id)
        ]);
        setCategories(catRes.data);
        const course = courseRes.data;
        setFormData({
          titre: course.titre,
          description: course.description,
          imageUrl: course.imageUrl || '',
          categoryId: course.categorie?.id || ''
        });
      } catch (err) {
        console.error('Erreur chargement données', err);
        setError('Impossible de charger les détails du cours.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const dataToSend = {
        ...formData,
        categoryId: formData.categoryId === '' ? null : formData.categoryId
      };
      await updateCourse(id, dataToSend);
      navigate('/teacher/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du cours.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Chargement du cours...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 bg-white p-4">
            <div className="d-flex align-items-center gap-3 mb-4">
               <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle p-2 d-flex">
                 <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h2 className="fw-bold mb-0 text-primary">Modifier le cours</h2>
            </div>

            {error && (
              <div className="alert alert-danger border-0 shadow-sm" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-12">
                <label className="form-label fw-bold small text-muted text-uppercase">Titre du cours</label>
                <input
                  type="text"
                  name="titre"
                  className="form-control form-control-lg bg-light border-0"
                  required
                  value={formData.titre}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small text-muted text-uppercase">Catégorie</label>
                <select
                  name="categoryId"
                  className="form-select form-select-lg bg-light border-0"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold small text-muted text-uppercase">URL de l'image de couverture</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-control form-control-lg bg-light border-0"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold small text-muted text-uppercase">Description</label>
                <textarea
                  name="description"
                  className="form-control bg-light border-0"
                  rows="6"
                  required
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {formData.imageUrl && (
                 <div className="col-12">
                    <label className="form-label fw-bold small text-muted text-uppercase d-block">Aperçu de la couverture</label>
                    <img src={formData.imageUrl} alt="Preview" className="img-fluid rounded shadow-sm" style={{maxHeight: '200px', objectFit: 'cover', width: '100%'}} />
                 </div>
              )}

              <div className="col-12 mt-5">
                <div className="d-grid gap-3 d-md-flex justify-content-md-end">
                  <button type="button" onClick={() => navigate('/teacher/courses')} className="btn btn-light px-5 py-3 fw-bold rounded-pill">Annuler</button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-sm"
                    disabled={saving}
                  >
                    {saving ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : null}
                    {saving ? 'Mise à jour...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
