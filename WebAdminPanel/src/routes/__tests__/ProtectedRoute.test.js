import React from 'react';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { render } from '../../test-utils';

const ProtectedContent = () => <div>Protected Dashboard</div>;
const LoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute (with custom test-utils)', () => {
  test('redirects unauthenticated users to /login', async () => {
    const unauth = {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setAuthData: jest.fn(),
    };

    render(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
      </Routes>,
      { authValue: unauth, initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders children when authenticated', async () => {
    const authed = {
      user: { id: 'u1' },
      accessToken: 'token',
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setAuthData: jest.fn(),
    };

    render(
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          }
        />
      </Routes>,
      { authValue: authed, initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('Protected Dashboard')).toBeInTheDocument();
  });
});
