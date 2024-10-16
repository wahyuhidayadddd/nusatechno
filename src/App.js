// src/Main.js
import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import Login from './views/auth/Login'; // Import your Login component

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = (username) => {
    setIsAuthenticated(true); // Simulate a successful login
    console.log('User logged in:', username);
    navigate('/admin/default'); // Redirect to admin dashboard
  };

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        {/* If the user is authenticated, show admin routes; otherwise, show login */}
        <Route
          path="/admin/*"
          element={isAuthenticated ? <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} /> : <Navigate to="/login" />}
        />
        <Route
          path="/rtl/*"
          element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Login route */}
      </Routes>
    </ChakraProvider>
  );
}
