//
// Bookings service for Web Admin Panel
// Implements CRUD operations against /bookings admin endpoints.
// Authorization header is handled by the shared apiClient.
//

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

/**
 * PUBLIC_INTERFACE
 * List all bookings.
 * Optional params can include pagination or filters (e.g., { limit, offset, status }).
 */
export async function listBookings(params) {
  return apiGet('/bookings', { params });
}

/**
 * PUBLIC_INTERFACE
 * Create a new booking.
 * payload: object containing booking fields according to backend schema.
 */
export async function createBooking(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('createBooking requires a payload object');
  }
  return apiPost('/bookings', payload);
}

/**
 * PUBLIC_INTERFACE
 * Retrieve a single booking by ID.
 */
export async function getBooking(id) {
  if (!id) throw new Error('getBooking requires an id');
  return apiGet(`/bookings/${encodeURIComponent(id)}`);
}

/**
 * PUBLIC_INTERFACE
 * Update an existing booking by ID.
 */
export async function updateBooking(id, payload) {
  if (!id) throw new Error('updateBooking requires an id');
  if (!payload || typeof payload !== 'object') {
    throw new Error('updateBooking requires a payload object');
  }
  return apiPut(`/bookings/${encodeURIComponent(id)}`, payload);
}

/**
 * PUBLIC_INTERFACE
 * Delete a booking by ID.
 */
export async function deleteBooking(id) {
  if (!id) throw new Error('deleteBooking requires an id');
  return apiDelete(`/bookings/${encodeURIComponent(id)}`);
}
