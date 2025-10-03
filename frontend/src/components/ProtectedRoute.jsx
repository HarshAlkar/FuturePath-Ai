import React from 'react';
import { Navigate } from 'react-router-dom';
import UserContextService from '../services/UserContextService';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = UserContextService.getUser();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs to complete onboarding (only for new users)
  if (!UserContextService.hasCompletedOnboarding() && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

export default ProtectedRoute;