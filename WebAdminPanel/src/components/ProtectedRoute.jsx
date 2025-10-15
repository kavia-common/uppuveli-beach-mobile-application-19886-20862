import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute guards child routes/components and redirects to /login if not authenticated.
 * It preserves the intended destination in location state for post-login navigation.
 */
export default function ProtectedRoute({ children }) {
  const authed = isAuthenticated();
  const location = useLocation();

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
