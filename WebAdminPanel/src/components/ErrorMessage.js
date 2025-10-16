/**
 * ErrorMessage Component
 * Reusable error message display component
 */

import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

// PUBLIC_INTERFACE
/**
 * Error message component
 * Displays error messages with optional dismiss and retry functionality
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} props.title - Optional error title (default: 'Error')
 * @param {Function} props.onDismiss - Optional callback when dismiss button is clicked
 * @param {Function} props.onRetry - Optional callback when retry button is clicked
 * @param {string} props.type - Error type: 'error', 'warning', 'info' (default: 'error')
 * @returns {JSX.Element} ErrorMessage component
 */
const ErrorMessage = ({ 
  message, 
  title = 'Error',
  onDismiss,
  onRetry,
  type = 'error'
}) => {
  const typeClass = `error-message-${type}`;

  return (
    <div className={`error-message ${typeClass}`}>
      <div className="error-header">
        <div className="error-title-section">
          <FiAlertCircle className="error-icon" />
          <h3 className="error-title">{title}</h3>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="error-dismiss-btn"
            aria-label="Dismiss error"
          >
            <FiX />
          </button>
        )}
      </div>
      
      <div className="error-content">
        <p className="error-text">{message}</p>
      </div>
      
      {onRetry && (
        <div className="error-actions">
          <button onClick={onRetry} className="btn btn-primary btn-small">
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
