import { create } from 'zustand';
import { getUser } from '../utils/storage';
import * as authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth state from storage
  initialize: async () => {
    try {
      const user = await getUser();
      if (user) {
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    try {
      const { user, token } = await authService.login(email, password);
      set({ user, token, isAuthenticated: true });
      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const { user, token } = await authService.register(userData);
      set({ user, token, isAuthenticated: true });
      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  // Update user
  updateUser: (user) => {
    set({ user });
  }
}));

export default useAuthStore;

