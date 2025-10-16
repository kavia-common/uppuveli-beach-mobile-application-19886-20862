/**
 * Notifications Page
 * Manages notification sending
 */
import React, { useState } from 'react';
import notificationsService from '../services/notificationsService';
import ErrorMessage from '../components/Common/ErrorMessage';
import './NotificationsPage.css';

// PUBLIC_INTERFACE
/**
 * Notifications page component
 */
const NotificationsPage = () => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    message: '',
    recipientId: '',
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
      await notificationsService.send(formData);
      setSuccess(true);
      setFormData({
        type: 'email',
        message: '',
        recipientId: '',
        status: 'pending'
      });
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="notifications-page">
      <h1>Send Notification</h1>
      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="success-message">
          Notification sent successfully!
        </div>
      )}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Notification Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="recipientId">Recipient ID *</label>
            <input
              type="text"
              id="recipientId"
              name="recipientId"
              value={formData.recipientId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;
