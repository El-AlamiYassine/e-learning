import axios from 'axios';

const API_URL = 'http://localhost:8080/api/teacher';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getTeacherStats = () => axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
export const getTeacherCourses = () => axios.get(`${API_URL}/courses`, { headers: getAuthHeader() });
export const getCourse = (id) => axios.get(`${API_URL}/courses/${id}`, { headers: getAuthHeader() });
export const getTeacherStudents = () => axios.get(`${API_URL}/students`, { headers: getAuthHeader() });
export const getCategories = () => axios.get(`${API_URL}/categories`, { headers: getAuthHeader() });
export const createCourse = (courseData) => axios.post(`${API_URL}/courses`, courseData, { headers: getAuthHeader() });
export const updateCourse = (id, courseData) => axios.put(`${API_URL}/courses/${id}`, courseData, { headers: getAuthHeader() });
export const deleteCourse = (id) => axios.delete(`${API_URL}/courses/${id}`, { headers: getAuthHeader() });

// Lessons
export const getLessons = (courseId) => axios.get(`${API_URL}/courses/${courseId}/lessons`, { headers: getAuthHeader() });
export const createLesson = (courseId, lessonData) => axios.post(`${API_URL}/courses/${courseId}/lessons`, lessonData, { headers: getAuthHeader() });
export const updateLesson = (id, lessonData) => axios.put(`${API_URL}/lessons/${id}`, lessonData, { headers: getAuthHeader() });
export const deleteLesson = (lessonId) => axios.delete(`${API_URL}/lessons/${lessonId}`, { headers: getAuthHeader() });

export const updateCourseStatus = (id, status) => axios.patch(`${API_URL}/courses/${id}/status`, { status }, { headers: getAuthHeader() });
