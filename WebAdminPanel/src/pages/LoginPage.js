/**
 * Login Page Component
 * Handles user authentication via OAuth2
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Login page that initiates OAuth2 authorization flow
 * Redirects authenticated users to dashboard or their intended destination
 * @returns {JSX.Element} Login page component
 */
const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = () => {
    setIsRedirecting(true);
    login();
  };

  return (
    <div className="App">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="logo-section">
            <h1 className="admin-title">Uppuveli Beach Admin</h1>
            <span className="admin-subtitle">Hotel Management Portal</span>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          <div className="welcome-section">
            <h2 className="welcome-title">Admin Login</h2>
            <p className="welcome-description">
              Sign in to access the admin panel and manage hotel operations.
            </p>
          </div>

          <div className="action-section">
            <button
              onClick={handleLogin}
              className="btn btn-primary"
              aria-busy={isRedirecting}
              aria-disabled={isRedirecting}
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Redirecting to provider…' : 'Sign In with OAuth2'}
            </button>
            <p className="welcome-description" role="note">
              If nothing happens, please ensure pop-up blockers are disabled and try again.
            </p>
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        <p>&copy; 2024 Uppuveli Beach by DSK. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
