/**
 * Loyalty Detail Page Component
 * Shows detailed information for a specific loyalty account
 */

import React from 'react';
import { useParams } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * Loyalty account detail page
 * @returns {JSX.Element} Loyalty detail page component
 */
const LoyaltyDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Loyalty Account Details</h2>
        <p className="welcome-description">
          Details for loyalty account ID: {id}
        </p>
      </div>
    </div>
  );
};

export default LoyaltyDetailPage;
