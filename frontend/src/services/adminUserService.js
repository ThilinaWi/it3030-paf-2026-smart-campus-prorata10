import api from './api';

/**
 * Admin user management service.
 */
const adminUserService = {
  /**
   * Get all users for role management.
   * @returns {Promise<Array>}
   */
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  /**
   * Update user role.
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<object>}
   */
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};

export default adminUserService;
