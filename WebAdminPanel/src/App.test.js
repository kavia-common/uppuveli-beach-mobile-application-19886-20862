import React from 'react';
import { screen } from '@testing-library/react';
import AppRoutes from './routes/AppRoutes';
import { render } from './test-utils';

describe('App routing smoke tests (with custom test-utils)', () => {
  test('unauthenticated user navigating to /dashboard is redirected to /login', async () => {
    const unauth = {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setAuthData: jest.fn(),
    };

    render(<AppRoutes />, { authValue: unauth, initialEntries: ['/dashboard'] });

    expect(await screen.findByText(/Admin Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In with OAuth2/i)).toBeInTheDocument();
  });

  test('authenticated user can access /dashboard and see dashboard UI', async () => {
    const authed = {
      user: { id: 'u1', name: 'Tester' },
      accessToken: 'token',
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      setAuthData: jest.fn(),
    };

    render(<AppRoutes />, { authValue: authed, initialEntries: ['/dashboard'] });

    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });
});
