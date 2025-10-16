import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import endpoints from '../services/endpoints';
import './Bookings.css'; // reuse styles

// PUBLIC_INTERFACE
/**
 * Payments page with processing form and simple in-session list.
 * @returns {JSX.Element}
 */
const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [filters, setFilters] = useState({ status: '', method: '', dateFrom: '', dateTo: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    method: 'card',
    status: 'pending',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // No GET /payments in spec; initialize empty history
    setPayments([]);
  }, []);
  useEffect(() => {
    let filtered = [...payments];
    if (filters.status) filtered = filtered.filter((p) => p.status === filters.status);
    if (filters.method) filtered = filtered.filter((p) => p.method === filters.method);
    if (filters.dateFrom) filtered = filtered.filter((p) => new Date(p.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) filtered = filtered.filter((p) => new Date(p.createdAt) <= new Date(filters.dateTo));
    setFilteredPayments(filtered);
  }, [payments, filters]);

  const validateForm = () => {
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = 'Valid amount required';
    if (!formData.currency) errs.currency = 'Currency required';
    if (!formData.method) errs.method = 'Method required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleFormChange = (k, v) => {
    setFormData((s) => ({ ...s, [k]: v }));
    if (formErrors[k]) setFormErrors((e) => ({ ...e, [k]: '' }));
  };
  const resetForm = () => {
    setFormData({ amount: '', currency: 'USD', method: 'card', status: 'pending' });
    setFormErrors({});
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setProcessingPayment(true);
    setError('');
    setSuccessMessage('');
    try {
      const payload = {
        amount: Number(formData.amount),
        currency: formData.currency,
        method: formData.method,
        status: 'pending',
      };
      const res = await apiClient.post(endpoints.payments.create(), payload);
      const entry = { ...res.data, createdAt: new Date().toISOString() };
      setPayments((prev) => [entry, ...prev]);
      setSuccessMessage('Payment processed successfully.');
      resetForm();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to process payment.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatAmount = (amount, currency) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <LoadingSpinner message="Loading payments..." />;

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <div className="header-title-section">
          <h2 className="page-title">Payment Processing</h2>
          <p className="page-subtitle">Process payments and view transaction history</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      {successMessage && (
        <div role="status" aria-live="polite" style={{ marginBottom: 12 }}>
          {successMessage}
        </div>
      )}

      <div className="filters-section" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Process New Payment</h3>
        <form onSubmit={handleProcessPayment}>
          <div className="filters-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="filter-field">
              <label>Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                className={`filter-input ${formErrors.amount ? 'input-error' : ''}`}
                placeholder="0.00"
                aria-label="Amount"
              />
              {formErrors.amount && <span className="error-text">{formErrors.amount}</span>}
            </div>
            <div className="filter-field">
              <label>Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => handleFormChange('currency', e.target.value)}
                className={`filter-select ${formErrors.currency ? 'input-error' : ''}`}
                aria-label="Currency"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="LKR">LKR</option>
              </select>
              {formErrors.currency && <span className="error-text">{formErrors.currency}</span>}
            </div>
            <div className="filter-field">
              <label>Payment Method *</label>
              <select
                value={formData.method}
                onChange={(e) => handleFormChange('method', e.target.value)}
                className={`filter-select ${formErrors.method ? 'input-error' : ''}`}
                aria-label="Payment method"
              >
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
              {formErrors.method && <span className="error-text">{formErrors.method}</span>}
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={processingPayment} aria-label="Process payment">
              {processingPayment ? 'Processing...' : 'Process Payment'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={processingPayment}>
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <div className="bookings-header" style={{ marginTop: '2rem' }}>
        <div className="header-title-section">
          <h3 className="page-title" style={{ fontSize: '1.5rem' }}>Payment History</h3>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-field">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Method</label>
              <select
                value={filters.method}
                onChange={(e) => setFilters((s) => ({ ...s, method: e.target.value }))}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters((s) => ({ ...s, dateFrom: e.target.value }))}
                className="filter-input"
              />
            </div>
            <div className="filter-field">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters((s) => ({ ...s, dateTo: e.target.value }))}
                className="filter-input"
              />
            </div>
          </div>
          <button className="btn btn-link" onClick={() => setFilters({ status: '', method: '', dateFrom: '', dateTo: '' })}>
            Clear Filters
          </button>
        </div>
      )}

      <div className="bookings-table-container">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <h3>No payments found</h3>
            <p>{payments.length === 0 ? 'Process your first payment to see it here.' : 'Try adjusting your filters.'}</p>
          </div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td><strong>{formatAmount(p.amount, p.currency)}</strong></td>
                  <td>{p.method}</td>
                  <td>{p.status}</td>
                  <td>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
