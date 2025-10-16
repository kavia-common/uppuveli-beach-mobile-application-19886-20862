/**
 * Analytics Service
 * Manages analytics and reporting operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const analyticsService = {
  // PUBLIC_INTERFACE
  /**
   * Retrieves analytics data
   */
  async getData() {
    const response = await apiClient.get(API_CONFIG.endpoints.analytics);
    return response.data;
  }
};

export default analyticsService;
