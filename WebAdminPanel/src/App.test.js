import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import AppRoutes from './routes/AppRoutes';
import { AuthProviderMock } from './context/__mocks__/AuthContextMock';

// Provide minimal stubs for pages used in routing if needed (but AppRoutes imports real pages).
// For smoke tests, we'll rely on navigation result indications (LoginPage title text, or Dashboard content).

// Because AppRoutes uses ProtectedRoute and real pages, we render it inside a MemoryRouter.
describe('App routing smoke tests', () => {
  test('unauthenticated user navigating to /dashboard is redirected to /login', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
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
          <AppRoutes />
        </AuthProviderMock>
      </MemoryRouter>
    );

    // Expect LoginPage heading text exists
    expect(await screen.findByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In with OAuth2/i)).toBeInTheDocument();
  });

  test('authenticated user can access /dashboard and see dashboard UI stub', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProviderMock
          value={{
            user: { id: 'u1', name: 'Tester' },
            accessToken: 'token',
            isAuthenticated: true,
            isLoading: false,
            login: jest.fn(),
            logout: jest.fn(),
            setAuthData: jest.fn(),
          }}
        >
          <AppRoutes />
        </AuthProviderMock>
      </MemoryRouter>
    );

    // DashboardPage contains elements; we assert for a known string in DashboardPage
    // Review DashboardPage to find a stable text. If not certain, assert presence of layout component role/text.
    // The project has DashboardPage.js; assert "Dashboard" title presence.
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });
});
