import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginButton from './components/LoginButton.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BookingsList from './pages/BookingsList.jsx';
import BookingForm from './pages/BookingForm.jsx';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {/* Simple top nav for demo */}
          <nav style={{ position: 'absolute', top: 20, left: 20 }}>
            <Link className="App-link" to="/" style={{ marginRight: 12 }}>Home</Link>
            <Link className="App-link" to="/bookings">Bookings</Link>
          </nav>

          <img src={logo} className="App-logo" alt="logo" />

          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <p>
                    Edit <code>src/App.js</code> and save to reload.
                  </p>
                  <p>
                    Current theme: <strong>{theme}</strong>
                  </p>
                  <LoginButton />
                  <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 16 }}
                  >
                    Learn React
                  </a>
                </div>
              }
            />

            {/* Public login route shows the LoginButton prominently */}
            <Route
              path="/login"
              element={
                <div style={{ padding: 24 }}>
                  <h2>Login</h2>
                  <p>Use OAuth to sign in. You will be redirected back after authorization.</p>
                  <LoginButton />
                </div>
              }
            />

            {/* Protected routes */}
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings/new"
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
