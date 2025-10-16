/**
 * Booking Form Page
 * Form for creating and editing bookings
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingsService from '../../services/bookingsService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './BookingFormPage.css';

// PUBLIC_INTERFACE
/**
 * Booking form page component
 */
const BookingFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: 'booked'
  });

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsService.getById(id);
      setFormData({
        guestName: data.guestName,
        roomNumber: data.roomNumber,
        checkIn: new Date(data.checkIn).toISOString().slice(0, 16),
        checkOut: new Date(data.checkOut).toISOString().slice(0, 16),
        status: data.status
      });
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchBooking();
    }
  }, [isEdit, fetchBooking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const submitData = {
      ...formData,
      id: isEdit ? id : undefined,
      checkIn: new Date(formData.checkIn).toISOString(),
      checkOut: new Date(formData.checkOut).toISOString()
    };

    try {
      if (isEdit) {
        await bookingsService.update(id, submitData);
      } else {
        await bookingsService.create(submitData);
      }
      navigate('/bookings');
    } catch (err) {
      setError(err.message || 'Failed to save booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="booking-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Booking' : 'New Booking'}</h1>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="guestName">Guest Name *</label>
            <input
              type="text"
              id="guestName"
              name="guestName"
              value={formData.guestName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roomNumber">Room Number *</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkIn">Check In *</label>
            <input
              type="datetime-local"
              id="checkIn"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkOut">Check Out *</label>
            <input
              type="datetime-local"
              id="checkOut"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="booked">Booked</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/bookings')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingFormPage;
