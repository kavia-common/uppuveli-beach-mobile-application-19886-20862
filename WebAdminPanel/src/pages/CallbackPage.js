/**
 * OAuth2 Callback Page Component
 * Handles the OAuth2 callback after authorization
 * Exchanges authorization code for tokens and redirects to dashboard
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { handleAuthCallback } from '../services/authService';

// PUBLIC_INTERFACE
/**
 * OAuth2 callback handler page
 * Processes authorization code and updates authentication state
 * @returns {JSX.Element} Callback page component
 */
const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract code and state from URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');

        // Check for OAuth errors
        if (errorParam) {
          setError(`Authentication error: ${errorParam}`);
          setIsProcessing(false);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setError('Missing authorization code or state parameter');
          setIsProcessing(false);
          return;
        }

        // Exchange code for tokens
        const authData = await handleAuthCallback(code, state);

        // Update auth context with new data
        setAuthData(authData);

        // Redirect to dashboard on success
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Callback processing error:', err);
        setError(err.message || 'Failed to process authentication callback');
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams, navigate, setAuthData]);

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
            {isProcessing ? (
              <>
                <h2 className="welcome-title">Processing Login...</h2>
                <p className="welcome-description">
                  Please wait while we complete your authentication.
                </p>
              </>
            ) : error ? (
              <>
                <h2 className="welcome-title" style={{ color: 'var(--danger-color)' }}>
                  Authentication Failed
                </h2>
                <p className="welcome-description">
                  {error}
                </p>
                <div className="action-section">
                  <button
                    onClick={() => navigate('/login')}
                    className="btn btn-primary"
                  >
                    Return to Login
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        <p>&copy; 2024 Uppuveli Beach by DSK. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CallbackPage;
