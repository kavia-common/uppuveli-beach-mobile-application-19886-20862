//
// Generic API client for Web Admin Panel
// - Reads base URL from config.apiBase
// - Injects Bearer token from OAuth helper (sessionStorage)
// - Handles JSON parsing and error normalization
//

import { config } from '../config';
import { getAccessToken } from '../auth/oauth';

/**
 * Normalize and join URL parts ensuring no duplicate slashes except protocol.
 */
function joinUrl(base, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

/**
 * Attempt to parse JSON safely; if fails, return null.
 */
async function safeParseJson(resp) {
  try {
    const text = await resp.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

/**
 * Build headers with Authorization and Content-Type when appropriate.
 */
function buildHeaders(extra = {}, hasBody = false) {
  const headers = new Headers();

  // Attach JSON content type for requests with body unless caller overrides
  if (hasBody && !('Content-Type' in extra)) {
    headers.set('Content-Type', 'application/json');
  }

  // Attach Authorization Bearer token if available
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Merge extra headers
  Object.entries(extra || {}).forEach(([k, v]) => {
    if (typeof v === 'undefined' || v === null) return;
    headers.set(k, v);
  });

  return headers;
}

/**
 * PUBLIC_INTERFACE
 * Perform an HTTP request to the backend API using fetch with consistent behavior.
 * Automatically prefixes config.apiBase and attaches Authorization header.
 * Returns: { ok, status, headers, data, error }
 */
export async function apiRequest(path, { method = 'GET', params, body, headers = {}, signal } = {}) {
  const base = config.apiBase || '';
  let url = joinUrl(base, path);

  // Append query params if provided
  if (params && typeof params === 'object') {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      // Allow array values
      if (Array.isArray(v)) {
        v.forEach((item) => usp.append(k, String(item)));
      } else {
        usp.set(k, String(v));
      }
    });
    const qs = usp.toString();
    if (qs) {
      url += (url.includes('?') ? '&' : '?') + qs;
    }
  }

  // Prepare fetch options
  const hasBody = typeof body !== 'undefined' && body !== null;
  const opts = {
    method,
    headers: buildHeaders(headers, hasBody),
    signal,
  };

  if (hasBody) {
    // If content-type is application/json and body is not a string, stringify
    const ct = (headers && headers['Content-Type']) || opts.headers.get('Content-Type') || '';
    if (ct.toLowerCase().includes('application/json') && typeof body !== 'string') {
      opts.body = JSON.stringify(body);
    } else {
      opts.body = body;
    }
  }

  try {
    const resp = await fetch(url, opts);
    const data = await safeParseJson(resp);

    if (!resp.ok) {
      // Prefer error details if available
      const error = (data && (data.error || data.message || data.error_description)) || `HTTP ${resp.status}`;
      return {
        ok: false,
        status: resp.status,
        headers: resp.headers,
        data,
        error,
      };
    }

    return {
      ok: true,
      status: resp.status,
      headers: resp.headers,
      data,
      error: null,
    };
  } catch (e) {
    return {
      ok: false,
      status: 0,
      headers: new Headers(),
      data: null,
      error: e?.message || 'network_error',
    };
  }
}

/**
 * PUBLIC_INTERFACE
 * Convenience helpers for common HTTP verbs.
 */

/** GET helper */
export async function apiGet(path, options = {}) {
  return apiRequest(path, { ...options, method: 'GET' });
}

/** POST helper */
export async function apiPost(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'POST', body });
}

/** PUT helper */
export async function apiPut(path, body, options = {}) {
  return apiRequest(path, { ...options, method: 'PUT', body });
}

/** DELETE helper */
export async function apiDelete(path, options = {}) {
  return apiRequest(path, { ...options, method: 'DELETE' });
}
