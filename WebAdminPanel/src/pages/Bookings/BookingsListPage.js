/**
 * Bookings List Page
 * Lists all bookings with actions
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingsService from '../../services/bookingsService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './BookingsListPage.css';

// PUBLIC_INTERFACE
/**
 * Bookings list page component
 */
const BookingsListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsService.getAll();
      setBookings(data);
    } catch (err) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await bookingsService.delete(id);
        fetchBookings();
      } catch (err) {
        alert('Failed to delete booking');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading bookings..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBookings} />;
  }

  return (
    <div className="bookings-list-page">
      <div className="page-header">
        <h1>Bookings</h1>
        <button className="btn-primary" onClick={() => navigate('/bookings/new')}>
          New Booking
        </button>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest Name</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.guestName}</td>
                  <td>{booking.roomNumber}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action btn-view"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsListPage;
