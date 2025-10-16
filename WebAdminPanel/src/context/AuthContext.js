/**
 * Authentication Context Provider
 * Provides global authentication state and methods throughout the application
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  login as authLogin,
  logout as authLogout,
  getUser,
  getAccessToken,
  isAuthenticated as checkAuth,
  isTokenExpired,
  refreshToken as doRefreshToken,
} from '../services/authService';

// Create the authentication context
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value with user, isAuthenticated, accessToken, login, logout
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * Authentication Provider Component
 * Wraps the application to provide authentication state and methods
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize authentication state from localStorage on mount
   */
  const didInitRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAccessToken();
        let authenticated = !!token && !isTokenExpired();

        // If token exists but is expired/near expiry, attempt a single refresh
        if (token && isTokenExpired()) {
          try {
            const newToken = await doRefreshToken();
            if (newToken) {
              authenticated = true;
            }
          } catch (e) {
            authenticated = false;
          }
        }

        setIsAuthenticated(authenticated);

        if (authenticated) {
          const storedUser = getUser();
          const activeToken = getAccessToken();
          setUser(storedUser);
          setAccessToken(activeToken);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (!didInitRef.current) {
      didInitRef.current = true;
      void initializeAuth();
    }
  }, []);

  /**
   * Listen for storage events to sync auth state across tabs
   */
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' || e.key === 'user') {
        const authenticated = checkAuth();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const storedUser = getUser();
          const token = getAccessToken();
          setUser(storedUser);
          setAccessToken(token);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Initiates login by redirecting to OAuth2 authorization page
   */
  const login = useCallback(() => {
    authLogin();
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Logs out the user and clears authentication state
   */
  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setAccessToken(null);
    setIsAuthenticated(false);
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Updates authentication state after successful login
   * Called after handleAuthCallback completes
   * @param {Object} authData - Authentication data containing user and tokens
   */
  const setAuthData = useCallback((authData) => {
    if (authData.user) {
      setUser(authData.user);
    }
    if (authData.accessToken) {
      setAccessToken(authData.accessToken);
    }
    setIsAuthenticated(true);
  }, []);

  // Context value provided to consumers
  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAuthData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
