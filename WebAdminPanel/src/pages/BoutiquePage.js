/**
 * Boutique Page Component
 * Lists and manages boutique items
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Boutique items list page
 * @returns {JSX.Element} Boutique page component
 */
const BoutiquePage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Boutique</h2>
        <p className="welcome-description">
          Manage boutique items and inventory
        </p>
      </div>
    </div>
  );
};

export default BoutiquePage;
