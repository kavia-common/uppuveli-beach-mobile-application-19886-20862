/**
 * Private Route Component
 * Protects routes that require authentication
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './Common/LoadingSpinner';

// PUBLIC_INTERFACE
/**
 * PrivateRoute component that protects routes requiring authentication
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
