import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes étudiant — à compléter */}
      <Route path="/student/*" element={
        <ProtectedRoute roles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
          <div>Dashboard Étudiant (à venir)</div>
        </ProtectedRoute>
      }/>

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

      <Route path="*" element={<div>404 - Page non trouvée</div>} />
    </Routes>
  );
}