# Uppuveli Beach Admin - WebAdminPanel

This React-based admin panel connects to the Uppuveli Beach API for bookings, loyalty, analytics, payments, notifications, chat, and boutique management.

## Environment Setup

Create a `.env` file in the `WebAdminPanel` folder (or use your system env) based on `.env.example`:

Required keys:
- `REACT_APP_API_BASE_URL`
- `REACT_APP_OAUTH_AUTH_URL`
- `REACT_APP_OAUTH_TOKEN_URL`
- `REACT_APP_OAUTH_CLIENT_ID`
- `REACT_APP_OAUTH_REDIRECT_URI` (default `http://localhost:3000/callback`)
- `REACT_APP_OAUTH_SCOPES` (default `admin`)
- `REACT_APP_OAUTH_LOGOUT_REDIRECT` (default `http://localhost:3000/login`)
- `REACT_APP_APP_NAME`

Notes:
- React (Create React App) only exposes environment variables prefixed with `REACT_APP_`.
- Values are read at build time. After changing `.env`, stop and restart the dev server.

## OAuth2 Client Registration

Register an OAuth2 client on the authorization server (`https://api.uppuvelibeach.com`):

- Type: SPA / Public client
- Grant: Authorization Code (PKCE recommended if supported)
- Redirect URI(s): `http://localhost:3000/callback`
- Post-logout Redirect URI: `http://localhost:3000/login`
- Scopes: `admin`
- CORS/Allowed Origins: include `http://localhost:3000`

Set the resulting `client_id` value in `REACT_APP_OAUTH_CLIENT_ID`.

## Running

From the `WebAdminPanel` directory:

1. Install dependencies:
   - `npm install` or `yarn`
2. Start the dev server:
   - `npm start` or `yarn start`

The app runs on port 3000 by default. Ensure your `.env` is configured first.

## Configuration Access

Application code imports a single, frozen config object:

```javascript
import config from './src/config/config';

// Example:
fetch(`${config.apiBaseUrl}/bookings`, { /* ... */ });
```

The config includes:
- `config.appName`
- `config.apiBaseUrl`
- `config.oauth.authorizationUrl`
- `config.oauth.tokenUrl`
- `config.oauth.clientId`
- `config.oauth.redirectUri`
- `config.oauth.scopes`
- `config.oauth.logoutRedirect`

## Notes

- OAuth2 uses Authorization Code flow.
- If your provider requires PKCE, it can be added in `src/services/authService.js` with minimal changes while reusing the same env variables.
