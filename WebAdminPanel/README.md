# Uppuveli Beach Admin - WebAdminPanel

This React-based admin panel connects to the Uppuveli Beach API for bookings, loyalty, analytics, payments, notifications, chat, and boutique management. It is a Create React App project configured to run locally on port 3000 and integrates with an OAuth2 Authorization Server using the Authorization Code flow.

## Preview and Development Server

- Local preview runs on: http://localhost:3000
- The OAuth2 redirect URI for local development is: http://localhost:3000/callback
- If you change environment variables, stop and restart the dev server because CRA reads them at build time.

## Environment Variables

Create a `.env` file in the `WebAdminPanel` folder (or set system env vars). All variables must be prefixed with `REACT_APP_`. The application reads these values through `src/config/config.js` and provides sensible defaults for local development.

Required keys:
- REACT_APP_API_BASE_URL: Backend REST API base URL. Default: https://api.uppuvelibeach.com/api/v1
- REACT_APP_OAUTH_AUTH_URL: OAuth2 authorization endpoint. Default: https://api.uppuvelibeach.com/oauth/authorize
- REACT_APP_OAUTH_TOKEN_URL: OAuth2 token endpoint. Default: https://api.uppuvelibeach.com/oauth/token
- REACT_APP_OAUTH_CLIENT_ID: OAuth2 public client ID issued by the Authorization Server. No default; must be set.
- REACT_APP_OAUTH_REDIRECT_URI: Redirect URI configured on the Authorization Server. Default: http://localhost:3000/callback
- REACT_APP_OAUTH_SCOPES: Comma-separated scopes. Default: admin
- REACT_APP_OAUTH_LOGOUT_REDIRECT: Post-logout redirect URI. Default: http://localhost:3000/login
- REACT_APP_APP_NAME: Application display name. Default: Uppuveli Admin

Notes:
- Scopes are parsed as a list from a comma-separated string and sent to the authorization server joined by spaces.
- Ensure the Authorization Server has CORS enabled for your origin during development.

## OAuth2 Client Registration

Register an OAuth2 client on the authorization server (e.g., https://api.uppuvelibeach.com):

- Client type: SPA / Public client
- Grant: Authorization Code (PKCE recommended if supported)
- Redirect URI(s): "http://localhost:3000/callback"
- Post-logout Redirect URI: "http://localhost:3000/login"
- Scopes: "admin"
- Allowed CORS origins: include "http://localhost:3000"

Set the resulting client id into REACT_APP_OAUTH_CLIENT_ID. The app constructs the authorization request with response_type=code, the configured scope(s), and a CSRF-protecting state parameter. The callback exchanges the code for tokens at the token endpoint using a JSON POST body. Refresh tokens are used when provided by the server.

## Local vs Production Configuration

- Local:
  - API base: https://api.uppuvelibeach.com/api/v1 (default)
  - Redirect URI: http://localhost:3000/callback
  - Login redirect after logout: http://localhost:3000/login
  - Ensure the OAuth client registered at the Authorization Server includes the above redirect URIs and origin.
- Production:
  - Provide production values for all REACT_APP_* variables. Example:
    - REACT_APP_API_BASE_URL=https://api.uppuvelibeach.com/api/v1
    - REACT_APP_OAUTH_AUTH_URL=https://api.uppuvelibeach.com/oauth/authorize
    - REACT_APP_OAUTH_TOKEN_URL=https://api.uppuvelibeach.com/oauth/token
    - REACT_APP_OAUTH_CLIENT_ID=<your_production_client_id>
    - REACT_APP_OAUTH_REDIRECT_URI=https://admin.uppuvelibeach.com/callback
    - REACT_APP_OAUTH_SCOPES=admin
    - REACT_APP_OAUTH_LOGOUT_REDIRECT=https://admin.uppuvelibeach.com/login
    - REACT_APP_APP_NAME=Uppuveli Admin
  - Update the OAuth client registration to include the production redirect URI and origin (https://admin.uppuvelibeach.com).

## Running

From the `WebAdminPanel` directory:

1. Install dependencies:
   - npm install
2. Start the dev server:
   - npm start

The app runs on port 3000 by default. Ensure your `.env` is configured first.

## Features Implemented

The current codebase implements the following foundational features:

- Authentication and session handling:
  - OAuth2 Authorization Code flow initiation and callback handling in src/services/authService.js
  - Token storage, refresh handling, expiry tracking, and logout
- API client with auth:
  - Axios client with Authorization header injection and automatic refresh on 401 in src/services/apiClient.js
- Route protection:
  - Protected routes and login redirection in routes/ProtectedRoute.js and routes/AppRoutes.js
- Pages and navigation:
  - Dashboard, Bookings, Booking Detail, Loyalty, Loyalty Detail, Analytics, Notifications, Chat, Boutique, Boutique Detail, Payments, Login, Callback, and Home pages with layout components (Navbar, Sidebar)
- UI feedback:
  - LoadingSpinner and Toast notifications via hooks/useToast and components/Toast

These features provide a cohesive baseline for end-to-end sign-in, guarded routing, and authenticated API calls.

## Configuration Access in Code

Application code imports a single, frozen config object from src/config/config.js:

```javascript
import cfg from './src/config/config';

// Example usage:
fetch(`${cfg.apiBaseUrl}/bookings`, { /* options */ });
```

The config includes:
- cfg.appName
- cfg.apiBaseUrl
- cfg.oauth.authorizationUrl
- cfg.oauth.tokenUrl
- cfg.oauth.clientId
- cfg.oauth.redirectUri
- cfg.oauth.scopes
- cfg.oauth.logoutRedirect

## Testing

- Unit tests are set up via Create React App. To run tests in watch mode:
  - npm test
- To run tests in CI mode (non-interactive):
  - CI=true npm test -- --watchAll=false

The test setup file is located at src/setupTests.js. There are example tests under:
- src/routes/__tests__/ProtectedRoute.test.js
- src/services/__tests__/authService.test.js

## Notes

- This app uses the OAuth2 Authorization Code flow. PKCE can be added in src/services/authService.js if the Authorization Server requires it, using the existing environment variables.
- If you change any REACT_APP_* variables, restart the dev server to pick up changes.
