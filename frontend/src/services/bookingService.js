import api from './api';

const normalizeArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

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
    return normalizeArrayPayload(response.data);
  },

  /**
   * Get all bookings (admin only).
   * @param {string} status - Optional status filter
   * @returns {Promise<Array>} List of all bookings
   */
  getAllBookings: async (status) => {
    const response = await api.get('/bookings', {
      params: status && status !== 'ALL' ? { status } : {},
    });
    return normalizeArrayPayload(response.data);
  },

  /**
   * Update booking status (admin only).
   * @param {string} id - Booking ID
   * @param {string} status - New status (APPROVED/REJECTED)
   * @param {string} reason - Decision reason
   * @returns {Promise<object>} Updated booking
   */
  updateBookingStatus: async (id, status, reason) => {
    const response = await api.patch(`/bookings/${id}/status`, { status, reason });
    return response.data;
  },

  checkAvailability: async ({ resourceId, date, startTime, endTime, excludeBookingId }) => {
    const params = { resourceId, date, startTime, endTime };
    if (excludeBookingId) {
      params.excludeBookingId = excludeBookingId;
    }
    const response = await api.get('/bookings/check-availability', { params });
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
