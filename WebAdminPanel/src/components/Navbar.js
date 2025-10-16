/**
 * Navbar Component
 * Displays top navigation bar with logo, user info, and logout
 */

import React from 'react';
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
  const { user } = useAuth();

  // Extract user display name from user object
  const getUserDisplayName = () => {
    if (!user) return 'Admin User';
    return user.name || user.email || user.username || 'Admin User';
  };

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="logo-section">
          <h1 className="admin-title">Uppuveli Beach Admin</h1>
          <span className="admin-subtitle">Hotel Management Portal</span>
        </div>
        
        <div className="navbar-right">
          <div className="user-info">
            <FiUser className="user-icon" />
            <span className="user-name">{getUserDisplayName()}</span>
          </div>
          
          <button onClick={onLogout} className="logout-btn" title="Logout">
            <FiLogOut className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
