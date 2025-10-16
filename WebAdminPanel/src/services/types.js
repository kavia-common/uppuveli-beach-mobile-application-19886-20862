 /**
  * Lightweight JSDoc typedefs mirroring the OpenAPI schemas.
  * These improve IDE IntelliSense and code navigation in a JS project.
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} Booking
  * @property {string} id
  * @property {string} guestName
  * @property {string} roomNumber
  * @property {string} checkIn ISO date-time
  * @property {string} checkOut ISO date-time
  * @property {'booked'|'checked_in'|'checked_out'|'cancelled'} status
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} LoyaltyAccount
  * @property {string} id
  * @property {string} guestId
  * @property {number} points
  * @property {string} tier
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} Payment
  * @property {string} id
  * @property {number} amount
  * @property {string} currency
  * @property {string} method
  * @property {string} status
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} Notification
  * @property {string} id
  * @property {string} type
  * @property {string} message
  * @property {string} recipientId
  * @property {string} status
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} ChatMessage
  * @property {string} id
  * @property {string} senderId
  * @property {string} recipientId
  * @property {string} message
  * @property {string} timestamp ISO date-time
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} BoutiqueItem
  * @property {string} id
  * @property {string} name
  * @property {string} description
  * @property {number} price
  * @property {number} stock
  */

 // PUBLIC_INTERFACE
 /**
  * @typedef {Object} Error
  * @property {string} error_code
  * @property {string} message
  * @property {Object<string, any>} [details]
  */

 export {};
