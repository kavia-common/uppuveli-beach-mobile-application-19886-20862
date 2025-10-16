import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';

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
  const Providers = ({ children }) => {
    if (authValue) {
      // When a custom authValue is provided, inject it via AuthContext.Provider
      return (
        <AuthContext.Provider value={authValue}>
          <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
        </AuthContext.Provider>
      );
    }

    // Default to using the real AuthProvider when no override is provided
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
