import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage';
import LoginSignupComponent from './SignUp/LoginSignupComponent';
import Dashboard from './Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TrackerComponent from './TrackerComponent';
import GoalsComponent from './GoalsComponent';
import InsightsComponent from './InsightsComponent';
import SettingsComponent from './SettingsComponent';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginSignupComponent />} />
      <Route path="/get-started" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tracker" element={<ProtectedRoute><TrackerComponent /></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><GoalsComponent /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><InsightsComponent /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsComponent /></ProtectedRoute>} />
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
