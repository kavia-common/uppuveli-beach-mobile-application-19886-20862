/**
 * Notifications Service
 * Manages notification operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const notificationsService = {
  // PUBLIC_INTERFACE
  /**
   * Sends a notification
   * @param {Object} notificationData - Notification data
   */
  async send(notificationData) {
    const response = await apiClient.post(API_CONFIG.endpoints.notifications, notificationData);
    return response.data;
  }
};

export default notificationsService;
