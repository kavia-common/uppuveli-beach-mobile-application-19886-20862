//
// Notifications service for Web Admin Panel
// Provides functions to interact with backend notification endpoints.
// Authorization header is handled by the shared apiClient.
//

import { apiGet } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * List notifications for the authenticated user.
 * params example: { limit: 50 }
 */
export async function listNotifications(params) {
  return apiGet('/notifications', { params });
}
