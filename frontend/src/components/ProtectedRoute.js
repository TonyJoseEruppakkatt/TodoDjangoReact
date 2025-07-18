import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/api';

const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
