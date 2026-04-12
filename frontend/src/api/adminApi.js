import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Users management
export const getAllUsers = () => axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
export const deleteUser = (id) => axios.delete(`${API_URL}/users/${id}`, { headers: getAuthHeader() });
export const updateUserRole = (id, role) => axios.patch(`${API_URL}/users/${id}/role`, { role }, { headers: getAuthHeader() });
export const adminCreateUser = (userData) => axios.post(`${API_URL}/users`, userData, { headers: getAuthHeader() });

// Courses management
export const getAllCourses = () => axios.get(`${API_URL}/courses`, { headers: getAuthHeader() });
export const updateCourseStatus = (id, status) => axios.patch(`${API_URL}/courses/${id}/status`, { status }, { headers: getAuthHeader() });
export const getAdminStats = () => axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });

// System Settings
export const getMaintenanceStatus = () => axios.get(`${API_URL}/settings/maintenance`, { headers: getAuthHeader() });
export const updateMaintenanceStatus = (maintenanceMode) => axios.patch(`${API_URL}/settings/maintenance`, { maintenanceMode }, { headers: getAuthHeader() });

// Public System
export const checkPublicMaintenance = () => axios.get(`http://localhost:8080/api/system/maintenance-status`);
