# Uppuveli Beach Web Admin Panel

This is the React-based Web Admin Panel for hotel staff. It uses Create React App and reads configuration from environment variables (prefixed with `REACT_APP_`).

## Environment Configuration

1) Copy the example environment file and customize values as needed:
```bash
cp .env.example .env
```

2) Variables available:
- `REACT_APP_API_BASE` — Base URL of the Backend API.
  - Default: `http://localhost:3001/api/v1`
- `REACT_APP_OAUTH_AUTH_URL` — OAuth2 Authorization endpoint (Authorization Code flow).
  - Default: `http://localhost:3001/oauth/authorize`
- `REACT_APP_OAUTH_TOKEN_URL` — OAuth2 Token endpoint.
  - Default: `http://localhost:3001/oauth/token`
- `REACT_APP_OAUTH_CLIENT_ID` — OAuth2 client ID registered on the backend for the Web Admin Panel.
  - Default: `admin-web`
- `REACT_APP_OAUTH_REDIRECT_URI` — The redirect URI for OAuth2 callbacks. Must be registered in the backend OAuth client configuration.
  - Default: `http://localhost:3000`
- `REACT_APP_OAUTH_SCOPES` — Space-separated list of requested scopes.
  - Default: `admin`

Planned endpoints used by new service placeholders (ensure your backend exposes these under `REACT_APP_API_BASE`):
- Payments: 
  - POST `/payments` (process payment)
  - GET  `/payments/{id}` (retrieve payment)
  - POST `/payments/{id}/refund` (refund)
- Notifications:
  - POST `/notifications` (send notification)
  - GET  `/notifications` (list)
  - POST `/notifications/test` (optional test)
- Chat:
  - POST `/chat` (send message)
  - GET  `/chat` (list messages)

Note:
- In Create React App, environment variables must be defined at build time and start with `REACT_APP_` to be available in the browser.
- Do not place secrets in these variables—they are exposed to the client.

## Running the App

Install dependencies and start the development server:
```bash
npm install
npm start
```

The app runs at:
- UI: http://localhost:3000

Ensure your backend (or mock) is running and accessible at the URLs specified in `.env`.

## How OAuth Mock Works (Local Dev)

For local development, defaults point to:
- Authorization URL: `http://localhost:3001/oauth/authorize`
- Token URL: `http://localhost:3001/oauth/token`
- Client ID: `admin-web`
- Redirect URI: `http://localhost:3000`
- Scopes: `admin`

You can:
- Use a simple mock backend that accepts any username/password and returns a static authorization code, then exchanges it for a static token at the token endpoint.
- Or configure your real backend’s OAuth2 server to register:
  - Client: `admin-web`
  - Redirect URI: `http://localhost:3000`
  - Scope: `admin`

The admin panel constructs the authorization URL using these settings. After login on the authorization server, it should redirect back to the redirect URI with a `code` parameter to exchange at the token endpoint.

## Configuration in Code

- `src/config.js` reads the environment variables and provides local defaults.
- It also exposes helpers:
  - `buildAuthorizationUrl(state?)` — Build the OAuth2 authorization URL.
  - `isUsingLocalDefaults()` — Returns true if no env overrides are set.

## OAuth Utilities (Placeholder Flow)

Implemented in:
- `src/auth/oauth.js`
  - `getAccessToken()` / `setAccessToken(token)` — Manage token in `sessionStorage`
  - `redirectToLogin(state?)` — Redirect to the authorization URL
  - `handleAuthRedirectIfPresent()` — Parse `?code` and exchange via `REACT_APP_OAUTH_TOKEN_URL`
  - `isAuthenticated()` and `logout()` — Basic auth state helpers
- `src/components/LoginButton.jsx` — Simple UI to initiate login/logout and show status

Notes:
- Back-end mock endpoints expected:
  - `GET/POST /oauth/authorize` (external)
  - `POST /oauth/token` (exchange)
  - `GET /admin/me` (optional, to display user)
- If backend is not yet available, the UI will show graceful errors in console and a simple message.

## Next Steps

- Wire `config.apiBase` into your API client.
- Use `getAccessToken()` to attach `Authorization: Bearer <token>` header.
- Add protected routes and token storage strategy.

## Troubleshooting

- Changes to `.env` require restarting `npm start`.
- Verify CORS is enabled on your backend for `http://localhost:3000`.
- Make sure the OAuth client’s redirect URI matches exactly the value used by the app.

```text
Important: Do not hardcode credentials or secrets in the frontend. Keep sensitive data on the backend.
```

Instructions for future agent:
- Integrate the config into the app flow (API client, OAuth callback handling, protected routes).
- Ensure the backend exposes the mock/real OAuth endpoints described above and supports the `admin-web` client for local dev.
