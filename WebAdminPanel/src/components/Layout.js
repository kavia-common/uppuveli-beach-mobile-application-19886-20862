/**
 * Layout Component
 * Provides consistent layout with navigation for authenticated pages
 * Composes Navbar, Sidebar, and main content area
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

// PUBLIC_INTERFACE
/**
 * Layout wrapper for authenticated pages
 * Provides navigation structure with Navbar, Sidebar, and main content area
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
    <div className="layout-container">
      <Navbar onLogout={handleLogout} />
      
      <div className="layout-main">
        <Sidebar />
        
        <main className="layout-content">
          {children}
        </main>
      </div>
      
      <footer className="admin-footer">
        <p>
          &copy; 2024 Uppuveli Beach by DSK. All rights reserved.
          {user && ` | Logged in as: ${user.email || user.name || 'Admin'}`}
        </p>
      </footer>
    </div>
  );
};

export default Layout;
