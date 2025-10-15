//
// Notifications service placeholder for Web Admin Panel
// Planned backend endpoints:
// - POST /notifications           (send a notification)
// - GET  /notifications           (list recent notifications)
// - POST /notifications/test      (optional test endpoint)
//
// Authorization header is handled by the shared apiClient.
//

import { apiGet, apiPost } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Send a notification to a user or a group.
 * payload example:
 * {
 *   recipientId: "user-id" | null,
 *   type: "info" | "promo" | "alert",
 *   message: "text message",
 *   channel?: "push" | "email" | "sms"
 * }
 */
export async function sendNotification(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('sendNotification requires a payload object');
  }
  return apiPost('/notifications', payload);
}

/**
 * PUBLIC_INTERFACE
 * List notifications (optionally filtered).
 * params example: { limit: 50, unread: true }
 */
export async function listNotifications(params) {
  return apiGet('/notifications', { params });
}

/**
 * PUBLIC_INTERFACE
 * Trigger a test notification (if supported by backend).
 */
export async function sendTestNotification(payload) {
  return apiPost('/notifications/test', payload || {});
}
