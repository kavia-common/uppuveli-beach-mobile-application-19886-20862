/**
 * Loading Spinner Component
 * Displays a loading indicator
 */
import React from 'react';
import './LoadingSpinner.css';

// PUBLIC_INTERFACE
/**
 * Loading spinner component
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
