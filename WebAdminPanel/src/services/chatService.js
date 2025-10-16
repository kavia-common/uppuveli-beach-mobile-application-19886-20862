/**
 * Chat Service
 * Manages chat message operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const chatService = {
  // PUBLIC_INTERFACE
  /**
   * Retrieves all chat messages
   */
  async getAll() {
    const response = await apiClient.get(API_CONFIG.endpoints.chat);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Sends a chat message
   * @param {Object} messageData - Chat message data
   */
  async send(messageData) {
    const response = await apiClient.post(API_CONFIG.endpoints.chat, messageData);
    return response.data;
  }
};

export default chatService;
