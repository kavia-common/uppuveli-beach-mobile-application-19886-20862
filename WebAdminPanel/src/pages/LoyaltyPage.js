/**
 * Loyalty Page Component
 * Lists and manages loyalty accounts
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Loyalty accounts list page
 * @returns {JSX.Element} Loyalty page component
 */
const LoyaltyPage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Loyalty Programs</h2>
        <p className="welcome-description">
          Manage customer loyalty accounts and rewards
        </p>
      </div>
    </div>
  );
};

export default LoyaltyPage;
