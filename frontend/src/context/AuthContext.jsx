import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { TOKEN_KEY } from '../utils/constants';

export const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state across the application.
 * Provides user data, login/logout functions, and loading state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Load the current user's profile from the backend.
   */
  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with Google — exchange Google token for JWT, store it, and load user.
   */
  const login = useCallback(async (googleToken) => {
    try {
      setLoading(true);
      const response = await authService.googleLogin(googleToken);
      localStorage.setItem(TOKEN_KEY, response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login with local email/password credentials.
   */
  const loginWithPassword = useCallback(async (payload) => {
    try {
      setLoading(true);
      const response = await authService.localLogin(payload);
      localStorage.setItem(TOKEN_KEY, response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Local login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register a local account and sign in immediately.
   */
  const register = useCallback(async (payload) => {
    try {
      setLoading(true);
      const response = await authService.register(payload);
      localStorage.setItem(TOKEN_KEY, response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update current user's profile details and keep context in sync.
   */
  const updateProfile = useCallback(async (payload) => {
    const updatedUser = await authService.updateCurrentUser(payload);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  /**
   * Upload current user's profile picture and sync auth user state.
   */
  const uploadProfilePicture = useCallback(async (file) => {
    const updatedUser = await authService.uploadProfilePicture(file);
    setUser(updatedUser);
    return updatedUser;
  }, []);

  /**
   * Logout — remove token and clear user state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    loginWithPassword,
    register,
    updateProfile,
    uploadProfilePicture,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
