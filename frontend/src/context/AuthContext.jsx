import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const navigate = useNavigate();

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { token, role, nom, prenom, email } = res.data;
    

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nom, prenom, email, role }));
    setUser({ nom, prenom, email, role });
    if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else if (role === 'ROLE_TEACHER') navigate('/teacher/dashboard');
    else navigate('/student/dashboard');
  };

  // Accept an AuthResponse-like object coming from social logins (Google)
  const setSessionFromResponse = (resData) => {
    if (!resData) return;
    const { token, role, nom, prenom, email } = resData;
    if (!token) return;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nom, prenom, email, role }));
    setUser({ nom, prenom, email, role });
    if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
    else if (role === 'ROLE_TEACHER') navigate('/teacher/dashboard');
    else navigate('/student/dashboard');
  };

  const register = async (data) => {
    await registerApi(data);
    navigate('/login');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setSessionFromResponse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
