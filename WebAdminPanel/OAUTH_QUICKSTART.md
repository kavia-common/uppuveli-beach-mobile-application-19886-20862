# OAuth Quick Start Guide

## 🎯 Quick Reference

### Environment Variables
All OAuth configuration is in `.env.example`. Copy to `.env` for local development:
```bash
cp .env.example .env
```

### Key Files
- **Configuration:** `src/config.js`
- **OAuth Logic:** `src/auth/oauth.js`
- **API Client:** `src/services/apiClient.js`

## 🔑 Common OAuth Operations

### Check if User is Authenticated
```javascript
import { isAuthenticated } from './auth/oauth';

if (isAuthenticated()) {
  console.log('User is logged in');
}
```

### Redirect to Login
```javascript
import { redirectToLogin } from './auth/oauth';

// Simple redirect
redirectToLogin();

// With CSRF protection
const state = Math.random().toString(36).slice(2);
redirectToLogin(state);
```

### Get Current Access Token
```javascript
import { getAccessToken } from './auth/oauth';

const token = getAccessToken();
if (token) {
  console.log('Token:', token);
}
```

### Logout User
```javascript
import { logout } from './auth/oauth';

// Simple logout
logout();

// Logout and redirect
logout('/');
```

### Handle OAuth Callback (Automatic)
The `LoginButton` and protected pages automatically handle OAuth callbacks using:
```javascript
import { handleAuthRedirectIfPresent } from './auth/oauth';

useEffect(() => {
  let ignore = false;
  (async () => {
    const result = await handleAuthRedirectIfPresent();
    if (!ignore && result.ok) {
      // Token stored successfully
      console.log('Logged in successfully');
    }
  })();
  return () => { ignore = true; };
}, []);
```

## 🌐 Making Authenticated API Requests

All service functions automatically include the Bearer token:

### GET Request
```javascript
import { apiGet } from './services/apiClient';

const { ok, data, error } = await apiGet('/bookings', {
  params: { limit: 50, offset: 0 }
});

if (ok) {
  console.log('Bookings:', data);
} else {
  console.error('Error:', error);
}
```

### POST Request
```javascript
import { apiPost } from './services/apiClient';

const { ok, data, error } = await apiPost('/bookings', {
  room_id: '101',
  guest_id: 'user-123',
  check_in: '2024-01-15',
  check_out: '2024-01-20',
  status: 'booked'
});
```

### PUT Request
```javascript
import { apiPut } from './services/apiClient';

const { ok, data, error } = await apiPut('/bookings/123', {
  status: 'checked_in'
});
```

### DELETE Request
```javascript
import { apiDelete } from './services/apiClient';

const { ok, error } = await apiDelete('/bookings/123');
```

## 🛡️ Protecting Routes

Use the `ProtectedRoute` component:

```javascript
import ProtectedRoute from './components/ProtectedRoute';
import BookingsList from './pages/BookingsList';

<Route
  path="/bookings"
  element={
    <ProtectedRoute>
      <BookingsList />
    </ProtectedRoute>
  }
/>
```

If user is not authenticated, they'll be redirected to `/login`.

## 🔧 Customizing OAuth Configuration

### For Development
Edit `.env`:
```env
REACT_APP_API_BASE=http://localhost:3001/api/v1
REACT_APP_OAUTH_AUTH_URL=http://localhost:3001/oauth/authorize
REACT_APP_OAUTH_TOKEN_URL=http://localhost:3001/oauth/token
REACT_APP_OAUTH_CLIENT_ID=admin-web
REACT_APP_OAUTH_REDIRECT_URI=http://localhost:3000
REACT_APP_OAUTH_SCOPES=admin
```

### For Production
Set environment variables in your deployment platform:
```bash
REACT_APP_API_BASE=https://api.uppuvelibeach.com/api/v1
REACT_APP_OAUTH_AUTH_URL=https://api.uppuvelibeach.com/oauth/authorize
REACT_APP_OAUTH_TOKEN_URL=https://api.uppuvelibeach.com/oauth/token
REACT_APP_OAUTH_CLIENT_ID=admin-web
REACT_APP_OAUTH_REDIRECT_URI=https://admin.uppuvelibeach.com
REACT_APP_OAUTH_SCOPES=admin
```

**Important:** Restart dev server after changing `.env` files!

## 🧪 Testing OAuth Flow Locally

1. **Start Backend** (with mock OAuth):
   ```bash
   cd BackendAPI
   # Backend should expose:
   # - GET/POST /oauth/authorize (returns redirect with code)
   # - POST /oauth/token (exchanges code for JWT)
   # - GET /admin/me (returns admin user info)
   ```

2. **Start Frontend**:
   ```bash
   cd WebAdminPanel
   npm start
   ```

3. **Test Flow**:
   - Navigate to http://localhost:3000
   - Click "Login with OAuth"
   - Should redirect to backend authorization URL
   - Backend redirects back with `?code=...`
   - App exchanges code for token automatically
   - Token stored in sessionStorage
   - Navigate to `/bookings` (protected route)
   - API requests include `Authorization: Bearer <token>`

## 🐛 Troubleshooting

### "Invalid client" error
- Check that `REACT_APP_OAUTH_CLIENT_ID` matches backend configuration
- Verify backend has registered the client `admin-web`

### "Redirect URI mismatch" error
- Ensure `REACT_APP_OAUTH_REDIRECT_URI` exactly matches backend config
- Check for trailing slashes (http://localhost:3000 vs http://localhost:3000/)

### Token not attached to requests
- Verify token is in sessionStorage: `sessionStorage.getItem('admin_access_token')`
- Check browser console for OAuth errors
- Ensure `getAccessToken()` is imported in apiClient.js

### CORS errors
- Backend must allow origin `http://localhost:3000` (or your frontend URL)
- Check backend CORS configuration

### State mismatch
- This is a security feature - the state parameter must match
- Clear sessionStorage and try again: `sessionStorage.clear()`

## 📚 Further Reading

- **OAuth 2.0 Authorization Code Flow:** [RFC 6749](https://tools.ietf.org/html/rfc6749#section-4.1)
- **JWT Tokens:** [jwt.io](https://jwt.io/)
- **React Router Protected Routes:** [React Router Docs](https://reactrouter.com/)

## 🔒 Security Best Practices

1. **Never store sensitive data in environment variables** - they're public at build time
2. **Use HTTPS in production** for OAuth redirects
3. **Validate tokens on backend** - frontend only checks presence
4. **Set short token expiry** times on backend (e.g., 1 hour)
5. **Implement refresh tokens** for better UX (future enhancement)
6. **Use state parameter** to prevent CSRF attacks
7. **Clear sessionStorage on logout** to prevent token reuse

## ✅ Checklist for New Developers

- [ ] Copy `.env.example` to `.env`
- [ ] Start backend with OAuth endpoints
- [ ] Start frontend with `npm start`
- [ ] Test login flow
- [ ] Test protected routes
- [ ] Test API requests with token
- [ ] Test logout functionality
- [ ] Review OAuth flow in browser DevTools Network tab
