import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessons, createLesson, deleteLesson } from '../../api/teacherApi';

export default function ManageLessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    ordre: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await getLessons(id);
      setLessons(res.data);
    } catch (err) {
      console.error('Erreur chargement leçons', err);
      setError('Impossible de charger les leçons.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await createLesson(id, formData);
      setFormData({ titre: '', description: '', ordre: '' });
      fetchLessons();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la leçon.');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette leçon ?')) {
      try {
        await deleteLesson(lessonId);
        fetchLessons();
      } catch (err) {
        alert('Erreur lors de la suppression.');
      }
    }
  };

  if (loading) return <div className="p-5 text-center">Chargement du contenu...</div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate('/teacher/courses')} className="btn btn-light rounded-circle p-2 d-flex">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="fw-bold mb-0">Contenu du Cours</h2>
          <p className="text-muted small mb-0">ID du cours : #{id}</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Liste des leçons */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 bg-white">
            <div className="card-header bg-white border-0 p-4">
               <h5 className="fw-bold mb-0">Liste des Leçons</h5>
            </div>
            <div className="card-body p-0">
              {lessons.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  Aucune leçon pour le moment. Utilisez le formulaire pour en ajouter une.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="list-group-item p-4 border-0 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-3">
                           <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px', flexShrink: 0}}>
                             {lesson.ordre || index + 1}
                           </div>
                           <div>
                             <h6 className="fw-bold mb-1">{lesson.titre}</h6>
                             <p className="text-muted small mb-0">{lesson.description}</p>
                           </div>
                        </div>
                        <button onClick={() => handleDelete(lesson.id)} className="btn btn-link text-danger p-0">
                          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="col-lg-5">
           <div className="card shadow-sm border-0 bg-white p-4">
              <h5 className="fw-bold mb-4">Ajouter une Leçon</h5>
              {error && <div className="alert alert-danger mb-4">{error}</div>}
              <form onSubmit={handleAddLesson} className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Titre de la leçon</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0" 
                    required 
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    placeholder="ex: Introduction au CSS"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Description</label>
                  <textarea 
                    className="form-control bg-light border-0" 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Qu'est-ce que l'étudiant va apprendre ?"
                  ></textarea>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Ordre (optionnel)</label>
                  <input 
                    type="number" 
                    className="form-control bg-light border-0"
                    value={formData.ordre}
                    onChange={(e) => setFormData({...formData, ordre: e.target.value})}
                    placeholder="ex: 1"
                  />
                </div>
                <div className="col-12 mt-4">
                   <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm" disabled={adding}>
                     {adding ? 'Ajout en cours...' : 'Ajouter la leçon'}
                   </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
