/**
 * Payments Page Component
 * Manages payment transactions and processing
 * Provides form to process new payments and displays payment history
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiCheck,
  FiX,
  FiFilter
} from 'react-icons/fi';
import './Bookings.css'; // Reusing existing styles

// PUBLIC_INTERFACE
/**
 * Payments page with payment processing form and history table
 * Posts to /payments endpoint and fetches payment history
 * @returns {JSX.Element} Payments page component
 */
const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Payment form states
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    method: 'credit_card',
    description: '',
    customerName: '',
    customerEmail: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, filters]);

  /**
   * Fetch payment history from API
   * Note: API spec shows POST /payments but no GET endpoint
   * Using mock data for history until backend provides GET endpoint
   * @private
   */
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would fetch from GET /payments if available
      // For now, using local state to track processed payments
      // Backend team should add GET /payments endpoint to API
      setPayments([]);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
      setError(err.response?.data?.message || 'Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to payments list
   * @private
   */
  const applyFilters = () => {
    let filtered = [...payments];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    // Filter by method
    if (filters.method) {
      filtered = filtered.filter(payment => payment.method === filters.method);
    }

    // Filter by date range (using created date)
    if (filters.dateFrom) {
      filtered = filtered.filter(payment => 
        new Date(payment.createdAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(payment => 
        new Date(payment.createdAt) <= new Date(filters.dateTo)
      );
    }

    setFilteredPayments(filtered);
  };

  /**
   * Handle filter change
   * @private
   */
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Clear all filters
   * @private
   */
  const clearFilters = () => {
    setFilters({
      status: '',
      method: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  /**
   * Validate payment form data
   * @private
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Valid amount is required';
    }

    if (!formData.currency.trim()) {
      errors.currency = 'Currency is required';
    }

    if (!formData.method) {
      errors.method = 'Payment method is required';
    }

    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer name is required';
    }

    if (!formData.customerEmail.trim()) {
      errors.customerEmail = 'Customer email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = 'Valid email address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form field change
   * @private
   */
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Reset payment form
   * @private
   */
  const resetForm = () => {
    setFormData({
      amount: '',
      currency: 'USD',
      method: 'credit_card',
      description: '',
      customerName: '',
      customerEmail: '',
    });
    setFormErrors({});
  };

  /**
   * Handle payment submission
   * Posts payment data to /payments endpoint
   * @private
   */
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessingPayment(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Prepare payment data according to API schema
      const paymentData = {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        method: formData.method,
        status: 'pending',
        // Additional fields for internal tracking
        metadata: {
          description: formData.description,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
        }
      };

      const response = await apiClient.post('/payments', paymentData);
      
      // Add to local state for immediate display
      const newPayment = {
        ...response.data,
        createdAt: new Date().toISOString(),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        description: formData.description,
      };
      
      setPayments(prev => [newPayment, ...prev]);
      setSuccessMessage(`Payment of ${formData.currency} ${formData.amount} processed successfully!`);
      
      // Reset form after successful submission
      resetForm();
      
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Failed to process payment:', err);
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  /**
   * Get status badge class
   * @private
   */
  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'status-booked',
      completed: 'status-checked-in',
      failed: 'status-cancelled',
      refunded: 'status-checked-out',
    };
    return statusMap[status] || 'status-default';
  };

  /**
   * Format currency amount
   * @private
   */
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  /**
   * Format date for display
   * @private
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading payments..." size="large" />;
  }

  return (
    <div className="bookings-container">
      {/* Header */}
      <div className="bookings-header">
        <div className="header-title-section">
          <h2 className="page-title">
            <FiDollarSign className="title-icon" />
            Payment Processing
          </h2>
          <p className="page-subtitle">
            Process payments and view transaction history
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Payment Error"
          type="error"
          onDismiss={() => setError(null)}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="error-message error-message-info">
          <div className="error-header">
            <div className="error-title-section">
              <FiCheck className="error-icon" />
              <h3 className="error-title">Success</h3>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)} 
              className="error-dismiss-btn"
              aria-label="Dismiss message"
            >
              <FiX />
            </button>
          </div>
          <div className="error-content">
            <p className="error-text">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Payment Processing Form */}
      <div className="filters-section" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiCreditCard />
          Process New Payment
        </h3>
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
              />
              {formErrors.amount && (
                <span className="error-text">{formErrors.amount}</span>
              )}
            </div>
            
            <div className="filter-field">
              <label>Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => handleFormChange('currency', e.target.value)}
                className={`filter-select ${formErrors.currency ? 'input-error' : ''}`}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="LKR">LKR - Sri Lankan Rupee</option>
              </select>
              {formErrors.currency && (
                <span className="error-text">{formErrors.currency}</span>
              )}
            </div>
            
            <div className="filter-field">
              <label>Payment Method *</label>
              <select
                value={formData.method}
                onChange={(e) => handleFormChange('method', e.target.value)}
                className={`filter-select ${formErrors.method ? 'input-error' : ''}`}
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
              {formErrors.method && (
                <span className="error-text">{formErrors.method}</span>
              )}
            </div>
            
            <div className="filter-field">
              <label>Customer Name *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleFormChange('customerName', e.target.value)}
                className={`filter-input ${formErrors.customerName ? 'input-error' : ''}`}
                placeholder="John Doe"
              />
              {formErrors.customerName && (
                <span className="error-text">{formErrors.customerName}</span>
              )}
            </div>
            
            <div className="filter-field">
              <label>Customer Email *</label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                className={`filter-input ${formErrors.customerEmail ? 'input-error' : ''}`}
                placeholder="john@example.com"
              />
              {formErrors.customerEmail && (
                <span className="error-text">{formErrors.customerEmail}</span>
              )}
            </div>
            
            <div className="filter-field" style={{ gridColumn: '1 / -1' }}>
              <label>Description (Optional)</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                className="filter-input"
                placeholder="Payment description or reference"
              />
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={processingPayment}
            >
              {processingPayment ? 'Processing...' : 'Process Payment'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={processingPayment}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Payment History Section */}
      <div className="bookings-header" style={{ marginTop: '2rem' }}>
        <div className="header-title-section">
          <h3 className="page-title" style={{ fontSize: '1.5rem' }}>
            Payment History
          </h3>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* History Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-field">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Payment Method</label>
              <select
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="filter-select"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
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
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-field">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <button 
            className="btn btn-link"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Payment History Table */}
      <div className="bookings-table-container">
        {filteredPayments.length === 0 ? (
          <div className="empty-state">
            <FiDollarSign className="empty-icon" />
            <h3>No payments found</h3>
            <p>
              {payments.length === 0 
                ? 'Process your first payment to see it here.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <code style={{ fontSize: '0.875rem', color: '#666' }}>
                      {payment.id}
                    </code>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500' }}>{payment.customerName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        {payment.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{formatAmount(payment.amount, payment.currency)}</strong>
                  </td>
                  <td>
                    {payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{formatDate(payment.createdAt)}</td>
                  <td>
                    {payment.description || '-'}
                  </td>
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
