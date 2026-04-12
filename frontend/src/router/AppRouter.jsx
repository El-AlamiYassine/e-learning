import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import StudentLayout from '../pages/student/StudentLayout';
import DashboardOverview from '../pages/student/DashboardOverview';
import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboardOverview from '../pages/admin/DashboardOverview';
import TeacherLayout from '../pages/teacher/TeacherLayout';
import TeacherDashboardOverview from '../pages/teacher/DashboardOverview';
import StudentCoursesPage from '../pages/student/StudentCoursesPage';
import StudentCalendarPage from '../pages/student/StudentCalendarPage';
import StudentCertificatesPage from '../pages/student/StudentCertificatesPage';
import TeacherCoursesPage from '../pages/teacher/TeacherCoursesPage';
import TeacherStudentsPage from '../pages/teacher/TeacherStudentsPage';
import TeacherAnalyticsPage from '../pages/teacher/TeacherAnalyticsPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import AddUserPage from '../pages/admin/AddUserPage';
import ManageCoursesPage from '../pages/admin/ManageCoursesPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

import { useState, useEffect } from 'react';
import MaintenancePage from '../pages/public/MaintenancePage';
import { checkPublicMaintenance } from '../api/adminApi';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default function AppRouter() {
  const { user } = useAuth();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await checkPublicMaintenance();
        setIsMaintenance(res.data.maintenanceMode);
      } catch (err) {
        console.error('Erreur maintenance check', err);
      } finally {
        setLoading(false);
      }
    };
    checkMaintenance();
  }, []);

  if (loading) return null; // Ou un spinner global

  // Si maintenance active ET l'utilisateur n'est pas ADMIN
  if (isMaintenance && user?.role !== 'ROLE_ADMIN') {
    return (
      <Routes>
        <Route path="*" element={<MaintenancePage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Routes étudiant */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute roles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardOverview />} />
        <Route path="courses" element={<StudentCoursesPage />} />
        <Route path="calendar" element={<StudentCalendarPage />} />
        <Route path="certificates" element={<StudentCertificatesPage />} />
      </Route>

      {/* Routes prof */}
      <Route path="/teacher" element={
        <ProtectedRoute roles={['ROLE_TEACHER', 'ROLE_ADMIN']}>
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboardOverview />} />
        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route path="students" element={<TeacherStudentsPage />} />
        <Route path="analytics" element={<TeacherAnalyticsPage />} />
        {/* Redirect /teacher to /teacher/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Routes admin */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['ROLE_ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboardOverview />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="users/add" element={<AddUserPage />} />
        <Route path="courses" element={<ManageCoursesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}