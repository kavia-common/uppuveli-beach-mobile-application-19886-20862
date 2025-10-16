/**
 * Notifications Page Component
 * Manages guest notifications and communications
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Notifications management page
 * @returns {JSX.Element} Notifications page component
 */
const NotificationsPage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Notifications</h2>
        <p className="welcome-description">
          Send and manage guest notifications
        </p>
      </div>
    </div>
  );
};

export default NotificationsPage;
