/**
 * Payments Page
 * Manages payment operations
 */
import React, { useState } from 'react';
import paymentsService from '../services/paymentsService';
import ErrorMessage from '../components/Common/ErrorMessage';
import './PaymentsPage.css';

// PUBLIC_INTERFACE
/**
 * Payments page component
 */
const PaymentsPage = () => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    method: 'credit_card',
    status: 'pending'
  });

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
    setSuccess(false);

    try {
      await paymentsService.process(formData);
      setSuccess(true);
      setFormData({
        amount: '',
        currency: 'USD',
        method: 'credit_card',
        status: 'pending'
      });
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="payments-page">
      <h1>Process Payment</h1>
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="success-message">
          Payment processed successfully!
        </div>
      )}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency *</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="method">Payment Method *</label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
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
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Processing...' : 'Process Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentsPage;
