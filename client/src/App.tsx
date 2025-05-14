import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import LoginSelector from './components/LoginSelector';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import CustomCursor from './components/CustomCursor';
import BatchCardExample from './components/BatchCardExample';

function App() {
  // Check if user is authenticated from localStorage
  const isAuthenticated = (): boolean => {
    return localStorage.getItem('user') !== null;
  };

  // Check if user has admin role
  const isAdmin = (): boolean => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    return JSON.parse(user).role === 'admin';
  };

  // Check if user has teacher role
  const isTeacher = (): boolean => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    return JSON.parse(user).role === 'teacher';
  };

  return (
    <Router>
      <CustomCursor />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSelector />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={isAdmin() ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={isAdmin() ? <Dashboard /> : <Navigate to="/admin/login" />} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/login" element={isTeacher() ? <Navigate to="/teacher/dashboard" /> : <TeacherLogin />} />
        <Route path="/teacher/dashboard" element={isTeacher() ? <TeacherDashboard /> : <Navigate to="/teacher/login" />} />
        
        {/* Batch Management Demo */}
        <Route path="/batches" element={<BatchCardExample />} />
      </Routes>
    </Router>
  );
}

export default App;
