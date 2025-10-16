/**
 * Sidebar Component
 * Provides navigation links to all protected routes
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiCalendar, 
  FiAward, 
  FiCreditCard, 
  FiBell, 
  FiMessageSquare, 
  FiShoppingBag, 
  FiBarChart2
} from 'react-icons/fi';

// PUBLIC_INTERFACE
/**
 * Sidebar navigation component
 * Displays links to all main admin sections
 * @returns {JSX.Element} Sidebar component
 */
const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/bookings', icon: FiCalendar, label: 'Bookings' },
    { path: '/loyalty', icon: FiAward, label: 'Loyalty' },
    { path: '/payments', icon: FiCreditCard, label: 'Payments' },
    { path: '/notifications', icon: FiBell, label: 'Notifications' },
    { path: '/chat', icon: FiMessageSquare, label: 'Chat' },
    { path: '/boutique', icon: FiShoppingBag, label: 'Boutique' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
