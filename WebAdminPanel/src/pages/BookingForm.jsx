import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createBooking, getBooking, updateBooking } from '../services/bookings';
import { handleAuthRedirectIfPresent } from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * BookingForm provides a form to create or edit a booking.
 * Fields are aligned with backend admin API schema (camelCase).
 * Supports both /bookings/new (create) and /bookings/:id (edit) routes.
 */
export default function BookingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [status, setStatus] = useState('booked');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');

  // Handle OAuth redirect in case form was target of callback
  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await handleAuthRedirectIfPresent();
      if (!ignore && res.ok) {
        // token stored
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Load existing booking if editing
  useEffect(() => {
    if (!isEdit) return;
    let ignore = false;
    (async () => {
      setLoading(true);
      setError('');
      const { ok, data, error: err } = await getBooking(id);
      if (!ignore) {
        if (ok && data) {
          setUserId(String(data.userId || ''));
          setRoomId(String(data.roomId || ''));
          setCheckIn(data.checkIn || '');
          setCheckOut(data.checkOut || '');
          setStatus(data.status || 'booked');
        } else {
          setError(err || 'Failed to load booking');
        }
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id, isEdit]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (busy || loading) return;
    setBusy(true);
    setError('');

    // Backend expects camelCase and integer IDs
    const payload = {
      userId: parseInt(userId, 10),
      roomId: parseInt(roomId, 10),
      checkIn,
      checkOut,
      status,
    };

    if (isNaN(payload.userId) || isNaN(payload.roomId)) {
      setError('User ID and Room ID must be valid numbers');
      setBusy(false);
      return;
    }

    const { ok, error: err } = isEdit 
      ? await updateBooking(id, payload)
      : await createBooking(payload);

    setBusy(false);
    if (!ok) {
      setError(err || `Failed to ${isEdit ? 'update' : 'create'} booking`);
      return;
    }
    navigate('/bookings', { replace: true });
  }, [busy, loading, userId, roomId, checkIn, checkOut, status, navigate, isEdit, id]);

  if (loading) {
    return (
      <div style={container}>
        <h2>{isEdit ? 'Edit' : 'Create'} Booking</h2>
        <div style={{ padding: 24 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={container}>
      <h2>{isEdit ? 'Edit' : 'Create'} Booking</h2>

      {error ? <div style={errorBox}>{error}</div> : null}

      <form onSubmit={onSubmit} style={formStyle}>
        <label style={labelStyle}>
          User ID
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            min="1"
            style={inputStyle}
            placeholder="e.g., 1"
          />
        </label>

        <label style={labelStyle}>
          Room ID
          <input
            type="number"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            min="1"
            style={inputStyle}
            placeholder="e.g., 101"
          />
        </label>

        <label style={labelStyle}>
          Check-in
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Check-out
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            <option value="booked">booked</option>
            <option value="checked_in">checked_in</option>
            <option value="checked_out">checked_out</option>
            <option value="cancelled">cancelled</option>
          </select>
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button type="submit" disabled={busy} style={primaryBtn}>
            {busy ? 'Saving...' : isEdit ? 'Update Booking' : 'Save Booking'}
          </button>
          <Link to="/bookings" style={linkBtn}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

const container = { padding: 24, maxWidth: 720, margin: '0 auto' };
const formStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 12 };
const labelStyle = { display: 'grid', gap: 6, fontWeight: 600, fontSize: 14 };
const inputStyle = { padding: '10px 12px', borderRadius: 6, border: '1px solid #ced4da', fontSize: 14 };
const primaryBtn = { backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 14px', cursor: 'pointer' };
const linkBtn = { display: 'inline-block', padding: '10px 14px', borderRadius: 6, border: '1px solid #6c757d', color: '#6c757d', textDecoration: 'none' };
const errorBox = { backgroundColor: '#fdecea', color: '#b71c1c', border: '1px solid #f5c2c7', padding: 12, borderRadius: 6, marginBottom: 12 };
