/**
 * API Client for Backend Communication
 * Configures axios instance with interceptors for authentication and token refresh
 */

import axios from 'axios';
import config from '../config/config';
import { getAccessToken, refreshToken, logout, isTokenExpired } from './authService';

// PUBLIC_INTERFACE
/**
 * Axios instance configured with base URL and interceptors
 * Automatically attaches Bearer token and handles 401 responses with token refresh
 */
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

/**
 * Process queued requests after token refresh
 * @private
 * @param {Error|null} error - Error if refresh failed
 * @param {string|null} token - New access token if refresh succeeded
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to attach Authorization header
apiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    
    // Check if token is expired and refresh if needed (before request)
    if (token && isTokenExpired()) {
      try {
        const newToken = await refreshToken();
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        console.error('Token refresh failed in request interceptor:', error);
        // Let the request proceed - will be caught by response interceptor
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Success response - return as is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await refreshToken();
        
        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Process any queued requests
        processQueue(null, newToken);
        
        isRefreshing = false;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        logout();
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors or if retry already attempted, reject
    return Promise.reject(error);
  }
);

export default apiClient;
