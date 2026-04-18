import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessons, createLesson, updateLesson, deleteLesson, uploadFile, getQuiz, saveQuiz } from '../../api/teacherApi';

export default function ManageLessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    videoUrl: '',
    ordre: '',
    documents: []
  });
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');

  // Quiz State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuizLesson, setCurrentQuizLesson] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSaving, setQuizSaving] = useState(false);
  const [quizData, setQuizData] = useState({
    titre: '',
    dureeMinutes: 30,
    scoreMinimum: 50,
    questions: []
  });

  useEffect(() => {
    fetchLessons();
  }, [id]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await getLessons(id);
      setLessons(res.data || []);
    } catch (err) {
      console.error('Erreur chargement leçons:', err);
      setError('Impossible de charger les leçons.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      let finalFormData = { ...formData };
      
      // Upload Video if selected
      if (videoFile) {
        const videoRes = await uploadFile(videoFile);
        finalFormData.videoUrl = videoRes.data.url;
      }
      
      // Upload PDF if selected
      if (pdfFile) {
        const pdfRes = await uploadFile(pdfFile);
        finalFormData.documents = [{
           nom: pdfFile.name,
           cheminFichier: pdfRes.data.url,
           type: pdfFile.type || 'application/pdf'
        }];
      }

      if (editingId) {
        await updateLesson(editingId, finalFormData);
      } else {
        await createLesson(id, finalFormData);
      }
      resetForm();
      fetchLessons();
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement de la leçon ou de l\'upload.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lesson) => {
    setEditingId(lesson.id);
    setFormData({
      titre: lesson.titre || '',
      contenu: lesson.contenu || '',
      videoUrl: lesson.videoUrl || '',
      ordre: lesson.ordre || '',
      documents: lesson.documents || []
    });
    setVideoFile(null);
    setPdfFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ titre: '', contenu: '', videoUrl: '', ordre: '', documents: [] });
    setVideoFile(null);
    setPdfFile(null);
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

  // Quiz Functions
  const handleOpenQuiz = async (lesson) => {
    setCurrentQuizLesson(lesson);
    setShowQuizModal(true);
    setQuizLoading(true);
    try {
      const res = await getQuiz(lesson.id);
      if (res.data) {
        setQuizData({
          id: res.data.id,
          titre: res.data.titre || 'Quiz: ' + lesson.titre,
          dureeMinutes: res.data.dureeMinutes || 30,
          scoreMinimum: res.data.scoreMinimum || 50,
          questions: res.data.questions || []
        });
      } else {
        setQuizData({
          titre: 'Quiz: ' + lesson.titre,
          dureeMinutes: 30,
          scoreMinimum: 50,
          questions: [{ enonce: '', optionA: '', optionB: '', optionC: '', optionD: '', reponseCorrecte: 'A' }]
        });
      }
    } catch (err) {
      console.error('Erreur quiz', err);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { enonce: '', optionA: '', optionB: '', optionC: '', optionD: '', reponseCorrecte: 'A' }]
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...quizData.questions];
    newQuestions.splice(index, 1);
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...quizData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuizData({ ...quizData, questions: newQuestions });
  };

  const saveQuizData = async () => {
    setQuizSaving(true);
    try {
      await saveQuiz(currentQuizLesson.id, quizData);
      setShowQuizModal(false);
      alert('Quiz enregistré avec succès !');
      fetchLessons();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde du quiz.');
    } finally {
      setQuizSaving(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate('/teacher/courses')} className="btn btn-light rounded-circle p-2 d-flex shadow-sm">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="fw-bold mb-0 text-dark">Gestion du Contenu</h2>
          <p className="text-secondary small mb-0">ID du cours : <span className="badge bg-light text-dark fw-bold">#{id}</span></p>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulaire d'ajout/édition */}
        <div className="col-lg-5 order-lg-2 fade-in-up" style={{ animationDelay: '0.1s' }}>
           <div className="glass-panel p-4 sticky-top" style={{ top: '20px', zIndex: 10 }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark">{editingId ? 'Modifier la Leçon' : 'Ajouter une Leçon'}</h5>
                {editingId && (
                  <button onClick={resetForm} className="btn btn-sm btn-link text-secondary text-decoration-none">Annuler</button>
                )}
              </div>
              
              {error && <div className="alert alert-danger mb-4 rounded-3 small">{error}</div>}
              
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Titre de la leçon</label>
                  <input 
                    type="text" 
                    className="form-control border-light-subtle shadow-sm" 
                    required 
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                    placeholder="ex: Introduction au CSS"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Vidéo (Fichier) ou URL</label>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      accept="video/*"
                      className="form-control border-light-subtle shadow-sm"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                    <input 
                      type="url" 
                      className="form-control border-light-subtle shadow-sm w-50"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="Ou lien (YouTube/MP4)"
                      disabled={!!videoFile}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Support PDF (Optionnel)</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="form-control border-light-subtle shadow-sm"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                  {formData.documents && formData.documents.length > 0 && (
                    <small className="text-primary mt-1 d-block">
                      Dernier PDF enregistré: {formData.documents[0].nom}
                    </small>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted text-uppercase">Contenu de la leçon</label>
                  <textarea 
                    className="form-control border-light-subtle shadow-sm" 
                    rows="6"
                    required
                    value={formData.contenu}
                    onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                    placeholder="Texte complet de la leçon..."
                  ></textarea>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Ordre</label>
                  <input 
                    type="number" 
                    className="form-control border-light-subtle shadow-sm"
                    value={formData.ordre}
                    onChange={(e) => setFormData({...formData, ordre: e.target.value})}
                    placeholder="ex: 1"
                  />
                </div>
                <div className="col-12 mt-4">
                   <button type="submit" className={`btn ${editingId ? 'btn-success' : 'btn-premium'} w-100 py-3 fw-bold rounded-pill shadow-sm hover-lift`} disabled={saving}>
                     {saving ? 'Enregistrement...' : editingId ? 'Enregistrer les modifications' : 'Ajouter la leçon'}
                   </button>
                </div>
              </form>
           </div>
        </div>

        {/* Liste des leçons */}
        <div className="col-lg-7 order-lg-1 fade-in-up">
          <div className="glass-panel min-vh-50 overflow-hidden p-0">
            <div className="border-bottom p-4">
               <h5 className="fw-bold mb-0 text-dark">Programme du Cours</h5>
            </div>
            <div className="card-body p-0">
              {lessons.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <div className="mb-3 opacity-25">
                    <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <p className="mb-0">Aucune leçon pour le moment.</p>
                  <p className="small">Utilisez le formulaire pour commencer à bâtir votre cours.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {Array.isArray(lessons) && lessons.map((lesson, index) => (
                    <div key={lesson.id} className={`list-group-item bg-transparent p-4 border-0 border-bottom transition-all ${editingId === lesson.id ? 'bg-primary bg-opacity-10 border-start border-primary border-4' : 'hover-bg-light'}`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-3 align-items-center overflow-hidden">
                           <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold small" style={{width: '36px', height: '36px', flexShrink: 0}}>
                             {lesson.ordre || index + 1}
                           </div>
                           <div className="text-truncate">
                             <h6 className="fw-bold mb-1 text-dark text-truncate">{lesson.titre}</h6>
                             <div className="d-flex gap-3 small text-secondary">
                                {lesson.videoUrl && (
                                  <span className="d-flex align-items-center gap-1">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Vidéo
                                  </span>
                                )}
                                <span className="d-flex align-items-center gap-1">
                                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                  {lesson.contenu?.length || 0} caractères
                                </span>
                             </div>
                           </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button onClick={() => handleOpenQuiz(lesson)} className="btn btn-sm btn-outline-info rounded-pill px-3 shadow-sm transition-all hover-lift d-flex align-items-center gap-1">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Quiz
                          </button>
                          <button onClick={() => handleEdit(lesson)} className="btn btn-sm btn-outline-primary rounded-pill px-3 shadow-sm transition-all hover-lift">
                            Modifier
                          </button>
                          <button onClick={() => handleDelete(lesson.id)} className="btn btn-sm btn-outline-danger rounded-pill p-1 shadow-sm transition-all hover-lift" style={{ width: '32px', height: '32px' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="modal-title fw-bold">Configuration du Quiz : {currentQuizLesson?.titre}</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuizModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {quizLoading ? (
                  <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Titre du Quiz</label>
                      <input type="text" className="form-control" value={quizData.titre} onChange={e => setQuizData({...quizData, titre: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Durée (min)</label>
                      <input type="number" className="form-control" value={quizData.dureeMinutes} onChange={e => setQuizData({...quizData, dureeMinutes: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Score Min (%)</label>
                      <input type="number" className="form-control" value={quizData.scoreMinimum} onChange={e => setQuizData({...quizData, scoreMinimum: e.target.value})} />
                    </div>

                    <hr className="my-4" />
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="fw-bold mb-0">Questions ({quizData.questions.length})</h6>
                      <button onClick={handleAddQuestion} className="btn btn-sm btn-primary rounded-pill px-3">+ Ajouter</button>
                    </div>

                    {quizData.questions.map((q, idx) => (
                      <div key={idx} className="card bg-light border-0 p-3 mb-3 position-relative rounded-3">
                        <button 
                          onClick={() => handleRemoveQuestion(idx)} 
                          className="btn btn-sm btn-link text-danger position-absolute top-0 end-0 m-2 text-decoration-none"
                        >Supprimer</button>
                        
                        <div className="mb-3">
                          <label className="form-label small fw-bold">Question {idx + 1}</label>
                          <textarea 
                            className="form-control border-0 shadow-sm" 
                            rows="2" 
                            value={q.enonce} 
                            onChange={e => handleQuestionChange(idx, 'enonce', e.target.value)}
                            placeholder="Enoncé de la question..."
                          ></textarea>
                        </div>
                        <div className="row g-2">
                          <div className="col-md-6">
                            <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white border-0 fw-bold">A</span>
                              <input type="text" className="form-control border-0 shadow-sm" value={q.optionA} onChange={e => handleQuestionChange(idx, 'optionA', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white border-0 fw-bold">B</span>
                              <input type="text" className="form-control border-0 shadow-sm" value={q.optionB} onChange={e => handleQuestionChange(idx, 'optionB', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white border-0 fw-bold">C</span>
                              <input type="text" className="form-control border-0 shadow-sm" value={q.optionC} onChange={e => handleQuestionChange(idx, 'optionC', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-group input-group-sm">
                              <span className="input-group-text bg-white border-0 fw-bold">D</span>
                              <input type="text" className="form-control border-0 shadow-sm" value={q.optionD} onChange={e => handleQuestionChange(idx, 'optionD', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 d-flex align-items-center gap-2">
                          <label className="small fw-bold mb-0">Bonne réponse :</label>
                          <select 
                            className="form-select form-select-sm border-0 shadow-sm w-auto fw-bold text-success" 
                            value={q.reponseCorrecte} 
                            onChange={e => handleQuestionChange(idx, 'reponseCorrecte', e.target.value)}
                          >
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 p-4">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowQuizModal(false)}>Fermer</button>
                <button type="button" className="btn-premium rounded-pill px-4 shadow-sm" disabled={quizSaving || quizLoading} onClick={saveQuizData}>
                  {quizSaving ? 'Enregistrement...' : 'Enregistrer le Quiz'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
