/**
 * Layout Component
 * Provides consistent layout with navigation for authenticated pages
 * Includes header with navigation and logout functionality
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiAward, 
  FiCreditCard, 
  FiBell, 
  FiMessageSquare, 
  FiShoppingBag, 
  FiBarChart2,
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Layout wrapper for authenticated pages
 * Provides navigation sidebar/header and main content area
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main area
 * @returns {JSX.Element} Layout component
 */
const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="logo-section">
            <h1 className="admin-title">Uppuveli Beach Admin</h1>
            <span className="admin-subtitle">Hotel Management Portal</span>
          </div>
          <nav className="admin-nav">
            <Link to="/dashboard" className="nav-link">
              <FiHome className="nav-icon" />
              Dashboard
            </Link>
            <Link to="/bookings" className="nav-link">
              <FiCalendar className="nav-icon" />
              Bookings
            </Link>
            <Link to="/loyalty" className="nav-link">
              <FiAward className="nav-icon" />
              Loyalty
            </Link>
            <Link to="/payments" className="nav-link">
              <FiCreditCard className="nav-icon" />
              Payments
            </Link>
            <Link to="/notifications" className="nav-link">
              <FiBell className="nav-icon" />
              Notifications
            </Link>
            <Link to="/chat" className="nav-link">
              <FiMessageSquare className="nav-icon" />
              Chat
            </Link>
            <Link to="/boutique" className="nav-link">
              <FiShoppingBag className="nav-icon" />
              Boutique
            </Link>
            <Link to="/analytics" className="nav-link">
              <FiBarChart2 className="nav-icon" />
              Analytics
            </Link>
            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <FiLogOut className="nav-icon" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        {children}
      </main>

      <footer className="admin-footer">
        <p>&copy; 2024 Uppuveli Beach by DSK. All rights reserved. {user && `| Logged in as: ${user.email || user.name || 'Admin'}`}</p>
      </footer>
    </div>
  );
};

export default Layout;
