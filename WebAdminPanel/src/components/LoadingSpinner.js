import React from 'react';

/**
 * PUBLIC_INTERFACE
 * LoadingSpinner with accessibility.
 * Props:
 * - label: string for screen readers (visually hidden)
 * - message: optional visible message below spinner
 * - busy: set aria-busy state on container
 * - size: 'small' | 'medium' | 'large'
 * - fullScreen: boolean to center fullscreen
 */
const LoadingSpinner = ({ label = 'Content is loading', message, busy = true, size = 'medium', fullScreen = false }) => {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullScreen ? 'spinner-container-fullscreen' : 'spinner-container';

  return (
    <div className={containerClass} role="status" aria-busy={busy ? 'true' : 'false'} aria-live="polite">
      <div className={`spinner ${sizeClass}`} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      {message ? <p className="spinner-message">{message}</p> : null}
    </div>
  );
};

export default LoadingSpinner;
