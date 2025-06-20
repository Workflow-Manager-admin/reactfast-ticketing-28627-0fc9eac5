import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./api/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TicketsPage from "./pages/Tickets";
import ProfilePage from "./pages/Profile";

// Set CSS color variables
document.documentElement.style.setProperty('--primary', '#1976d2');
document.documentElement.style.setProperty('--accent', '#ff9800');
document.documentElement.style.setProperty('--secondary', '#424242');
document.body.style.background = "#f7fafd";

// PUBLIC_INTERFACE
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{padding:90,textAlign:'center'}}>Loading...</div>;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/tickets" element={isAuthenticated ? <TicketsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        {/* fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Route>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
    </Routes>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;