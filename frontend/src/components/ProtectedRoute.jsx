import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();

  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 