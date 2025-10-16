/**
 * Bookings Page Component
 * Lists all bookings and provides management interface
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Bookings list page
 * @returns {JSX.Element} Bookings page component
 */
const BookingsPage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Bookings</h2>
        <p className="welcome-description">
          Manage hotel room bookings and reservations
        </p>
      </div>
    </div>
  );
};

export default BookingsPage;
