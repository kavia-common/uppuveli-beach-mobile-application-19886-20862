/**
 * Chat Page Component
 * Manages guest chat communications
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Chat management page
 * @returns {JSX.Element} Chat page component
 */
const ChatPage = () => {
  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Guest Chat</h2>
        <p className="welcome-description">
          Communicate with guests in real-time
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
