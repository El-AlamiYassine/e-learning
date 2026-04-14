import axiosInstance from './axiosInstance';

const studentApi = {
  getDashboardSummary: async () => {
    const response = await axiosInstance.get('/student/dashboard/summary');
    return response.data;
  },
  
  getEnrolledCourses: async () => {
    const response = await axiosInstance.get('/student/courses');
    return response.data;
  },

  getCatalog: async (categoryId) => {
    const params = categoryId ? { categoryId } : {};
    const response = await axiosInstance.get('/student/catalog', { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get('/student/categories');
    return response.data;
  },

  enroll: async (courseId) => {
    const response = await axiosInstance.post(`/student/courses/${courseId}/enroll`);
    return response.data;
  },

  getCourseDetail: async (courseId) => {
    const response = await axiosInstance.get(`/student/courses/${courseId}/detail`);
    return response.data;
  },

  completeLesson: async (lessonId) => {
    const response = await axiosInstance.post(`/student/lessons/${lessonId}/complete`);
    return response.data;
  }
};

export default studentApi;
