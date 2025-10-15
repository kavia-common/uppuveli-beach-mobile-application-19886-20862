import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listBookings, deleteBooking } from '../services/bookings';
import { handleAuthRedirectIfPresent } from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * BookingsList renders a paginated list of bookings pulled from the backend API.
 * - Lists bookings
 * - Allows navigation to create new booking
 * - Includes delete action (optimistic UI with fallback)
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

  const onDelete = useCallback(async (id) => {
    if (!id) return;
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
        <td colSpan={6} style={{ textAlign: 'center', padding: 16, color: '#666' }}>
          No bookings found.
        </td>
      </tr>
    );
    return items.map((b) => (
      <tr key={b.id}>
        <td>{b.id}</td>
        <td>{b.guestName || b.guest_id || b.guest || '-'}</td>
        <td>{b.roomNumber || b.room_id || b.room || '-'}</td>
        <td>{b.checkIn || b.check_in || '-'}</td>
        <td>{b.checkOut || b.check_out || '-'}</td>
        <td>{b.status || '-'}</td>
        <td>
          {/* For now, only delete action; edit can be added later */}
          <button onClick={() => onDelete(b.id)} style={actionBtnDanger}>Delete</button>
        </td>
      </tr>
    ));
  }, [items, onDelete]);

  return (
    <div style={container}>
      <div style={headerRow}>
        <h2 style={{ margin: 0 }}>Bookings</h2>
        <div>
          <button onClick={() => setRefreshKey((x) => x + 1)} style={secondaryBtn} disabled={busy}>
            Refresh
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
                <th>ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: '#6c757d' }}>
        Tip: Backend should support GET /bookings with Bearer auth. Check .env config if requests fail.
      </div>
      <div style={{ marginTop: 8 }}>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

const container = { padding: 24, maxWidth: 1100, margin: '0 auto' };
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 };
const primaryBtn = { backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginLeft: 8, cursor: 'pointer' };
const secondaryBtn = { backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', marginLeft: 8, cursor: 'pointer' };
const actionBtnDanger = { backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' };
const table = { width: '100%', borderCollapse: 'collapse' };
const errorBox = { backgroundColor: '#fdecea', color: '#b71c1c', border: '1px solid #f5c2c7', padding: 12, borderRadius: 6, marginBottom: 12 };

