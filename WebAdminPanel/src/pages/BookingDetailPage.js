/**
 * Booking Detail Page Component
 * Shows detailed information for a specific booking
 */

import React from 'react';
import { useParams } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * Booking detail page
 * @returns {JSX.Element} Booking detail page component
 */
const BookingDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Booking Details</h2>
        <p className="welcome-description">
          Details for booking ID: {id}
        </p>
      </div>
    </div>
  );
};

export default BookingDetailPage;
