import axios from 'axios';
import cfg from '../../config/config';
import * as authService from '../authService';

// Ensure axios is mocked to avoid network calls
jest.mock('axios');

describe('authService', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { href: 'http://localhost/' };
    sessionStorage.clear();
    localStorage.clear();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  test('login builds correct authorization URL and redirects', () => {
    const baseAuthUrl = cfg.oauth.authorizationUrl;
    const prevCrypto = window.crypto;
    window.crypto = {
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i += 1) arr[i] = 1;
        return arr;
      },
    };

    authService.login();

    const url = new URL(window.location.href);
    expect(url.origin + url.pathname).toBe(new URL(baseAuthUrl).origin + new URL(baseAuthUrl).pathname);

    const params = url.searchParams;
    expect(params.get('response_type')).toBe('code');
    expect(params.get('client_id')).toBe(cfg.oauth.clientId);
    expect(params.get('redirect_uri')).toBe(cfg.oauth.redirectUri);

    const scope = params.get('scope');
    if (cfg.oauth.scopes && cfg.oauth.scopes.length) {
      expect(scope).toBe(cfg.oauth.scopes.join(' '));
    } else {
      expect(scope).toBe('admin');
    }

    const state = params.get('state');
    expect(state).toBeTruthy();
    expect(sessionStorage.getItem('oauth_state')).toBe(state);

    window.crypto = prevCrypto;
  });

  test('handleAuthCallback parses code/state, validates state and stores tokens, user, expiry (success path)', async () => {
    const code = 'abc123';
    const state = 'state-xyz';
    sessionStorage.setItem('oauth_state', state);

    // Explicitly mock the token exchange to succeed with deterministic payload
    axios.post.mockResolvedValueOnce({
      data: {
        access_token: 'mock_token',
        refresh_token: 'mock_refresh',
        id_token: 'mock_id',
        user: { id: 'u1', name: 'Tester' },
        expires_in: 3600,
      },
    });

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

    expect(localStorage.getItem('access_token')).toBe('mock_token');
    expect(localStorage.getItem('refresh_token')).toBe('mock_refresh');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 'u1', name: 'Tester' });
    const expiry = parseInt(localStorage.getItem('token_expiry'), 10);
    expect(Number.isFinite(expiry)).toBe(true);
    expect(data).toEqual({
      accessToken: 'mock_token',
      refreshToken: 'mock_refresh',
      idToken: 'mock_id',
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

  test('handleAuthCallback surfaces friendly error when token exchange fails (error path)', async () => {
    const code = 'abc123';
    const state = 'state-xyz';
    sessionStorage.setItem('oauth_state', state);

    // Explicitly reject the token exchange call to simulate network/error path
    axios.post.mockRejectedValueOnce(new Error('network'));

    await expect(authService.handleAuthCallback(code, state)).rejects.toThrow(
      'Failed to exchange authorization code for tokens'
    );
  });
});
