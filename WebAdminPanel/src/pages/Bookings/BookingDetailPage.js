/**
 * Booking Detail Page
 * Displays details of a single booking
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingsService from '../../services/bookingsService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './BookingDetailPage.css';

// PUBLIC_INTERFACE
/**
 * Booking detail page component
 */
const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsService.getById(id);
      setBooking(data);
    } catch (err) {
      setError(err.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  if (loading) {
    return <LoadingSpinner message="Loading booking..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBooking} />;
  }

  if (!booking) {
    return <ErrorMessage message="Booking not found" />;
  }

  return (
    <div className="booking-detail-page">
      <div className="page-header">
        <h1>Booking Details</h1>
        <div>
          <button className="btn-secondary" onClick={() => navigate('/bookings')}>
            Back to List
          </button>
          <button className="btn-primary" onClick={() => navigate(`/bookings/${id}/edit`)}>
            Edit
          </button>
        </div>
      </div>
      <div className="detail-card">
        <div className="detail-row">
          <label>Booking ID:</label>
          <span>{booking.id}</span>
        </div>
        <div className="detail-row">
          <label>Guest Name:</label>
          <span>{booking.guestName}</span>
        </div>
        <div className="detail-row">
          <label>Room Number:</label>
          <span>{booking.roomNumber}</span>
        </div>
        <div className="detail-row">
          <label>Check In:</label>
          <span>{new Date(booking.checkIn).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <label>Check Out:</label>
          <span>{new Date(booking.checkOut).toLocaleString()}</span>
        </div>
        <div className="detail-row">
          <label>Status:</label>
          <span className={`status-badge status-${booking.status}`}>
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
