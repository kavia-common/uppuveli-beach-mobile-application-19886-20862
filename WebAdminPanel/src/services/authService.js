/**
 * Authentication Service for OAuth2 Authorization Code Flow
 * Handles login redirect, callback processing, token exchange, refresh, and logout
 */

import axios from 'axios';
import config from '../config/config';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// PUBLIC_INTERFACE
/**
 * Initiates OAuth2 login by redirecting to authorization URL
 * Constructs authorization URL with required parameters and redirects user
 */
export function login() {
  const authUrl = new URL(config.oauthAuthorizationUrl);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', config.oauthClientId);
  authUrl.searchParams.append('redirect_uri', config.oauthRedirectUri);
  authUrl.searchParams.append('scope', 'admin');
  
  // Generate and store state for CSRF protection
  const state = generateRandomState();
  sessionStorage.setItem('oauth_state', state);
  authUrl.searchParams.append('state', state);
  
  // Redirect to authorization server
  window.location.href = authUrl.toString();
}

// PUBLIC_INTERFACE
/**
 * Handles OAuth2 callback by exchanging authorization code for tokens
 * @param {string} code - Authorization code from OAuth2 provider
 * @param {string} state - State parameter for CSRF validation
 * @returns {Promise<Object>} Object containing user data and tokens
 * @throws {Error} If token exchange fails or state validation fails
 */
export async function handleAuthCallback(code, state) {
  // Validate state to prevent CSRF attacks
  const storedState = sessionStorage.getItem('oauth_state');
  if (state !== storedState) {
    sessionStorage.removeItem('oauth_state');
    throw new Error('Invalid state parameter - possible CSRF attack');
  }
  sessionStorage.removeItem('oauth_state');
  
  try {
    // Exchange authorization code for tokens
    const response = await axios.post(config.oauthTokenUrl, {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: config.oauthRedirectUri,
      client_id: config.oauthClientId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const { access_token, refresh_token, expires_in, user } = response.data;
    
    // Store tokens and user data
    localStorage.setItem(TOKEN_KEY, access_token);
    if (refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    }
    
    // Calculate and store token expiry time
    if (expires_in) {
      const expiryTime = Date.now() + (expires_in * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
    
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      user: user || null,
      expiresIn: expires_in
    };
  } catch (error) {
    console.error('Token exchange failed:', error);
    throw new Error('Failed to exchange authorization code for tokens');
  }
}

// PUBLIC_INTERFACE
/**
 * Retrieves the current access token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
/**
 * Retrieves the current refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// PUBLIC_INTERFACE
/**
 * Retrieves the stored user data from localStorage
 * @returns {Object|null} The user object or null if not found
 */
export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}

// PUBLIC_INTERFACE
/**
 * Checks if the current access token is expired
 * @returns {boolean} True if token is expired or expiry not found
 */
export function isTokenExpired() {
  const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryStr) return true;
  
  const expiry = parseInt(expiryStr, 10);
  // Consider token expired if it expires in less than 60 seconds
  return Date.now() >= (expiry - 60000);
}

// PUBLIC_INTERFACE
/**
 * Refreshes the access token using the refresh token
 * @returns {Promise<string>} The new access token
 * @throws {Error} If refresh fails
 */
export async function refreshToken() {
  const refreshTokenValue = getRefreshToken();
  
  if (!refreshTokenValue) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await axios.post(config.oauthTokenUrl, {
      grant_type: 'refresh_token',
      refresh_token: refreshTokenValue,
      client_id: config.oauthClientId,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const { access_token, refresh_token, expires_in } = response.data;
    
    // Update stored tokens
    localStorage.setItem(TOKEN_KEY, access_token);
    if (refresh_token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
    }
    
    // Update token expiry
    if (expires_in) {
      const expiryTime = Date.now() + (expires_in * 1000);
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
    
    return access_token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear tokens on refresh failure
    logout();
    throw new Error('Failed to refresh access token');
  }
}

// PUBLIC_INTERFACE
/**
 * Logs out the user by clearing all stored authentication data
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem('oauth_state');
}

// PUBLIC_INTERFACE
/**
 * Checks if user is currently authenticated
 * @returns {boolean} True if user has a valid access token
 */
export function isAuthenticated() {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
}

/**
 * Helper function to generate random state for CSRF protection
 * @private
 * @returns {string} Random state string
 */
function generateRandomState() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
