import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme'; 
import { useState, useEffect } from 'react';
import Login from './views/auth/Login'; 

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  ); // Ambil status dari localStorage
  const navigate = useNavigate(); 

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Set ke localStorage
    console.log('User logged in:', username);
    navigate('/admin/main-dashboard'); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Hapus dari localStorage
    console.log('User logged out');
    navigate('/login'); // Arahkan ke halaman login
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Arahkan ke login jika belum login
    }
  }, [isAuthenticated, navigate]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/rtl/*"
          element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </ChakraProvider>
  );
}
