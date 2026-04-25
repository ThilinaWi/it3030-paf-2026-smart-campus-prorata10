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
   * Login with local email/password credentials.
   * @param {{email: string, password: string}} payload
   * @returns {Promise<{token: string, tokenType: string, user: object}>}
   */
  localLogin: async (payload) => {
    const response = await api.post('/auth/login/local', payload);
    return response.data;
  },

  /**
   * Register a local user account.
   * @param {{name: string, email: string, password: string, confirmPassword: string}} payload
   * @returns {Promise<{token: string, tokenType: string, user: object}>}
   */
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
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

  /**
   * Update current authenticated user's profile.
   * @param {{name: string, profilePicture?: string | null}} payload
   * @returns {Promise<object>} Updated user profile
   */
  updateCurrentUser: async (payload) => {
    const response = await api.put('/auth/me', payload);
    return response.data;
  },

  /**
   * Upload current user's profile picture file.
   * @param {File} file
   * @returns {Promise<object>} Updated user profile
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/auth/me/profile-picture', formData);
    return response.data;
  },
};

export default authService;
