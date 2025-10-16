/**
 * Error Message Component
 * Displays error messages
 */
import React from 'react';
import './ErrorMessage.css';

// PUBLIC_INTERFACE
/**
 * Error message component
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message || 'An error occurred'}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
