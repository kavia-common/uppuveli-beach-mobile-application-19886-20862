import React from 'react';

/**
 * Lightweight mock AuthContext provider and hook for tests.
 * Allows tests to control isAuthenticated, accessToken, user, and loading states.
 */
const AuthContext = React.createContext(null);

// PUBLIC_INTERFACE
export const AuthProviderMock = ({
  children,
  value = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    setAuthData: jest.fn(),
  },
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PUBLIC_INTERFACE
export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;
