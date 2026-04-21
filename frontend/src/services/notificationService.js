import api from './api';

/**
 * Notification service — handles notification API calls.
 */
const PREFERENCES_CACHE_KEY = 'smartcampus.notificationPreferences';

const DEFAULT_PREFERENCES = {
  statusUpdates: true,
  technicianUpdates: true,
  assignments: true,
  system: true,
};

const normalizePreferences = (preferences) => ({
  statusUpdates: preferences?.statusUpdates ?? true,
  technicianUpdates: preferences?.technicianUpdates ?? true,
  assignments: preferences?.assignments ?? true,
  system: preferences?.system ?? true,
});

const readCachedPreferences = () => {
  try {
    const raw = localStorage.getItem(PREFERENCES_CACHE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    return normalizePreferences(JSON.parse(raw));
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const writeCachedPreferences = (preferences) => {
  const normalized = normalizePreferences(preferences);
  try {
    localStorage.setItem(PREFERENCES_CACHE_KEY, JSON.stringify(normalized));
  } catch {
    // Ignore storage failures and keep runtime behavior stable.
  }

  return normalized;
};

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

  getPreferences: async () => {
    try {
      const response = await api.get('/users/preferences');
      return writeCachedPreferences(response.data);
    } catch {
      return readCachedPreferences();
    }
  },

  updatePreferences: async (preferences) => {
    const payload = writeCachedPreferences(preferences);

    try {
      const response = await api.put('/users/preferences', payload);
      return writeCachedPreferences(response.data);
    } catch (error) {
      // Fallback for environments that expose PATCH for partial preference updates.
      if (error?.response?.status === 405 || error?.response?.status === 404) {
        const response = await api.patch('/users/preferences', payload);
        return writeCachedPreferences(response.data);
      }

      return payload;
    }
  },
};

export default notificationService;
