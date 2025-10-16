/**
 * Chat Page
 * Manages chat messages
 */
import React, { useEffect, useState } from 'react';
import chatService from '../../services/chatService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './ChatPage.css';

// PUBLIC_INTERFACE
/**
 * Chat page component
 */
const ChatPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await chatService.getAll();
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !recipientId.trim()) return;

    setSending(true);
    try {
      await chatService.send({
        senderId: 'admin',
        recipientId,
        message: newMessage,
        timestamp: new Date().toISOString()
      });
      setNewMessage('');
      setRecipientId('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading messages..." />;
  }

  return (
    <div className="chat-page">
      <h1>Chat Messages</h1>
      {error && <ErrorMessage message={error} onRetry={fetchMessages} />}
      <div className="chat-container">
        <div className="messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message-item">
                <div className="message-header">
                  <span className="sender">From: {msg.senderId}</span>
                  <span className="timestamp">{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
                <p className="message-text">{msg.message}</p>
              </div>
            ))
          )}
        </div>
        <form className="message-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
