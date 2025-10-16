import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiLogIn } from 'react-icons/fi';
import config from './config/config';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component for Web Admin Panel
 * Provides the base layout and shell for the admin interface
 * Reads configuration from environment and displays routing-ready structure
 * @returns {JSX.Element} The main application component
 */
function App() {
  return (
    <div className="App">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="logo-section">
            <h1 className="admin-title">Uppuveli Beach Admin</h1>
            <span className="admin-subtitle">Hotel Management Portal</span>
          </div>
          <nav className="admin-nav">
            <Link to="/login" className="nav-link">
              <FiLogIn className="nav-icon" />
              Login
            </Link>
            <Link to="/settings" className="nav-link">
              <FiSettings className="nav-icon" />
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          <div className="welcome-section">
            <h2 className="welcome-title">Welcome to Admin Panel</h2>
            <p className="welcome-description">
              Manage bookings, loyalty programs, analytics, payments, and guest communications.
            </p>
          </div>

          <div className="config-info">
            <h3 className="config-title">Configuration Status</h3>
            <div className="config-grid">
              <div className="config-item">
                <span className="config-label">API Base URL:</span>
                <span className="config-value">{config.apiBaseUrl}</span>
              </div>
              <div className="config-item">
                <span className="config-label">OAuth Authorization:</span>
                <span className="config-value">{config.oauthAuthorizationUrl}</span>
              </div>
              <div className="config-item">
                <span className="config-label">OAuth Token URL:</span>
                <span className="config-value">{config.oauthTokenUrl}</span>
              </div>
              <div className="config-item">
                <span className="config-label">Client ID:</span>
                <span className="config-value">
                  {config.oauthClientId ? '✓ Configured' : '⚠ Not configured'}
                </span>
              </div>
              <div className="config-item">
                <span className="config-label">Redirect URI:</span>
                <span className="config-value">{config.oauthRedirectUri}</span>
              </div>
            </div>
          </div>

          <div className="action-section">
            <Link to="/login" className="btn btn-primary">
              Proceed to Login
            </Link>
          </div>
        </div>
      </main>

      <footer className="admin-footer">
        <p>&copy; 2024 Uppuveli Beach by DSK. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
