import React, { useEffect, useRef } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

/**
 * PUBLIC_INTERFACE
 * ErrorMessage component to surface API or generic errors with accessibility.
 * Accepts either plain title/message or an API Error object { error_code, message, details }.
 * - Focus management: focuses container or retry button when shown.
 * - ARIA: role="alert", aria-live="polite" for SR announcement.
 * - Actions: onRetry and onClose optional handlers.
 */
const ErrorMessage = ({
  title,
  message,
  apiError, // { error_code, message, details }
  onRetry,
  onClose,
  autoFocus = true,
  focusRetry = true,
  type = 'error',
}) => {
  const containerRef = useRef(null);
  const retryRef = useRef(null);

  // Derive final values from provided props or apiError schema
  const resolvedTitle =
    title || (apiError?.error_code ? `Error: ${apiError.error_code}` : 'Something went wrong');
  const resolvedMessage = message || apiError?.message || 'An unexpected error occurred.';

  // Optional details rendering (stringified for generic object)
  const details =
    typeof apiError?.details === 'string'
      ? apiError.details
      : apiError?.details
      ? JSON.stringify(apiError.details, null, 2)
      : null;

  useEffect(() => {
    if (!autoFocus) return;
    // focus retry first for immediate action, else focus container
    if (focusRetry && onRetry && retryRef.current) {
      retryRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [autoFocus, focusRetry, onRetry]);

  const typeClass = `error-message-${type}`;

  return (
    <div
      className={`error-message ${typeClass}`}
      role="alert"
      aria-live="polite"
      tabIndex={-1}
      ref={containerRef}
      style={{ outline: 'none' }}
    >
      <div className="error-header">
        <div className="error-title-section">
          <FiAlertCircle className="error-icon" aria-hidden="true" />
          <h3 className="error-title">{resolvedTitle}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="error-dismiss-btn"
            aria-label="Dismiss error"
            type="button"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="error-content">
        <p className="error-text">{resolvedMessage}</p>
        {details && (
          <pre
            style={{
              background: '#fff5f5',
              color: '#7f1d1d',
              padding: '8px',
              borderRadius: 4,
              overflowX: 'auto',
              marginTop: 8,
            }}
            aria-label="Error details"
          >
            {details}
          </pre>
        )}
      </div>

      <div className="error-actions" style={{ display: 'flex', gap: 8 }}>
        {onRetry && (
          <button
            ref={retryRef}
            className="btn btn-primary btn-small"
            onClick={onRetry}
            aria-label="Retry action"
            type="button"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
