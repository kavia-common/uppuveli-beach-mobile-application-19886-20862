/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Redirects to /login if user is not authenticated
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// PUBLIC_INTERFACE
/**
 * Protected Route wrapper component
 * Checks if user is authenticated via AuthContext
 * If authenticated, renders children; otherwise redirects to /login
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @returns {JSX.Element} Children or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, accessToken } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." fullScreen={true} />;
  }

  // Check if user is authenticated and has an access token
  if (!isAuthenticated || !accessToken) {
    // Redirect to login, saving the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
