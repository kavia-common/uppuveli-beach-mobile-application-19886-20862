/* PUBLIC_INTERFACE */
/** Exports application configuration sourced from REACT_APP_* environment variables.
 *  Values are read at build-time by CRA. This module centralizes config access
 *  and provides sensible defaults for local development.
 */
const toScopes = (raw) =>
  String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// PUBLIC_INTERFACE
const cfg = Object.freeze({
  /** Application display name */
  appName: process.env.REACT_APP_APP_NAME || 'Uppuveli Admin',

  /** Backend API base URL */
  apiBaseUrl:
    process.env.REACT_APP_API_BASE_URL ||
    'https://api.uppuvelibeach.com/api/v1',

  /** OAuth2 endpoints and parameters */
  oauth: Object.freeze({
    /** Authorization endpoint for OAuth2 Authorization Code flow */
    authorizationUrl:
      process.env.REACT_APP_OAUTH_AUTH_URL ||
      'https://api.uppuvelibeach.com/oauth/authorize',

    /** Token endpoint for OAuth2 Authorization Code flow */
    tokenUrl:
      process.env.REACT_APP_OAUTH_TOKEN_URL ||
      'https://api.uppuvelibeach.com/oauth/token',

    /** Public client ID registered with the Authorization Server */
    clientId: process.env.REACT_APP_OAUTH_CLIENT_ID || '',

    /** Redirect URI configured on the Authorization Server */
    redirectUri:
      process.env.REACT_APP_OAUTH_REDIRECT_URI ||
      'http://localhost:3000/callback',

    /** Space/comma separated scopes list; default is 'admin' */
    scopes: toScopes(process.env.REACT_APP_OAUTH_SCOPES || 'admin'),

    /** Post-logout redirect URI */
    logoutRedirect:
      process.env.REACT_APP_OAUTH_LOGOUT_REDIRECT ||
      'http://localhost:3000/login',
  }),

  // Backward-compatible aliases (minimal coupling with existing code)
  oauthAuthorizationUrl:
    process.env.REACT_APP_OAUTH_AUTH_URL ||
    'https://api.uppuvelibeach.com/oauth/authorize',
  oauthTokenUrl:
    process.env.REACT_APP_OAUTH_TOKEN_URL ||
    'https://api.uppuvelibeach.com/oauth/token',
  oauthClientId: process.env.REACT_APP_OAUTH_CLIENT_ID || '',
  oauthRedirectUri:
    process.env.REACT_APP_OAUTH_REDIRECT_URI || 'http://localhost:3000/callback',
});

export default cfg;
