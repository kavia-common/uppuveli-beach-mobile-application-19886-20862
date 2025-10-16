/**
 * Loyalty Service
 * Manages loyalty account operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const loyaltyService = {
  // PUBLIC_INTERFACE
  /**
   * Retrieves all loyalty accounts
   */
  async getAll() {
    const response = await apiClient.get(API_CONFIG.endpoints.loyalty);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Retrieves a loyalty account by ID
   * @param {string} id - Loyalty account ID
   */
  async getById(id) {
    const response = await apiClient.get(`${API_CONFIG.endpoints.loyalty}/${id}`);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Creates a new loyalty account
   * @param {Object} loyaltyData - Loyalty account data
   */
  async create(loyaltyData) {
    const response = await apiClient.post(API_CONFIG.endpoints.loyalty, loyaltyData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Updates a loyalty account
   * @param {string} id - Loyalty account ID
   * @param {Object} loyaltyData - Updated loyalty account data
   */
  async update(id, loyaltyData) {
    const response = await apiClient.put(`${API_CONFIG.endpoints.loyalty}/${id}`, loyaltyData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Deletes a loyalty account
   * @param {string} id - Loyalty account ID
   */
  async delete(id) {
    await apiClient.delete(`${API_CONFIG.endpoints.loyalty}/${id}`);
  }
};

export default loyaltyService;
