/**
 * Configuration module for Web Admin Panel
 * Exports environment variables with sensible defaults for development
 */

// PUBLIC_INTERFACE
/**
 * Application configuration object containing API and OAuth2 settings
 * @constant {Object} config
 */
const config = {
  /**
   * Base URL for API requests
   * @type {string}
   */
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.uppuvelibeach.com/api/v1',
  
  /**
   * OAuth2 authorization endpoint
   * @type {string}
   */
  oauthAuthorizationUrl: process.env.REACT_APP_OAUTH_AUTHORIZATION_URL || 'https://api.uppuvelibeach.com/oauth/authorize',
  
  /**
   * OAuth2 token endpoint
   * @type {string}
   */
  oauthTokenUrl: process.env.REACT_APP_OAUTH_TOKEN_URL || 'https://api.uppuvelibeach.com/oauth/token',
  
  /**
   * OAuth2 client ID
   * NOTE: This must be configured via environment variables - request from user
   * @type {string}
   */
  oauthClientId: process.env.REACT_APP_OAUTH_CLIENT_ID || '',
  
  /**
   * OAuth2 redirect URI after authentication
   * @type {string}
   */
  oauthRedirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || 'http://localhost:3000/callback',
  
  /**
   * Site URL for the application
   * @type {string}
   */
  siteUrl: process.env.REACT_APP_SITE_URL || 'http://localhost:3000'
};

export default config;
