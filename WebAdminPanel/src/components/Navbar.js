/**
 * Navbar Component
 * Displays top navigation bar with logo, user info, and logout
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Navbar component for authenticated pages
 * Shows branding, user information from AuthContext, and logout button
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Callback function when logout is clicked
 * @returns {JSX.Element} Navbar component
 */
const Navbar = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        logout();
        navigate('/login', { replace: true });
      }
    } catch {
      // no-op
    }
  };

  // Extract user display name from user object
  const getUserDisplayName = () => {
    if (!user) return 'Admin User';
    return user.name || user.email || user.username || 'Admin User';
  };

  return (
    <header className="admin-header">
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <div className="admin-header-content">
        <div className="logo-section" aria-label="Application title">
          <h1 className="admin-title">Uppuveli Beach Admin</h1>
          <span className="admin-subtitle">Hotel Management Portal</span>
        </div>

        <div className="navbar-right">
          <div className="user-info" aria-live="polite">
            <FiUser className="user-icon" aria-hidden="true" />
            <span className="user-name">{getUserDisplayName()}</span>
          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
            title="Logout"
            aria-label="Logout"
          >
            <FiLogOut className="logout-icon" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
