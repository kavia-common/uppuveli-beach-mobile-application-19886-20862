import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';

// PUBLIC_INTERFACE
/**
 * Boutique item detail page with CRUD operations.
 * @returns {JSX.Element}
 */
const BoutiqueDetailPage = () => {
  const { id } = useParams();
  const isNew = id === 'new';
  const [item, setItem] = useState({ name: '', description: '', price: 0, stock: 0 });
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const retryBtnRef = useRef(null);
  const firstErrorRef = useRef(null);

  useEffect(() => {
    if (isNew) return;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiClient.get(endpoints.boutique.detail(id));
        setItem(res.data);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load item');
        setTimeout(() => retryBtnRef.current?.focus(), 0);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, isNew]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...item, price: Number(item.price), stock: Number(item.stock) };
      if (isNew) {
        const res = await apiClient.post(endpoints.boutique.create(), payload);
        navigate(`/boutique/${res.data.id}`);
      } else {
        const res = await apiClient.put(endpoints.boutique.update(id), payload);
        setItem(res.data);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to save item';
      setError(msg);
      setTimeout(() => {
        (firstErrorRef.current || retryBtnRef.current)?.focus();
      }, 0);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (isNew) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeleting(true);
    try {
      await apiClient.delete(endpoints.boutique.delete(id));
      navigate('/boutique');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading item..." />;

  if (error)
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">{isNew ? 'New Boutique Item' : `Item #${item.id}`}</h2>
      </div>
      <form onSubmit={onSave} aria-label="Boutique item form">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            aria-label="Item name"
            value={item.name || ''}
            onChange={(e) => setItem((s) => ({ ...s, name: e.target.value }))}
            required
            ref={firstErrorRef}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            aria-label="Item description"
            value={item.description || ''}
            onChange={(e) => setItem((s) => ({ ...s, description: e.target.value }))}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input
            id="price"
            aria-label="Item price"
            type="number"
            step="0.01"
            value={item.price}
            onChange={(e) => setItem((s) => ({ ...s, price: e.target.value }))}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            aria-label="Item stock"
            type="number"
            value={item.stock}
            onChange={(e) => setItem((s) => ({ ...s, stock: e.target.value }))}
            required
          />
        </div>

        <div className="form-actions" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" type="submit" aria-label="Save item" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          {!isNew && (
            <button type="button" className="btn btn-danger" aria-label="Delete item" onClick={onDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BoutiqueDetailPage;
