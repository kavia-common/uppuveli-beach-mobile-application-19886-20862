/**
 * Sidebar Component
 * Navigation sidebar for the admin panel
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

// PUBLIC_INTERFACE
/**
 * Sidebar navigation component
 */
const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bookings', label: 'Bookings', icon: '🛏️' },
    { path: '/loyalty', label: 'Loyalty', icon: '⭐' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/payments', label: 'Payments', icon: '💳' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/boutique', label: 'Boutique', icon: '🛍️' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Uppuveli Beach</h2>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
