import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildAuthorizationUrl } from '../config';
import {
  getAccessToken,
  isAuthenticated,
  redirectToLogin,
  handleAuthRedirectIfPresent,
  logout,
  getCachedUser,
} from '../auth/oauth';

/**
 * PUBLIC_INTERFACE
 * Renders a login/logout button and basic auth status for the Web Admin Panel.
 * - Login: redirects to OAuth authorization URL (Authorization Code flow)
 * - On return with ?code=..., exchanges the code for token and stores it
 * - Logout: clears token from sessionStorage
 */
export default function LoginButton() {
  const [auth, setAuth] = useState(() => isAuthenticated());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(() => getCachedUser());

  // On initial load, check if we have an auth code to exchange
  useEffect(() => {
    let ignore = false;
    async function maybeHandleCallback() {
      setBusy(true);
      const result = await handleAuthRedirectIfPresent();
      if (!ignore) {
        if (result.ok) {
          setAuth(true);
          setMessage('Login successful.');
          setUser(getCachedUser());
        } else if (result.error && result.error !== 'no_code') {
          // Only show errors if we were actually handling a callback
          console.warn('[LoginButton] OAuth callback handling result:', result);
          setMessage(`Login error: ${result.error}`);
          setAuth(!!getAccessToken());
        }
        setBusy(false);
      }
    }
    maybeHandleCallback();
    return () => { ignore = true; };
  }, []);

  const onLogin = useCallback(() => {
    if (busy) return;
    setMessage('');
    // Optional: generate a simple state value to mitigate CSRF (placeholder)
    const state = Math.random().toString(36).slice(2);
    redirectToLogin(state);
  }, [busy]);

  const onLogout = useCallback(() => {
    if (busy) return;
    logout();
    setAuth(false);
    setUser(null);
    setMessage('Logged out.');
  }, [busy]);

  const tokenPreview = useMemo(() => {
    const t = getAccessToken();
    if (!t) return '';
    // Show a short preview for demo only
    return `${t.slice(0, 8)}...${t.slice(-4)}`;
  }, [auth, busy]);

  if (busy) {
    return (
      <div style={{ marginTop: 16 }}>
        <button disabled style={btnStyleDisabled}>Processing...</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {!auth ? (
        <>
          <button onClick={onLogin} style={btnStyle}>
            Login with OAuth
          </button>
          <div style={hintStyle}>
            Auth URL: <code>{buildAuthorizationUrl('state-demo')}</code>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 8 }}>
            <strong>Logged in</strong> {user?.name ? `(as ${user.name})` : ''}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Token: <code>{tokenPreview || 'n/a'}</code>
          </div>
          <button onClick={onLogout} style={{ ...btnStyle, marginTop: 8, backgroundColor: '#dc3545' }}>
            Logout
          </button>
        </>
      )}
      {message ? <div style={{ marginTop: 8, color: '#555' }}>{message}</div> : null}
    </div>
  );
}

const btnStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 16px',
  cursor: 'pointer',
  fontWeight: 600,
};

const btnStyleDisabled = {
  ...btnStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};

const hintStyle = {
  marginTop: 8,
  fontSize: 12,
  color: '#666',
};
