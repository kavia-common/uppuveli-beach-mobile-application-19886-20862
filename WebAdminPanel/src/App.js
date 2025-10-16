import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component for Web Admin Panel
 * Provides the routing structure for the entire application
 * Authentication context is provided by AuthProvider in index.js
 * @returns {JSX.Element} The main application component with routing
 */
function App() {
  return <AppRoutes />;
}

export default App;
