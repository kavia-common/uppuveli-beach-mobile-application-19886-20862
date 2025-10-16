/**
 * Bookings Page Component
 * Lists all bookings and provides management interface with filters and CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiCalendar, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiX,
  FiEye
} from 'react-icons/fi';
import './Bookings.css';

// PUBLIC_INTERFACE
/**
 * Bookings list page with filters, create, edit, and delete functionality
 * Fetches bookings from GET /bookings and provides full CRUD operations
 * @returns {JSX.Element} Bookings page component
 */
const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: 'booked',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  /**
   * Fetch bookings from API
   * @private
   */
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/bookings');
      setBookings(response.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to bookings list
   * @private
   */
  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(booking => 
        new Date(booking.checkIn) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(booking => 
        new Date(booking.checkOut) <= new Date(filters.dateTo)
      );
    }

    setFilteredBookings(filtered);
  };

  /**
   * Handle filter change
   * @private
   */
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Clear all filters
   * @private
   */
  const clearFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
    });
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
   * Reset form data
   * @private
   */
  const resetForm = () => {
    setFormData({
      guestName: '',
      roomNumber: '',
      checkIn: '',
      checkOut: '',
      status: 'booked',
    });
    setFormErrors({});
  };

  /**
   * Open create modal
   * @private
   */
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  /**
   * Open edit modal
   * @private
   */
  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      guestName: booking.guestName,
      roomNumber: booking.roomNumber,
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      status: booking.status,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  /**
   * Open delete confirmation modal
   * @private
   */
  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  /**
   * Close all modals
   * @private
   */
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedBooking(null);
    resetForm();
  };

  /**
   * Handle create booking
   * @private
   */
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const bookingData = {
        ...formData,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      const response = await apiClient.post('/bookings', bookingData);
      
      // Optimistic UI update
      setBookings(prev => [...prev, response.data]);
      
      closeModals();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle update booking
   * @private
   */
  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const bookingData = {
        ...formData,
        id: selectedBooking.id,
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: new Date(formData.checkOut).toISOString(),
      };

      const response = await apiClient.put(`/bookings/${selectedBooking.id}`, bookingData);
      
      // Optimistic UI update
      setBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBooking.id ? response.data : booking
        )
      );
      
      closeModals();
    } catch (err) {
      console.error('Failed to update booking:', err);
      setError(err.response?.data?.message || 'Failed to update booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle delete booking
   * @private
   */
  const handleDeleteBooking = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/bookings/${selectedBooking.id}`);
      
      // Optimistic UI update
      setBookings(prev => prev.filter(booking => booking.id !== selectedBooking.id));
      
      closeModals();
    } catch (err) {
      console.error('Failed to delete booking:', err);
      setError(err.response?.data?.message || 'Failed to delete booking. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Navigate to booking detail page
   * @private
   */
  const viewBookingDetail = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
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
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading bookings..." size="large" />;
  }

  return (
    <div className="bookings-container">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-title-section">
          <h2 className="page-title">
            <FiCalendar className="title-icon" />
            Bookings Management
          </h2>
          <p className="page-subtitle">
            Manage hotel room bookings and reservations
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <FiPlus />
            New Booking
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Error"
          type="error"
          onDismiss={() => setError(null)}
          onRetry={fetchBookings}
        />
      )}

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-field">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Check-in From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-field">
              <label>Check-out To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <button 
            className="btn btn-link"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bookings-table-container">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <FiCalendar className="empty-icon" />
            <h3>No bookings found</h3>
            <p>
              {bookings.length === 0 
                ? 'Create your first booking to get started.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.guestName}</td>
                  <td>{booking.roomNumber}</td>
                  <td>{formatDate(booking.checkIn)}</td>
                  <td>{formatDate(booking.checkOut)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => viewBookingDetail(booking.id)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(booking)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => openDeleteModal(booking)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Booking</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateBooking}>
              <div className="modal-body">
                <div className="form-field">
                  <label>Guest Name *</label>
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
                <div className="form-field">
                  <label>Room Number *</label>
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
                <div className="form-field">
                  <label>Check-In Date *</label>
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
                <div className="form-field">
                  <label>Check-Out Date *</label>
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
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="booked">Booked</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModals}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Booking</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdateBooking}>
              <div className="modal-body">
                <div className="form-field">
                  <label>Guest Name *</label>
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
                <div className="form-field">
                  <label>Room Number *</label>
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
                <div className="form-field">
                  <label>Check-In Date *</label>
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
                <div className="form-field">
                  <label>Check-Out Date *</label>
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
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                  >
                    <option value="booked">Booked</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModals}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBooking && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the booking for{' '}
                <strong>{selectedBooking.guestName}</strong> in room{' '}
                <strong>{selectedBooking.roomNumber}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeModals}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteBooking}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
