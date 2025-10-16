/* Global Jest setup for CRA + RTL */
import '@testing-library/jest-dom';

// Silence expected network/console noise during tests to keep output clean
const originalError = console.error;
const originalWarn = console.warn;

// Filter out React Router benign warnings or axios network errors in unit tests
beforeAll(() => {
  console.error = (...args) => {
    const msg = args?.[0] || '';
    if (typeof msg === 'string' && (msg.includes('Warning: An update to') || msg.includes('React state update on an unmounted component'))) {
      return;
    }
    originalError(...args);
  };
  console.warn = (...args) => {
    const msg = args?.[0] || '';
    if (typeof msg === 'string' && msg.includes('You should not use <Route> outside a <Router>')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
