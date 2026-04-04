import api from './api';

/**
 * Notification service — handles notification API calls.
 */
const notificationService = {
  /**
   * Get all notifications for the current user.
   * @returns {Promise<Array>} List of notifications
   */
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  /**
   * Get unread notification count.
   * @returns {Promise<{count: number}>}
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a specific notification as read.
   * @param {string} id - Notification ID
   * @returns {Promise<object>} Updated notification
   */
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read.
   * @returns {Promise<void>}
   */
  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },
};

export default notificationService;
