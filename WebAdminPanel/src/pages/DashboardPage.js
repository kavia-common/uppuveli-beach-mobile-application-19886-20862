/**
 * Dashboard Page Component
 * Main dashboard with overview of hotel operations
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Dashboard page showing operational overview
 * @returns {JSX.Element} Dashboard page component
 */
const DashboardPage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Dashboard</h2>
        <p className="welcome-description">
          Overview of hotel operations and key metrics
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
