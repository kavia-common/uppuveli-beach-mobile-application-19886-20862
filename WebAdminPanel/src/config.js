/**
 * Configuration module for the Web Admin Panel.
 * Reads Create React App-style environment variables and provides sane defaults
 * for local development to enable immediate onboarding.
 */

// PUBLIC_INTERFACE
export const config = {
  /** Base URL for Backend API requests */
  apiBase:
    process.env.REACT_APP_API_BASE || "http://localhost:3001/api/v1",

  /** OAuth2 Authorization endpoint (Authorization Code flow) */
  oauth: {
    authUrl:
      process.env.REACT_APP_OAUTH_AUTH_URL ||
      "http://localhost:3001/oauth/authorize",
    tokenUrl:
      process.env.REACT_APP_OAUTH_TOKEN_URL ||
      "http://localhost:3001/oauth/token",
    clientId:
      process.env.REACT_APP_OAUTH_CLIENT_ID || "admin-web",
    redirectUri:
      process.env.REACT_APP_OAUTH_REDIRECT_URI || "http://localhost:3000",
    // Space-separated list of scopes
    scopes:
      process.env.REACT_APP_OAUTH_SCOPES || "admin",
  },
};

/**
 * Utility to get the authorization URL for starting the OAuth flow.
 * PUBLIC_INTERFACE
 */
export function buildAuthorizationUrl(state = "") {
  /** This constructs a standard OAuth2 authorization request URL. */
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.oauth.clientId,
    redirect_uri: config.oauth.redirectUri,
    scope: config.oauth.scopes,
  });

  if (state) {
    params.set("state", state);
  }

  return `${config.oauth.authUrl}?${params.toString()}`;
}

/**
 * Utility that returns whether config uses the default local values.
 * PUBLIC_INTERFACE
 */
export function isUsingLocalDefaults() {
  return (
    (process.env.REACT_APP_API_BASE ?? "") === "" &&
    (process.env.REACT_APP_OAUTH_AUTH_URL ?? "") === "" &&
    (process.env.REACT_APP_OAUTH_TOKEN_URL ?? "") === "" &&
    (process.env.REACT_APP_OAUTH_CLIENT_ID ?? "") === "" &&
    (process.env.REACT_APP_OAUTH_REDIRECT_URI ?? "") === "" &&
    (process.env.REACT_APP_OAUTH_SCOPES ?? "") === ""
  );
}
