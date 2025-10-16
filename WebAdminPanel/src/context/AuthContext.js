/**
 * Auth Context
 * Provides authentication state and methods throughout the app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * Auth Provider component
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async () => {
    await authService.initiateLogin();
  };

  const handleCallback = async (code) => {
    try {
      await authService.handleCallback(code);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    handleCallback,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
