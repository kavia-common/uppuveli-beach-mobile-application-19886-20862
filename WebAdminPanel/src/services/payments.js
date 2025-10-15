//
// Payments service for Web Admin Panel
// Provides functions to interact with backend payment endpoints.
// Authorization header is handled by the shared apiClient.
//

import { apiPost } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Process a payment for a booking.
 * payload example:
 * {
 *   bookingId: 123,
 *   amount: 120.50,
 *   method: "stripe" | "paypal" | "wallet"
 * }
 */
export async function processPayment(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('processPayment requires a payload object');
  }
  return apiPost('/payments', payload);
}
