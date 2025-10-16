/**
 * Login Page
 * Handles OAuth2 login and callback
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import './LoginPage.css';

// PUBLIC_INTERFACE
/**
 * Login page component
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, handleCallback, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Extract code from search params
  const code = searchParams.get('code');

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    // Check if this is a callback from OAuth provider
    if (code) {
      setLoading(true);
      handleCallback(code)
        .then((success) => {
          if (success) {
            navigate('/dashboard');
          } else {
            setError('Authentication failed. Please try again.');
          }
        })
        .catch(() => {
          setError('Authentication failed. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [code, handleCallback, isAuthenticated, navigate]);

  const handleLogin = () => {
    setError(null);
    login();
  };

  if (loading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Uppuveli Beach Admin</h1>
          <p>Sign in to manage your hotel operations</p>
        </div>
        {error && (
          <div className="login-error">
            <p>{error}</p>
          </div>
        )}
        <button className="btn-login" onClick={handleLogin}>
          Sign In with OAuth2
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
