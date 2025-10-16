import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * customRender wraps UI under test with AuthProvider and MemoryRouter.
 * It allows tests to pass a mock auth state and initial routes for router context.
 *
 * @param {React.ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @param {object} options.authValue - Optional initial auth context value override
 * @param {string[]} options.initialEntries - Initial entries for MemoryRouter
 * @param {object} options.renderOptions - Additional options passed to @testing-library/react render
 * @returns {ReturnType<typeof render>} The render result from testing-library
 */
// PUBLIC_INTERFACE
export function customRender(
  ui,
  {
    authValue = undefined,
    initialEntries = ['/'],
    renderOptions = {}
  } = {}
) {
  // If authValue provided, we want to inject it into AuthProvider.
  // Our AuthProvider likely manages its own state; to override in tests,
  // we'll use a simple wrapper that uses a custom value when provided.
  const Providers = ({ children }) => {
    if (authValue) {
      // We will import and use a mock provider if available; otherwise,
      // AuthProvider can accept an initialValue prop if supported.
      // Many projects provide a test mock in context/__mocks__/AuthContextMock.js
      // which returns an AuthContext.Provider with the provided value.
      // We'll attempt to require it dynamically to avoid breaking if not present.
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const { AuthContext } = require('./context/AuthContext');
        return (
          <AuthContext.Provider value={authValue}>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </AuthContext.Provider>
        );
      } catch (e) {
        // Fallback to normal AuthProvider without override if dynamic import fails.
        return (
          <AuthProvider>
            <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
          </AuthProvider>
        );
      }
    }

    return (
      <AuthProvider>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </AuthProvider>
    );
  };

  return render(ui, { wrapper: Providers, ...renderOptions });
}

export * from '@testing-library/react';
export { customRender as render };
