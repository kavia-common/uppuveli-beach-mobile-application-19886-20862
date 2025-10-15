//
// OAuth2 placeholder utilities for Web Admin Panel
// Handles: building authorization URL, redirecting to auth server,
// parsing 'code' on callback, exchanging code for token (mock backend), and
// storing/retrieving access tokens in sessionStorage.
//

import { config, buildAuthorizationUrl } from '../config';

/** Storage key used for sessionStorage */
const STORAGE_KEY = 'admin_access_token';
const STORAGE_USER_KEY = 'admin_user';

/**
 * PUBLIC_INTERFACE
 * Returns the stored access token from sessionStorage, or null if not present.
 */
export function getAccessToken() {
  try {
    const token = sessionStorage.getItem(STORAGE_KEY);
    return token || null;
  } catch (err) {
    console.error('[oauth] Failed reading access token from sessionStorage', err);
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Sets the access token in sessionStorage (or clears if falsy).
 */
export function setAccessToken(token) {
  try {
    if (token) {
      sessionStorage.setItem(STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error('[oauth] Failed writing access token to sessionStorage', err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Returns the cached user profile (from /admin/me), if any.
 */
export function getCachedUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('[oauth] Failed to parse cached user', err);
    return null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Clears token and cached user from sessionStorage (logout).
 */
export function clearAuth() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_USER_KEY);
  } catch (err) {
    console.error('[oauth] Failed clearing auth data', err);
  }
}

/**
 * PUBLIC_INTERFACE
 * Builds the authorization URL using config.buildAuthorizationUrl and redirects the browser.
 * Optionally accepts a state string. Stores state in sessionStorage for validation on return.
 */
export function redirectToLogin(state = '') {
  try {
    if (state) {
      sessionStorage.setItem('oauth_state', state);
    }
  } catch {
    // best-effort; continue without state persistence
  }

  const url = buildAuthorizationUrl(state);
  console.info('[oauth] Redirecting to authorization URL:', url);
  window.location.assign(url);
}

/**
 * Parse URL query parameters and return an object with code, state, and error if present.
 */
function parseAuthCallbackParams() {
  const url = new URL(window.location.href);
  const params = url.searchParams;
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    error_description: params.get('error_description'),
  };
}

/**
 * PUBLIC_INTERFACE
 * Handles an OAuth2 redirect callback on the current page:
 * - Reads ?code and ?state
 * - Exchanges code for token using backend token endpoint
 * - Caches token (and optionally user via /admin/me)
 * - Cleans the URL by removing code/state parameters
 * Returns an object: { ok: boolean, error?: string }
 *
 * Notes:
 * - This is a placeholder implementation compatible with mock endpoints.
 * - If backend is not available, returns a graceful error.
 */
export async function handleAuthRedirectIfPresent() {
  const { code, state, error, error_description } = parseAuthCallbackParams();

  if (error) {
    console.error('[oauth] Authorization error:', error, error_description || '');
    return { ok: false, error: error_description || error };
  }

  if (!code) {
    // No auth code present; nothing to do
    return { ok: false, error: 'no_code' };
  }

  // Validate state if stored
  try {
    const expectedState = sessionStorage.getItem('oauth_state');
    if (expectedState && state && expectedState !== state) {
      console.warn('[oauth] State mismatch. Expected:', expectedState, 'Got:', state);
      return { ok: false, error: 'state_mismatch' };
    }
  } catch {
    // ignore state validation errors in placeholder
  }

  // Attempt code exchange
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.oauth.redirectUri,
      client_id: config.oauth.clientId,
    });

    const resp = await fetch(config.oauth.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!resp.ok) {
      const text = await safeReadText(resp);
      console.error('[oauth] Token exchange failed:', resp.status, text);
      return { ok: false, error: `token_exchange_failed_${resp.status}` };
    }

    const data = await resp.json().catch(() => ({}));
    const token = data.access_token || data.token || null;

    if (!token) {
      console.error('[oauth] Missing access_token in token response:', data);
      return { ok: false, error: 'no_access_token' };
    }

    setAccessToken(token);
    // Pre-fetch user info if mock endpoint available; ignore failures
    try {
      const me = await fetch(`${config.apiBase.replace(/\/$/, '')}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (me.ok) {
        const user = await me.json().catch(() => null);
        if (user) {
          sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
        }
      }
    } catch (e) {
      console.info('[oauth] /admin/me not available yet (expected in placeholder):', e?.message || e);
    }

    // Clean up query params from the URL
    cleanUrl();

    console.info('[oauth] Token stored in sessionStorage');
    return { ok: true };
  } catch (e) {
    console.error('[oauth] Token exchange error:', e);
    return { ok: false, error: 'network_error' };
  }
}

/**
 * Removes OAuth query params from the current URL without reloading.
 */
function cleanUrl() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('error');
    url.searchParams.delete('error_description');
    window.history.replaceState({}, document.title, url.toString());
  } catch {
    // noop
  }
}

/**
 * PUBLIC_INTERFACE
 * Utility to determine basic auth status.
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * PUBLIC_INTERFACE
 * Performs logout: clears auth artifacts and optionally redirects to home.
 */
export function logout(redirectTo = null) {
  clearAuth();
  console.info('[oauth] Logged out. Token cleared.');
  if (redirectTo) {
    window.location.assign(redirectTo);
  }
}

/**
 * Safe helper to read response text without throwing on body used.
 */
async function safeReadText(resp) {
  try {
    return await resp.text();
  } catch {
    return '';
  }
}
