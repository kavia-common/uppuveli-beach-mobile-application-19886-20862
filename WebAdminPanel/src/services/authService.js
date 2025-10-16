/**
 * Authentication Service
 * Handles OAuth2 authorization code flow with PKCE
 */
import API_CONFIG from '../config/api.config';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const CODE_VERIFIER_KEY = 'code_verifier';

// Generate random string for PKCE
const generateRandomString = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let result = '';
  const values = new Uint8Array(length);
  window.crypto.getRandomValues(values);
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length];
  }
  return result;
};

// Generate SHA-256 hash and base64url encode
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return hash;
};

const base64urlencode = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const authService = {
  // PUBLIC_INTERFACE
  /**
   * Initiates OAuth2 authorization code flow
   */
  async initiateLogin() {
    const codeVerifier = generateRandomString(128);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(hashed);
    
    // Store code verifier for later use
    sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: API_CONFIG.oauth.clientId,
      redirect_uri: API_CONFIG.oauth.redirectUri,
      scope: API_CONFIG.oauth.scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    window.location.href = `${API_CONFIG.oauth.authorizeUrl}?${params.toString()}`;
  },

  // PUBLIC_INTERFACE
  /**
   * Handles OAuth2 callback and exchanges code for tokens
   * @param {string} code - Authorization code from OAuth2 provider
   */
  async handleCallback(code) {
    const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
    
    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please restart the login process.');
    }
    
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: API_CONFIG.oauth.redirectUri,
      client_id: API_CONFIG.oauth.clientId,
      code_verifier: codeVerifier
    });
    
    try {
      const response = await fetch(API_CONFIG.oauth.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      if (!response.ok) {
        throw new Error('Token exchange failed');
      }
      
      const data = await response.json();
      
      // Store tokens
      localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      }
      
      // Clear code verifier
      sessionStorage.removeItem(CODE_VERIFIER_KEY);
      
      return data;
    } catch (error) {
      sessionStorage.removeItem(CODE_VERIFIER_KEY);
      throw error;
    }
  },

  // PUBLIC_INTERFACE
  /**
   * Refreshes the access token using refresh token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: API_CONFIG.oauth.clientId
    });
    
    try {
      const response = await fetch(API_CONFIG.oauth.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      // Update tokens
      localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      }
      
      return data.access_token;
    } catch (error) {
      // Clear tokens on refresh failure
      this.logout();
      throw error;
    }
  },

  // PUBLIC_INTERFACE
  /**
   * Gets the current access token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // PUBLIC_INTERFACE
  /**
   * Checks if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  // PUBLIC_INTERFACE
  /**
   * Logs out the user by clearing tokens
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(CODE_VERIFIER_KEY);
  }
};

export default authService;
