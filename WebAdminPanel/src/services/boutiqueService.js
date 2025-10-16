/**
 * Boutique Service
 * Manages boutique item operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const boutiqueService = {
  // PUBLIC_INTERFACE
  /**
   * Retrieves all boutique items
   */
  async getAll() {
    const response = await apiClient.get(API_CONFIG.endpoints.boutique);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Retrieves a boutique item by ID
   * @param {string} id - Boutique item ID
   */
  async getById(id) {
    const response = await apiClient.get(`${API_CONFIG.endpoints.boutique}/${id}`);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Creates a new boutique item
   * @param {Object} itemData - Boutique item data
   */
  async create(itemData) {
    const response = await apiClient.post(API_CONFIG.endpoints.boutique, itemData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Updates a boutique item
   * @param {string} id - Boutique item ID
   * @param {Object} itemData - Updated boutique item data
   */
  async update(id, itemData) {
    const response = await apiClient.put(`${API_CONFIG.endpoints.boutique}/${id}`, itemData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Deletes a boutique item
   * @param {string} id - Boutique item ID
   */
  async delete(id) {
    await apiClient.delete(`${API_CONFIG.endpoints.boutique}/${id}`);
  }
};

export default boutiqueService;
