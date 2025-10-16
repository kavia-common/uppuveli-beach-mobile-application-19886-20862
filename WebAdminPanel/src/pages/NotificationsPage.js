import React, { useState } from 'react';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import endpoints from '../services/endpoints';
import './Notifications.css';

// PUBLIC_INTERFACE
/**
 * Notifications management page.
 * Sends notifications via POST /notifications and shows simple history in-session.
 * @returns {JSX.Element}
 */
const NotificationsPage = () => {
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    type: 'info',
    message: '',
    recipientId: '',
    status: 'pending',
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.type.trim()) errors.type = 'Type is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (!formData.recipientId.trim()) errors.recipientId = 'Recipient ID is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const resetForm = () => {
    setFormData({ type: 'info', message: '', recipientId: '', status: 'pending' });
    setFormErrors({});
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSendingNotification(true);
    setError(null);
    setSuccessMessage('');

    try {
      const payload = {
        type: formData.type,
        message: formData.message,
        recipientId: formData.recipientId,
        status: 'sent',
      };
      const response = await apiClient.post(endpoints.notifications.create(), payload);
      const newEntry = { ...response.data, timestamp: new Date().toISOString() };
      setNotificationHistory((prev) => [newEntry, ...prev]);
      setSuccessMessage('Notification sent successfully.');
      resetForm();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to send notification.';
      setError(msg);
    } finally {
      setSendingNotification(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    const d = new Date(ts);
    return d.toLocaleString();
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-title-section">
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Send notifications to guests and view recent sends</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

      <div className="notification-form-card">
        <div className="card-header">
          <h3 className="card-title">Send New Notification</h3>
        </div>
        <form onSubmit={handleSendNotification} className="notification-form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="type">Notification Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                className={formErrors.type ? 'input-error' : ''}
                aria-label="Notification type"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
                <option value="promotion">Promotion</option>
                <option value="reminder">Reminder</option>
              </select>
              {formErrors.type && <span className="error-text">{formErrors.type}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="recipientId">Recipient ID</label>
              <input
                id="recipientId"
                aria-label="Recipient ID"
                value={formData.recipientId}
                onChange={(e) => handleFormChange('recipientId', e.target.value)}
                className={formErrors.recipientId ? 'input-error' : ''}
                placeholder="Enter guest ID"
              />
              {formErrors.recipientId && <span className="error-text">{formErrors.recipientId}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              aria-label="Notification message"
              rows="4"
              value={formData.message}
              onChange={(e) => handleFormChange('message', e.target.value)}
              className={formErrors.message ? 'input-error' : ''}
              placeholder="Enter notification message"
            />
            {formErrors.message && <span className="error-text">{formErrors.message}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={sendingNotification}>
              Clear
            </button>
            <button type="submit" className="btn btn-primary" disabled={sendingNotification} aria-label="Send notification">
              {sendingNotification ? <LoadingSpinner message="" size="small" /> : 'Send Notification'}
            </button>
          </div>

          {successMessage && (
            <div role="status" aria-live="polite" style={{ marginTop: 12 }}>
              {successMessage}
            </div>
          )}
        </form>
      </div>

      <div className="notification-history-card">
        <div className="card-header">
          <h3 className="card-title">Recent Notifications</h3>
          <span className="history-count">{notificationHistory.length}</span>
        </div>
        <div className="history-content">
          {notificationHistory.length === 0 ? (
            <div className="empty-state">
              <h3>No Notifications Yet</h3>
              <p>Notifications you send will appear here.</p>
            </div>
          ) : (
            <div className="history-list">
              {notificationHistory.map((n, idx) => (
                <div key={n.id || idx} className="history-item">
                  <div className="history-item-header">
                    <div className="notification-badges">
                      <span className="type-badge">{n.type}</span>
                      <span className="status-badge">{n.status || 'sent'}</span>
                    </div>
                    <span className="notification-timestamp">{formatTimestamp(n.timestamp)}</span>
                  </div>
                  <div className="history-item-body">
                    <div className="notification-recipient">
                      <strong>To:</strong> {n.recipientId}
                    </div>
                    <div className="notification-message">{n.message}</div>
                  </div>
                  {n.id && (
                    <div className="notification-id">
                      <span className="id-label">ID:</span>
                      <code>{n.id}</code>
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
