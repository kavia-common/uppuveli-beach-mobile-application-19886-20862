//
// Chat service placeholder for Web Admin Panel
// Planned backend endpoints:
// - POST /chat            (send a message to chatbot/live chat)
// - GET  /chat            (list recent chat messages)
//
// Authorization header is handled by the shared apiClient.
//

import { apiGet, apiPost } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Send a chat message to staff bot/live chat.
 * payload example: { message: "Hello, guest needs towels." }
 */
export async function sendChatMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('sendChatMessage requires a payload object');
  }
  return apiPost('/chat', payload);
}

/**
 * PUBLIC_INTERFACE
 * Retrieve chat history.
 * params example: { limit: 50, since: "iso-timestamp" }
 */
export async function listChatMessages(params) {
  return apiGet('/chat', { params });
}
