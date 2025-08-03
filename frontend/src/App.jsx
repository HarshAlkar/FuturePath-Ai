import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import LoginSignupComponent from './SignUp/LoginSignupComponent';
import MainDashboard from './pages/main_dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Tracker from './pages/Tracker';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Expense_tracker from './pages/Expense_tracker';
import Investment from './pages/Investment';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AIAssistant from './components/AIAssistant';


const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignupComponent />} />
        <Route path="/get-started" element={<Navigate to="/login" replace />} />
        <Route path="/main-dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
        <Route path="/tracker" element={<ProtectedRoute><Tracker /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/expense-tracker" element={<ProtectedRoute><Expense_tracker /></ProtectedRoute>} />
        <Route path="/investment" element={<ProtectedRoute><Investment /></ProtectedRoute>} />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIAssistant />
    </>
  );
};

export default App;
