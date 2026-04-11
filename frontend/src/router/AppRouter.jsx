import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/HomePage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import StudentLayout from '../pages/student/StudentLayout';
import DashboardOverview from '../pages/student/DashboardOverview';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default function AppRouter() {
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
        {/* Placeholder for other routes */}
        <Route path="courses" element={<div className="p-4">Mes cours... (à venir)</div>} />
        <Route path="calendar" element={<div className="p-4">Calendrier... (à venir)</div>} />
        <Route path="certificates" element={<div className="p-4">Certificats... (à venir)</div>} />
      </Route>

      {/* Routes prof — à compléter */}
      <Route path="/teacher/*" element={
        <ProtectedRoute roles={['ROLE_TEACHER', 'ROLE_ADMIN']}>
          <div>Dashboard Prof (à venir)</div>
        </ProtectedRoute>
      }/>

      {/* Routes admin — à compléter */}
      <Route path="/admin/*" element={
        <ProtectedRoute roles={['ROLE_ADMIN']}>
          <div>Dashboard Admin (à venir)</div>
        </ProtectedRoute>
      }/>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}