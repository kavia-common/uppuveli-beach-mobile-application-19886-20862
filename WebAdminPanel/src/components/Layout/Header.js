/**
 * Header Component
 * Top navigation bar with user info and logout
 */
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

// PUBLIC_INTERFACE
/**
 * Header component with user actions
 */
const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Admin Dashboard</h1>
        <div className="header-actions">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
