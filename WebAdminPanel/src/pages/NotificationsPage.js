/**
 * Notifications Page Component
 * Manages guest notifications and communications
 * Provides form to send notifications via POST /notifications
 * Displays history of recently sent notifications
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { FiBell, FiSend, FiClock, FiUser, FiMessageSquare } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notifications.css';

// PUBLIC_INTERFACE
/**
 * Notifications management page
 * Allows staff to send notifications to guests and view notification history
 * @returns {JSX.Element} Notifications page component
 */
const NotificationsPage = () => {
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sendingNotification, setSendingNotification] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'info',
    message: '',
    recipientId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Load notification history on mount
  useEffect(() => {
    // Initialize with empty history
    // In a real scenario, we might fetch from a GET /notifications endpoint
    // But according to the API spec, there's only POST for notifications
    setNotificationHistory([]);
  }, []);

  /**
   * Validate form data
   * @private
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.type.trim()) {
      errors.type = 'Notification type is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 500) {
      errors.message = 'Message must not exceed 500 characters';
    }

    if (!formData.recipientId.trim()) {
      errors.recipientId = 'Recipient ID is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form field change
   * @private
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Reset form to initial state
   * @private
   */
  const resetForm = () => {
    setFormData({
      type: 'info',
      message: '',
      recipientId: '',
    });
    setFormErrors({});
  };

  /**
   * Handle send notification
   * @private
   * @param {Event} e - Form submit event
   */
  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setSendingNotification(true);
    setError(null);

    try {
      // Send notification via POST /notifications
      const notificationData = {
        type: formData.type,
        message: formData.message.trim(),
        recipientId: formData.recipientId.trim(),
        status: 'sent', // Set initial status
      };

      const response = await apiClient.post('/notifications', notificationData);

      // Add to history (prepend to show most recent first)
      const newNotification = {
        ...response.data,
        timestamp: new Date().toISOString(),
      };
      setNotificationHistory(prev => [newNotification, ...prev]);

      // Show success toast
      toast.success('Notification sent successfully!');

      // Reset form
      resetForm();
    } catch (err) {
      console.error('Failed to send notification:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send notification. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSendingNotification(false);
    }
  };

  /**
   * Format timestamp for display
   * @private
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted date and time
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Get notification type badge class
   * @private
   * @param {string} type - Notification type
   * @returns {string} CSS class name
   */
  const getTypeClass = (type) => {
    const typeMap = {
      info: 'type-info',
      warning: 'type-warning',
      alert: 'type-alert',
      promotion: 'type-promotion',
      reminder: 'type-reminder',
    };
    return typeMap[type] || 'type-default';
  };

  /**
   * Get status badge class
   * @private
   * @param {string} status - Notification status
   * @returns {string} CSS class name
   */
  const getStatusClass = (status) => {
    const statusMap = {
      sent: 'status-sent',
      delivered: 'status-delivered',
      read: 'status-read',
      failed: 'status-failed',
    };
    return statusMap[status] || 'status-default';
  };

  return (
    <div className="notifications-container">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="notifications-header">
        <div className="header-title-section">
          <h2 className="page-title">
            <FiBell className="title-icon" />
            Notifications
          </h2>
          <p className="page-subtitle">
            Send notifications to guests and view notification history
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Error"
          type="error"
          onDismiss={() => setError(null)}
        />
      )}

      {/* Send Notification Form */}
      <div className="notification-form-card">
        <div className="card-header">
          <h3 className="card-title">
            <FiSend className="section-icon" />
            Send New Notification
          </h3>
        </div>
        <form onSubmit={handleSendNotification} className="notification-form">
          <div className="form-grid">
            {/* Notification Type */}
            <div className="form-field">
              <label htmlFor="type">
                Notification Type <span className="required">*</span>
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                className={formErrors.type ? 'input-error' : ''}
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
                <option value="promotion">Promotion</option>
                <option value="reminder">Reminder</option>
              </select>
              {formErrors.type && (
                <span className="error-text">{formErrors.type}</span>
              )}
            </div>

            {/* Recipient ID */}
            <div className="form-field">
              <label htmlFor="recipientId">
                Recipient ID <span className="required">*</span>
              </label>
              <input
                type="text"
                id="recipientId"
                placeholder="Enter guest ID"
                value={formData.recipientId}
                onChange={(e) => handleFormChange('recipientId', e.target.value)}
                className={formErrors.recipientId ? 'input-error' : ''}
              />
              {formErrors.recipientId && (
                <span className="error-text">{formErrors.recipientId}</span>
              )}
              <span className="field-hint">
                The unique identifier of the guest to receive this notification
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="form-field">
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              placeholder="Enter notification message..."
              value={formData.message}
              onChange={(e) => handleFormChange('message', e.target.value)}
              className={formErrors.message ? 'input-error' : ''}
              rows="5"
            />
            {formErrors.message && (
              <span className="error-text">{formErrors.message}</span>
            )}
            <div className="character-count">
              {formData.message.length} / 500 characters
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
              disabled={sendingNotification}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sendingNotification}
            >
              {sendingNotification ? (
                <>
                  <LoadingSpinner size="small" message="" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend />
                  Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Notification History */}
      <div className="notification-history-card">
        <div className="card-header">
          <h3 className="card-title">
            <FiClock className="section-icon" />
            Recent Notifications
          </h3>
          <span className="history-count">
            {notificationHistory.length} {notificationHistory.length === 1 ? 'notification' : 'notifications'}
          </span>
        </div>

        <div className="history-content">
          {notificationHistory.length === 0 ? (
            <div className="empty-state">
              <FiBell className="empty-icon" />
              <h3>No Notifications Yet</h3>
              <p>
                Notifications you send will appear here. Start by sending your first notification above.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {notificationHistory.map((notification, index) => (
                <div key={notification.id || index} className="history-item">
                  <div className="history-item-header">
                    <div className="notification-badges">
                      <span className={`type-badge ${getTypeClass(notification.type)}`}>
                        {notification.type}
                      </span>
                      <span className={`status-badge ${getStatusClass(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>
                    <span className="notification-timestamp">
                      <FiClock className="inline-icon" />
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                  <div className="history-item-body">
                    <div className="notification-recipient">
                      <FiUser className="inline-icon" />
                      <strong>To:</strong> {notification.recipientId}
                    </div>
                    <div className="notification-message">
                      <FiMessageSquare className="inline-icon" />
                      {notification.message}
                    </div>
                  </div>
                  {notification.id && (
                    <div className="notification-id">
                      <span className="id-label">ID:</span>
                      <code>{notification.id}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
