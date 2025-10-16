import React, { useEffect, useCallback } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast component: simple banner notifications with accessibility.
 * Props:
 * - toasts: Array<{ id: string|number, type: 'success'|'error', message: string }>
 * - onDismiss: (id) => void
 * - position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
 */
const Toast = ({ toasts = [], onDismiss, position = 'top-right' }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        // Dismiss latest toast on Escape
        const last = toasts[toasts.length - 1];
        onDismiss?.(last.id);
      }
    },
    [toasts, onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const containerClass = `toast-container ${position}`;

  return (
    <div className={containerClass} aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.type}`}
          role="status"
          aria-label={`${t.type === 'error' ? 'Error' : 'Success'} notification`}
        >
          <div className="toast-content">
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => onDismiss?.(t.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
