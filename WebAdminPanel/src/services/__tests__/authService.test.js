import axios from 'axios';
import cfg from '../../config/config';
import * as authService from '../authService';

// Mock axios
jest.mock('axios');

describe('authService', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // jsdom provides window.location but not settable href directly; redefine for tests
    delete window.location;
    window.location = { href: 'http://localhost/' };
    sessionStorage.clear();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  test('login builds correct authorization URL and redirects', () => {
    // Provide deterministic config
    const baseAuthUrl = cfg.oauth.authorizationUrl;
    const prevCrypto = window.crypto;
    // Mock crypto.getRandomValues to stable state value length
    window.crypto = {
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i += 1) arr[i] = 1; // predictable "01" hex
        return arr;
      },
    };

    authService.login();

    // Validate window.location.href set
    const url = new URL(window.location.href);
    expect(url.origin + url.pathname).toBe(new URL(baseAuthUrl).origin + new URL(baseAuthUrl).pathname);

    const params = url.searchParams;
    expect(params.get('response_type')).toBe('code');
    expect(params.get('client_id')).toBe(cfg.oauth.clientId);
    expect(params.get('redirect_uri')).toBe(cfg.oauth.redirectUri);

    // scope should default to provided cfg scopes or "admin"
    const scope = params.get('scope');
    if (cfg.oauth.scopes && cfg.oauth.scopes.length) {
      expect(scope).toBe(cfg.oauth.scopes.join(' '));
    } else {
      expect(scope).toBe('admin');
    }

    const state = params.get('state');
    expect(state).toBeTruthy();
    expect(sessionStorage.getItem('oauth_state')).toBe(state);

    // restore crypto
    window.crypto = prevCrypto;
  });

  test('handleAuthCallback parses code/state, validates state and stores tokens, user, expiry', async () => {
    const code = 'abc123';
    const state = 'state-xyz';
    sessionStorage.setItem('oauth_state', state);

    const mockResp = {
      data: {
        access_token: 'token-1',
        refresh_token: 'refresh-1',
        id_token: 'id-1',
        user: { id: 'u1', name: 'Tester' },
        expires_in: 3600,
      },
    };
    axios.post.mockResolvedValueOnce(mockResp);

    const data = await authService.handleAuthCallback(code, state);

    expect(axios.post).toHaveBeenCalledWith(
      cfg.oauth.tokenUrl,
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: cfg.oauth.redirectUri,
        client_id: cfg.oauth.clientId,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    expect(localStorage.getItem('access_token')).toBe('token-1');
    expect(localStorage.getItem('refresh_token')).toBe('refresh-1');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 'u1', name: 'Tester' });
    const expiry = parseInt(localStorage.getItem('token_expiry'), 10);
    expect(Number.isFinite(expiry)).toBe(true);
    expect(data).toEqual({
      accessToken: 'token-1',
      refreshToken: 'refresh-1',
      idToken: 'id-1',
      user: { id: 'u1', name: 'Tester' },
      expiresIn: 3600,
    });
    expect(sessionStorage.getItem('oauth_state')).toBeNull();
  });

  test('handleAuthCallback throws when state mismatch', async () => {
    sessionStorage.setItem('oauth_state', 'expected');
    await expect(authService.handleAuthCallback('code', 'wrong')).rejects.toThrow(/Invalid state/);
    expect(sessionStorage.getItem('oauth_state')).toBeNull();
  });

  test('handleAuthCallback surfaces friendly error when token exchange fails', async () => {
    const code = 'abc123';
    const state = 'state-xyz';
    sessionStorage.setItem('oauth_state', state);
    axios.post.mockRejectedValueOnce(new Error('network'));

    await expect(authService.handleAuthCallback(code, state)).rejects.toThrow(
      'Failed to exchange authorization code for tokens'
    );
  });
});
