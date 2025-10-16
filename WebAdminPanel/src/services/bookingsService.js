/**
 * Bookings Service
 * Manages booking operations
 */
import apiClient from './apiClient';
import API_CONFIG from '../config/api.config';

const bookingsService = {
  // PUBLIC_INTERFACE
  /**
   * Retrieves all bookings
   */
  async getAll() {
    const response = await apiClient.get(API_CONFIG.endpoints.bookings);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Retrieves a booking by ID
   * @param {string} id - Booking ID
   */
  async getById(id) {
    const response = await apiClient.get(`${API_CONFIG.endpoints.bookings}/${id}`);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Creates a new booking
   * @param {Object} bookingData - Booking data
   */
  async create(bookingData) {
    const response = await apiClient.post(API_CONFIG.endpoints.bookings, bookingData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Updates a booking
   * @param {string} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   */
  async update(id, bookingData) {
    const response = await apiClient.put(`${API_CONFIG.endpoints.bookings}/${id}`, bookingData);
    return response.data;
  },

  // PUBLIC_INTERFACE
  /**
   * Deletes a booking
   * @param {string} id - Booking ID
   */
  async delete(id) {
    await apiClient.delete(`${API_CONFIG.endpoints.bookings}/${id}`);
  }
};

export default bookingsService;
