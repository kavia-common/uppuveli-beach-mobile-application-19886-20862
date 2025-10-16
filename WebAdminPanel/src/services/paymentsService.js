/**
 * Payments Service
 * Manages payment operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const paymentsService = {
  // PUBLIC_INTERFACE
  /**
   * Processes a payment
   * @param {Object} paymentData - Payment data
   */
  async process(paymentData) {
    const response = await apiClient.post(API_CONFIG.endpoints.payments, paymentData);
    return response.data;
  }
};

export default paymentsService;
