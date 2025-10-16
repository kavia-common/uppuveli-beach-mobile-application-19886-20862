import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';

const PAGE_SIZE = 10;

// PUBLIC_INTERFACE
/**
 * Boutique items list page with search, pagination, and delete.
 * @returns {JSX.Element}
 */
const BoutiquePage = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const retryBtnRef = useRef(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(endpoints.boutique.list());
      setData(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load boutique items');
      setTimeout(() => retryBtnRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const filteredList = (data || []).filter((i) => {
      const matchesQ =
        !q ||
        i.name?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        String(i.id).includes(q);
      return matchesQ;
    });
    setFiltered(filteredList);
    setPage(1);
  }, [data, query]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length]);
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const onDelete = async (id) => {
    const prev = [...data];
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setData(prev.filter((i) => i.id !== id));
    try {
      await apiClient.delete(endpoints.boutique.delete(id));
    } catch (e) {
      setData(prev);
      alert(e?.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) return <LoadingSpinner message="Loading boutique items..." />;

  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Boutique</h2>
        <p className="welcome-description">
          Manage boutique items and inventory
        </p>
      </div>

      <div className="toolbar" role="search" style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <input
          aria-label="Search items"
          placeholder="Search by ID, name, or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button aria-label="Add item" className="btn btn-primary" onClick={() => navigate('/boutique/new')}>
          Add Item
        </button>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table" aria-label="Boutique items table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th aria-label="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((i) => (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.price}</td>
                <td>{i.stock}</td>
                <td>
                  <Link aria-label={`View item ${i.id}`} to={`/boutique/${i.id}`}>View</Link>
                  {' | '}
                  <button className="btn btn-danger" aria-label={`Delete item ${i.id}`} onClick={() => onDelete(i.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav aria-label="Boutique pagination" className="pagination" style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span aria-live="polite" style={{ padding: '0 8px' }}>
          Page {page} of {totalPages}
        </span>
        <button
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default BoutiquePage;
