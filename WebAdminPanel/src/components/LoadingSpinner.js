/**
 * LoadingSpinner Component
 * Reusable loading indicator component
 */

import React from 'react';

// PUBLIC_INTERFACE
/**
 * Loading spinner component
 * Displays a centered loading indicator with optional message
 * @param {Object} props - Component props
 * @param {string} props.message - Optional loading message to display
 * @param {string} props.size - Size of spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {boolean} props.fullScreen - If true, spinner takes full screen (default: false)
 * @returns {JSX.Element} LoadingSpinner component
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  size = 'medium',
  fullScreen = false 
}) => {
  const sizeClass = `spinner-${size}`;
  const containerClass = fullScreen ? 'spinner-container-fullscreen' : 'spinner-container';

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
