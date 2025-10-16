/**
 * Booking Detail Page Component
 * Shows detailed information for a specific booking with edit capability
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiSave, 
  FiX,
  FiCalendar,
  FiUser,
  FiHome,
  FiClock
} from 'react-icons/fi';
import './Bookings.css';

// PUBLIC_INTERFACE
/**
 * Booking detail page with view and edit functionality
 * Loads booking via GET /bookings/{id} and allows saving changes via PUT /bookings/{id}
 * @returns {JSX.Element} Booking detail page component
 */
const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form data for editing
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: 'booked',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  /**
   * Fetch booking details from API
   * @private
   */
  const fetchBookingDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      setBooking(response.data);
      setFormData({
        guestName: response.data.guestName,
        roomNumber: response.data.roomNumber,
        checkIn: response.data.checkIn.split('T')[0],
        checkOut: response.data.checkOut.split('T')[0],
        status: response.data.status,
      });
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError(err.response?.data?.message || 'Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate form data
   * @private
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.guestName.trim()) {
      errors.guestName = 'Guest name is required';
    }

    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Room number is required';
    }

    if (!formData.checkIn) {
      errors.checkIn = 'Check-in date is required';
    }

    if (!formData.checkOut) {
      errors.checkOut = 'Check-out date is required';
    }

    if (formData.checkIn && formData.checkOut) {
      if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        errors.checkOut = 'Check-out must be after check-in';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form field change
   * @private
   */
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Enable edit mode
   * @private
   */
  const enableEditMode = () => {
    setIsEditing(true);
    setError(null);
  };

  /**
   * Cancel edit mode and reset form
   * @private
   */
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      guestName: booking.guestName,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      status: booking.status,
    });
    setFormErrors({});
  };

  /**
   * Save changes to booking
   * @private
   */
  const saveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setSaveLoading(true);
    setError(null);

    try {
      const bookingData = {
        ...formData,
        id: booking.id,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      
      // Update local state with saved data
      setBooking(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update booking:', err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Navigate back to bookings list
   * @private
   */
  const goBack = () => {
    navigate('/bookings');
  };

  /**
   * Get status badge class
   * @private
   */
  const getStatusClass = (status) => {
    const statusMap = {
      booked: 'status-booked',
      checked_in: 'status-checked-in',
      checked_out: 'status-checked-out',
      cancelled: 'status-cancelled',
    };
    return statusMap[status] || 'status-default';
  };

  /**
   * Format date for display
   * @private
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Calculate number of nights
   * @private
   */
  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." size="large" />;
  }

  if (!booking) {
    return (
      <div className="booking-detail-container">
        <ErrorMessage
          message="Booking not found"
          title="Not Found"
          type="error"
          onRetry={fetchBookingDetail}
        />
        <button className="btn btn-secondary" onClick={goBack}>
          <FiArrowLeft />
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="booking-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={goBack}>
          <FiArrowLeft />
          Back to Bookings
        </button>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={enableEditMode}>
              <FiEdit2 />
              Edit Booking
            </button>
          ) : (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={cancelEdit}
                disabled={saveLoading}
              >
                <FiX />
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={saveChanges}
                disabled={saveLoading}
              >
                <FiSave />
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Error"
          type="error"
          onDismiss={() => setError(null)}
        />
      )}

      {/* Booking Details */}
      <div className="detail-content">
        <div className="detail-card">
          <div className="card-header">
            <h2 className="card-title">Booking Information</h2>
            <span className={`status-badge ${getStatusClass(booking.status)}`}>
              {booking.status.replace('_', ' ')}
            </span>
          </div>

          <div className="detail-grid">
            {/* Guest Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiUser className="section-icon" />
                Guest Details
              </h3>
              <div className="detail-row">
                <label>Guest Name</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => handleFormChange('guestName', e.target.value)}
                      className={formErrors.guestName ? 'input-error' : ''}
                    />
                    {formErrors.guestName && (
                      <span className="error-text">{formErrors.guestName}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">{booking.guestName}</span>
                )}
              </div>
            </div>

            {/* Room Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiHome className="section-icon" />
                Room Details
              </h3>
              <div className="detail-row">
                <label>Room Number</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={formData.roomNumber}
                      onChange={(e) => handleFormChange('roomNumber', e.target.value)}
                      className={formErrors.roomNumber ? 'input-error' : ''}
                    />
                    {formErrors.roomNumber && (
                      <span className="error-text">{formErrors.roomNumber}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">{booking.roomNumber}</span>
                )}
              </div>
            </div>

            {/* Stay Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiCalendar className="section-icon" />
                Stay Details
              </h3>
              <div className="detail-row">
                <label>Check-In</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleFormChange('checkIn', e.target.value)}
                      className={formErrors.checkIn ? 'input-error' : ''}
                    />
                    {formErrors.checkIn && (
                      <span className="error-text">{formErrors.checkIn}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">{formatDate(booking.checkIn)}</span>
                )}
              </div>
              <div className="detail-row">
                <label>Check-Out</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleFormChange('checkOut', e.target.value)}
                      className={formErrors.checkOut ? 'input-error' : ''}
                    />
                    {formErrors.checkOut && (
                      <span className="error-text">{formErrors.checkOut}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">{formatDate(booking.checkOut)}</span>
                )}
              </div>
              <div className="detail-row">
                <label>
                  <FiClock className="inline-icon" />
                  Number of Nights
                </label>
                <span className="detail-value">{calculateNights()}</span>
              </div>
            </div>

            {/* Status Information */}
            <div className="detail-section">
              <h3 className="section-title">Status</h3>
              <div className="detail-row">
                <label>Booking Status</label>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="status-select"
                  >
                    <option value="booked">Booked</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`status-badge-large ${getStatusClass(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Booking ID */}
          <div className="booking-id-section">
            <label>Booking ID:</label>
            <code>{booking.id}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
