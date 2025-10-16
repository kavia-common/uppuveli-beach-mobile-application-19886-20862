import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinner, ErrorMessage } from '../components';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';

// PUBLIC_INTERFACE
/**
 * Chat management page. Fetches messages via GET /chat and sends
 * new messages via POST /chat with basic form and list.
 * @returns {JSX.Element}
 */
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ senderId: '', recipientId: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const retryBtnRef = useRef(null);
  const firstFieldRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(endpoints.chat.list());
      setMessages(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load chat messages');
      setTimeout(() => retryBtnRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const payload = { ...form, timestamp: new Date().toISOString() };
      const res = await apiClient.post(endpoints.chat.create(), payload);
      setMessages((m) => [...m, res.data]);
      setForm((f) => ({ ...f, message: '' }));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to send message');
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading chat..." />;

  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Guest Chat</h2>
        <p className="welcome-description">
          Communicate with guests in real-time
        </p>
      </div>
      <div className="chat-container" style={{ display: 'flex', gap: 16 }}>
        <div className="chat-list" style={{ flex: 1 }}>
          <ul aria-label="Chat messages">
            {messages.map((m) => (
              <li key={m.id}>
                <strong>{m.senderId}</strong> to <strong>{m.recipientId}</strong>: {m.message}{' '}
                <em>({new Date(m.timestamp).toLocaleString()})</em>
              </li>
            ))}
            {messages.length === 0 && <li>No messages</li>}
          </ul>
        </div>
        <div className="chat-form" style={{ width: 360 }}>
          <form onSubmit={onSend} aria-label="Send chat message">
            <div>
              <label htmlFor="senderId">Sender ID</label>
              <input
                id="senderId"
                aria-label="Sender ID"
                value={form.senderId}
                onChange={(e) => setForm((s) => ({ ...s, senderId: e.target.value }))}
                required
                ref={firstFieldRef}
              />
            </div>
            <div>
              <label htmlFor="recipientId">Recipient ID</label>
              <input
                id="recipientId"
                aria-label="Recipient ID"
                value={form.recipientId}
                onChange={(e) => setForm((s) => ({ ...s, recipientId: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                aria-label="Message"
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                required
              />
            </div>
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button className="btn btn-primary" type="submit" aria-label="Send message" disabled={sending}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
