 /**
  * endpoints.js
  * PUBLIC_INTERFACE
  * Centralized API endpoint path builders compatible with OpenAPI paths.
  */
export const BASE_PATHS = Object.freeze({
  bookings: '/bookings',
  loyalty: '/loyalty',
  analytics: '/analytics',
  payments: '/payments',
  notifications: '/notifications',
  chat: '/chat',
  boutique: '/boutique',
});

// PUBLIC_INTERFACE
export const endpoints = {
  bookings: {
    list: () => BASE_PATHS.bookings,
    create: () => BASE_PATHS.bookings,
    detail: (id) => `${BASE_PATHS.bookings}/${encodeURIComponent(id)}`,
    update: (id) => `${BASE_PATHS.bookings}/${encodeURIComponent(id)}`,
    delete: (id) => `${BASE_PATHS.bookings}/${encodeURIComponent(id)}`,
  },
  loyalty: {
    list: () => BASE_PATHS.loyalty,
    create: () => BASE_PATHS.loyalty,
    detail: (id) => `${BASE_PATHS.loyalty}/${encodeURIComponent(id)}`,
    update: (id) => `${BASE_PATHS.loyalty}/${encodeURIComponent(id)}`,
    delete: (id) => `${BASE_PATHS.loyalty}/${encodeURIComponent(id)}`,
  },
  analytics: {
    get: () => BASE_PATHS.analytics,
  },
  payments: {
    create: () => BASE_PATHS.payments,
  },
  notifications: {
    create: () => BASE_PATHS.notifications,
  },
  chat: {
    list: () => BASE_PATHS.chat,
    create: () => BASE_PATHS.chat,
  },
  boutique: {
    list: () => BASE_PATHS.boutique,
    create: () => BASE_PATHS.boutique,
    detail: (id) => `${BASE_PATHS.boutique}/${encodeURIComponent(id)}`,
    update: (id) => `${BASE_PATHS.boutique}/${encodeURIComponent(id)}`,
    delete: (id) => `${BASE_PATHS.boutique}/${encodeURIComponent(id)}`,
  },
};

export default endpoints;
