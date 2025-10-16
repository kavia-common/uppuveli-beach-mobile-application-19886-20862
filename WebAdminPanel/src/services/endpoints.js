 /**
  * Endpoints service: Minimal, clear API wrappers around backend endpoints.
  * Uses a shared axios instance (apiClient) configured for OAuth2/JWT handling.
  *
  * PUBLIC_INTERFACE
  * Exported namespaces:
  * - bookings: list, create, getById, update, remove
  * - loyalty: list, create, getById, update, remove
  * - analytics: get
  * - payments: create
  * - notifications: create
  * - chat: list, create
  * - boutique: list, create, getById, update, remove
  *
  * All methods return response.data and throw on HTTP errors (handled by interceptors).
  */

 import apiClient from './apiClient';
 import cfg from '../config/config';

 // Base paths from config (fallbacks reflect the OpenAPI paths)
 const BASES = Object.freeze({
   bookings: cfg.apiPaths?.bookings || '/bookings',
   loyalty: cfg.apiPaths?.loyalty || '/loyalty',
   analytics: cfg.apiPaths?.analytics || '/analytics',
   payments: cfg.apiPaths?.payments || '/payments',
   notifications: cfg.apiPaths?.notifications || '/notifications',
   chat: cfg.apiPaths?.chat || '/chat',
   boutique: cfg.apiPaths?.boutique || '/boutique',
 });

 // Helpers to normalize responses and build URLs
 const ok = (res) => res.data;
 const withId = (base, id) => `${base}/${encodeURIComponent(id)}`;

 // PUBLIC_INTERFACE
 /**
  * Bookings endpoints
  */
 export const bookings = {
   /**
    * List all bookings
    * @returns {Promise<import('./types').Booking[]>}
    */
   async list() {
     const res = await apiClient.get(BASES.bookings);
     return ok(res);
   },

   /**
    * Create a new booking
    * @param {Partial<import('./types').Booking>} booking
    * @returns {Promise<import('./types').Booking>}
    */
   async create(booking) {
     const res = await apiClient.post(BASES.bookings, booking);
     return ok(res);
   },

   /**
    * Get booking by ID
    * @param {string} id
    * @returns {Promise<import('./types').Booking>}
    */
   async getById(id) {
     const res = await apiClient.get(withId(BASES.bookings, id));
     return ok(res);
   },

   /**
    * Update booking by ID
    * @param {string} id
    * @param {Partial<import('./types').Booking>} booking
    * @returns {Promise<import('./types').Booking>}
    */
   async update(id, booking) {
     const res = await apiClient.put(withId(BASES.bookings, id), booking);
     return ok(res);
   },

   /**
    * Delete booking by ID
    * @param {string} id
    * @returns {Promise<void>}
    */
   async remove(id) {
     await apiClient.delete(withId(BASES.bookings, id));
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Loyalty endpoints
  */
 export const loyalty = {
   /**
    * List all loyalty accounts
    * @returns {Promise<import('./types').LoyaltyAccount[]>}
    */
   async list() {
     const res = await apiClient.get(BASES.loyalty);
     return ok(res);
   },

   /**
    * Create a loyalty account
    * @param {Partial<import('./types').LoyaltyAccount>} account
    * @returns {Promise<import('./types').LoyaltyAccount>}
    */
   async create(account) {
     const res = await apiClient.post(BASES.loyalty, account);
     return ok(res);
   },

   /**
    * Get loyalty account by ID
    * @param {string} id
    * @returns {Promise<import('./types').LoyaltyAccount>}
    */
   async getById(id) {
     const res = await apiClient.get(withId(BASES.loyalty, id));
     return ok(res);
   },

   /**
    * Update loyalty account by ID
    * @param {string} id
    * @param {Partial<import('./types').LoyaltyAccount>} account
    * @returns {Promise<import('./types').LoyaltyAccount>}
    */
   async update(id, account) {
     const res = await apiClient.put(withId(BASES.loyalty, id), account);
     return ok(res);
   },

   /**
    * Delete loyalty account by ID
    * @param {string} id
    * @returns {Promise<void>}
    */
   async remove(id) {
     await apiClient.delete(withId(BASES.loyalty, id));
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Analytics endpoints
  */
 export const analytics = {
   /**
    * Retrieve analytics payload
    * @returns {Promise<Object>}
    */
   async get() {
     const res = await apiClient.get(BASES.analytics);
     return ok(res);
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Payments endpoints
  */
 export const payments = {
   /**
    * Process a payment
    * @param {Partial<import('./types').Payment>} payment
    * @returns {Promise<import('./types').Payment>}
    */
   async create(payment) {
     const res = await apiClient.post(BASES.payments, payment);
     return ok(res);
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Notifications endpoints
  */
 export const notifications = {
   /**
    * Send a notification
    * @param {Partial<import('./types').Notification>} notification
    * @returns {Promise<import('./types').Notification>}
    */
   async create(notification) {
     const res = await apiClient.post(BASES.notifications, notification);
     return ok(res);
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Chat endpoints
  */
 export const chat = {
   /**
    * List chat messages
    * @returns {Promise<import('./types').ChatMessage[]>}
    */
   async list() {
     const res = await apiClient.get(BASES.chat);
     return ok(res);
   },

   /**
    * Send a chat message
    * @param {Partial<import('./types').ChatMessage>} message
    * @returns {Promise<import('./types').ChatMessage>}
    */
   async create(message) {
     const res = await apiClient.post(BASES.chat, message);
     return ok(res);
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Boutique endpoints
  */
 export const boutique = {
   /**
    * List boutique items
    * @returns {Promise<import('./types').BoutiqueItem[]>}
    */
   async list() {
     const res = await apiClient.get(BASES.boutique);
     return ok(res);
   },

   /**
    * Add a new boutique item
    * @param {Partial<import('./types').BoutiqueItem>} item
    * @returns {Promise<import('./types').BoutiqueItem>}
    */
   async create(item) {
     const res = await apiClient.post(BASES.boutique, item);
     return ok(res);
   },

   /**
    * Get boutique item by ID
    * @param {string} id
    * @returns {Promise<import('./types').BoutiqueItem>}
    */
   async getById(id) {
     const res = await apiClient.get(withId(BASES.boutique, id));
     return ok(res);
   },

   /**
    * Update boutique item by ID
    * @param {string} id
    * @param {Partial<import('./types').BoutiqueItem>} item
    * @returns {Promise<import('./types').BoutiqueItem>}
    */
   async update(id, item) {
     const res = await apiClient.put(withId(BASES.boutique, id), item);
     return ok(res);
   },

   /**
    * Delete boutique item by ID
    * @param {string} id
    * @returns {Promise<void>}
    */
   async remove(id) {
     await apiClient.delete(withId(BASES.boutique, id));
   },
 };

 // PUBLIC_INTERFACE
 /**
  * Default export: grouped API surface for convenient imports
  */
 const api = Object.freeze({
   bookings,
   loyalty,
   analytics,
   payments,
   notifications,
   chat,
   boutique,
 });

 export default api;
