import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProviderMock } from '../../context/__mocks__/AuthContextMock';

// Simple stubs for protected and login pages
const ProtectedContent = () => <div>Protected Dashboard</div>;
const LoginPage = () => <div>Login Page</div>;

function renderWithRouter(ui, { route = '/dashboard', initialEntries } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries || [route]}>
      {ui}
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  test('redirects unauthenticated users to /login', async () => {
    renderWithRouter(
      <AuthProviderMock
        value={{
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          login: jest.fn(),
          logout: jest.fn(),
          setAuthData: jest.fn(),
        }}
      >
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
        </Routes>
      </AuthProviderMock>,
      { initialEntries: ['/dashboard'] }
    );

    // After navigation, we should see login page content
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders children when authenticated', async () => {
    renderWithRouter(
      <AuthProviderMock
        value={{
          user: { id: 'u1' },
          accessToken: 'token',
          isAuthenticated: true,
          isLoading: false,
          login: jest.fn(),
          logout: jest.fn(),
          setAuthData: jest.fn(),
        }}
      >
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProviderMock>,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('Protected Dashboard')).toBeInTheDocument();
  });
});
