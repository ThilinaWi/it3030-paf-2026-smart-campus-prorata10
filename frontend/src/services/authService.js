import api from './api';

/**
 * Auth service — handles authentication API calls.
 */
const authService = {
  /**
   * Exchange Google credential token for JWT.
   * @param {string} googleToken - Google ID token from Google Sign-In
   * @returns {Promise<{token: string, tokenType: string, user: object}>}
   */
  googleLogin: async (googleToken) => {
    const response = await api.post('/auth/login', { token: googleToken });
    return response.data;
  },

  /**
   * Get the currently authenticated user's profile.
   * @returns {Promise<object>} User profile data
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
