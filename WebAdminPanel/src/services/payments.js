//
// Payments service placeholder for Web Admin Panel
// Provides stubbed functions to interact with planned backend endpoints:
// - POST /payments
// - GET /payments/:id
// - POST /payments/:id/refund
//
// Authorization header is handled by the shared apiClient.
//

import { apiGet, apiPost } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * Process a payment for a booking.
 * payload example:
 * {
 *   booking_id: "uuid-or-id",
 *   amount: 120.50,
 *   method: "stripe" | "paypal" | "wallet",
 *   currency?: "USD"
 * }
 */
export async function processPayment(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('processPayment requires a payload object');
  }
  return apiPost('/payments', payload);
}

/**
 * PUBLIC_INTERFACE
 * Retrieve a payment by ID.
 */
export async function getPayment(paymentId) {
  if (!paymentId) throw new Error('getPayment requires paymentId');
  return apiGet(`/payments/${encodeURIComponent(paymentId)}`);
}

/**
 * PUBLIC_INTERFACE
 * Trigger a refund for a given payment ID.
 * payload (optional) may include partial refund amount or reason.
 */
export async function refundPayment(paymentId, payload) {
  if (!paymentId) throw new Error('refundPayment requires paymentId');
  return apiPost(`/payments/${encodeURIComponent(paymentId)}/refund`, payload || {});
}
