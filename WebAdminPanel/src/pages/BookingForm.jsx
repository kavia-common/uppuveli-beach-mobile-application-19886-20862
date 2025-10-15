import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBooking } from '../services/bookings';
import { handleAuthRedirectIfPresent } from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * BookingForm provides a minimal form to create a new booking.
 * Fields are aligned with typical backend schemas but tolerant to variations.
 */
export default function BookingForm() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [guestId, setGuestId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [status, setStatus] = useState('booked');
  const [busy, setBusy] = useState(false);
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

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');

    // Accept either snake_case or camelCase expected by backend
    const payload = {
      room_id: roomId,
      guest_id: guestId,
      check_in: checkIn,
      check_out: checkOut,
      status,
    };

    const { ok, error: err } = await createBooking(payload);
    setBusy(false);
    if (!ok) {
      setError(err || 'Failed to create booking');
      return;
    }
    navigate('/bookings', { replace: true });
  }, [busy, roomId, guestId, checkIn, checkOut, status, navigate]);

  return (
    <div style={container}>
      <h2>Create Booking</h2>

      {error ? <div style={errorBox}>{error}</div> : null}

      <form onSubmit={onSubmit} style={formStyle}>
        <label style={labelStyle}>
          Room ID
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            style={inputStyle}
            placeholder="e.g., 101 or room-uuid"
          />
        </label>

        <label style={labelStyle}>
          Guest ID
          <input
            type="text"
            value={guestId}
            onChange={(e) => setGuestId(e.target.value)}
            required
            style={inputStyle}
            placeholder="guest identifier"
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
            {busy ? 'Saving...' : 'Save Booking'}
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

