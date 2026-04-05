import api from './api';

/**
 * Booking service — handles booking API calls.
 */
const bookingService = {
  /**
   * Create a new booking.
   * @param {object} bookingData - Booking details
   * @returns {Promise<object>} Created booking
   */
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Update an existing booking for current user.
   * @param {string} id - Booking ID
   * @param {object} bookingData - Updated booking details
   * @returns {Promise<object>} Updated booking
   */
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  /**
   * Get current user's bookings.
   * @returns {Promise<Array>} List of user's bookings
   */
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  /**
   * Get all bookings (admin only).
   * @returns {Promise<Array>} List of all bookings
   */
  getAllBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  /**
   * Update booking status (admin only).
   * @param {string} id - Booking ID
   * @param {string} status - New status (APPROVED/REJECTED)
   * @returns {Promise<object>} Updated booking
   */
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  /**
   * Cancel a booking (user only).
   * @param {string} id - Booking ID
   * @returns {Promise<object>} Cancelled booking
   */
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default bookingService;
