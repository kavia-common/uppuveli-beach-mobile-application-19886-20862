/**
 * Main Layout Component
 * Wraps pages with sidebar and header
 */
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

// PUBLIC_INTERFACE
/**
 * Main layout component that provides the app structure
 */
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
