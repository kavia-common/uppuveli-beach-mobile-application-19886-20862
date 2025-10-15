import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listBookings, deleteBooking } from '../services/bookings';
import { handleAuthRedirectIfPresent } from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * BookingsList renders a paginated list of bookings pulled from the backend API.
 * - Lists bookings with Edit and Delete actions
 * - Allows navigation to create new booking
 * - Placeholder actions for payments, notifications, and chat
 */
export default function BookingsList() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // Handle potential OAuth redirect code on entry to protected area
  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await handleAuthRedirectIfPresent();
      if (!ignore && res.ok) {
        // no-op; token stored
      }
    })();
    return () => { ignore = true; };
  }, []);

  const load = useCallback(async () => {
    setBusy(true);
    setError('');
    const { ok, data, error: err } = await listBookings({ limit: 50 });
    if (!ok) {
      setError(err || 'Failed to load bookings');
      setItems([]);
    } else {
      // Accept either data as array or wrapped object
      const arr = Array.isArray(data) ? data : (data?.data ?? []);
      setItems(arr || []);
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const onEdit = useCallback((id) => {
    if (!id) return;
    navigate(`/bookings/${id}`);
  }, [navigate]);

  const onDelete = useCallback(async (id) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    const prev = items;
    setItems(prev.filter((x) => x.id !== id));
    const { ok, error: err } = await deleteBooking(id);
    if (!ok) {
      // revert
      setItems(prev);
      setError(err || 'Delete failed');
    }
  }, [items]);

  const rows = useMemo(() => {
    if (!items?.length) return (
      <tr>
        <td colSpan={7} style={{ textAlign: 'center', padding: 16, color: '#666' }}>
          No bookings found.
        </td>
      </tr>
    );
    return items.map((b) => (
      <tr key={b.id}>
        <td>{b.id}</td>
        <td>{b.userId || '-'}</td>
        <td>{b.roomId || '-'}</td>
        <td>{b.checkIn || '-'}</td>
        <td>{b.checkOut || '-'}</td>
        <td>
          <span style={getStatusBadge(b.status)}>{b.status || '-'}</span>
        </td>
        <td>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onEdit(b.id)}
              style={actionBtnPrimary}
              title="Edit booking"
            >
              Edit
            </button>
            <button onClick={() => onDelete(b.id)} style={actionBtnDanger} title="Delete booking">
              Delete
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [items, onEdit, onDelete]);

  return (
    <div style={container}>
      <div style={headerRow}>
        <h2 style={{ margin: 0 }}>Bookings</h2>
        <div>
          <button onClick={() => setRefreshKey((x) => x + 1)} style={secondaryBtn} disabled={busy}>
            {busy ? 'Loading...' : 'Refresh'}
          </button>
          <button onClick={() => navigate('/bookings/new')} style={primaryBtn}>
            + New Booking
          </button>
        </div>
      </div>

      {error ? (
        <div style={errorBox}>
          {error}
        </div>
      ) : null}

      {busy ? (
        <div style={{ padding: 16 }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>Room ID</th>
                <th style={thStyle}>Check-in</th>
                <th style={thStyle}>Check-out</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: '#6c757d' }}>
        Tip: Backend supports GET /api/v1/bookings with Bearer auth. Check .env config if requests fail.
      </div>
      <div style={{ marginTop: 8 }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  const base = { padding: '4px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600 };
  switch (status) {
    case 'booked':
      return { ...base, backgroundColor: '#cfe2ff', color: '#084298' };
    case 'checked_in':
      return { ...base, backgroundColor: '#d1e7dd', color: '#0f5132' };
    case 'checked_out':
      return { ...base, backgroundColor: '#e2e3e5', color: '#41464b' };
    case 'cancelled':
      return { ...base, backgroundColor: '#f8d7da', color: '#842029' };
    default:
      return { ...base, backgroundColor: '#e9ecef', color: '#495057' };
  }
}

const container = { padding: 24, maxWidth: 1100, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 };
const primaryBtn = { backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginLeft: 8, cursor: 'pointer' };
const secondaryBtn = { backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginLeft: 8, cursor: 'pointer' };
const actionBtnPrimary = { backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 13 };
const actionBtnDanger = { backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', fontSize: 13 };
const table = { width: '100%', borderCollapse: 'collapse', marginTop: 8 };
const thStyle = { textAlign: 'left', padding: 12, borderBottom: '2px solid #dee2e6', fontWeight: 600, fontSize: 14 };
const errorBox = { backgroundColor: '#fdecea', color: '#b71c1c', border: '1px solid #f5c2c7', padding: 12, borderRadius: 6, marginBottom: 12 };
