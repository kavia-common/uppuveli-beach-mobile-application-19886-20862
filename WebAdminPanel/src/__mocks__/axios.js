const jestMock = typeof jest !== 'undefined' ? jest : require('jest-mock');

const mockAxiosInstance = {
  // Provide interceptors structure as many codebases attach handlers in tests
  interceptors: {
    request: { use: jestMock.fn() },
    response: { use: jestMock.fn() },
  },
  // Common HTTP methods used in code/tests
  get: jestMock.fn(),
  post: jestMock.fn(),
  put: jestMock.fn(),
  delete: jestMock.fn(),
  patch: jestMock.fn(),
  head: jestMock.fn(),
  options: jestMock.fn(),
};

// PUBLIC_INTERFACE
/** Jest manual mock for axios (CommonJS).
 *  - Avoids importing axios ESM build under react-scripts/Jest environment
 *  - Supports axios.create() returning an instance with interceptors
 *  - Exposes default HTTP verb mocks for direct axios.<method> usage
 */
module.exports = {
  create: jestMock.fn(() => ({ ...mockAxiosInstance })),
  // Export a "default" compatible surface for cases using default import transpilation
  default: {
    create: jestMock.fn(() => ({ ...mockAxiosInstance })),
    get: mockAxiosInstance.get,
    post: mockAxiosInstance.post,
    put: mockAxiosInstance.put,
    delete: mockAxiosInstance.delete,
    patch: mockAxiosInstance.patch,
    head: mockAxiosInstance.head,
    options: mockAxiosInstance.options,
    interceptors: mockAxiosInstance.interceptors,
  },
  // Named exports for direct method usage
  get: mockAxiosInstance.get,
  post: mockAxiosInstance.post,
  put: mockAxiosInstance.put,
  delete: mockAxiosInstance.delete,
  patch: mockAxiosInstance.patch,
  head: mockAxiosInstance.head,
  options: mockAxiosInstance.options,
  interceptors: mockAxiosInstance.interceptors,
};
