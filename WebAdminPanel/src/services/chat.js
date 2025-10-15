//
// Chat service for Web Admin Panel
// Provides functions to interact with backend chat endpoints.
// Authorization header is handled by the shared apiClient.
//

import { apiPost } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Send a chat message to chatbot/live chat.
 * payload example: { message: "Hello, guest needs assistance." }
 */
export async function sendChatMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('sendChatMessage requires a payload object');
  }
  return apiPost('/chat', payload);
}
