/**
 * API Configuration
 * Centralizes all API endpoints and OAuth2 configuration
 */

const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.uppuvelibeach.com/api/v1',
  oauth: {
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID,
    redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || `${window.location.origin}/login/callback`,
    authorizeUrl: process.env.REACT_APP_OAUTH_AUTHORIZE_URL || 'https://api.uppuvelibeach.com/oauth/authorize',
    tokenUrl: process.env.REACT_APP_OAUTH_TOKEN_URL || 'https://api.uppuvelibeach.com/oauth/token',
    scope: 'admin'
  },
  endpoints: {
    bookings: '/bookings',
    loyalty: '/loyalty',
    analytics: '/analytics',
    payments: '/payments',
    notifications: '/notifications',
    chat: '/chat',
    boutique: '/boutique'
  }
};

export default API_CONFIG;
