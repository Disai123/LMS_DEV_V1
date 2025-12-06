import api from './api';
import { storeToken, storeRefreshToken, storeUser, removeToken, removeRefreshToken, removeUser } from '../utils/storage';

/**
 * Register new user
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { user, token, refreshToken } = response.data.data;
    
    // Store tokens and user data
    storeToken(token);
    storeRefreshToken(refreshToken);
    storeUser(user);
    
    return { user, token, refreshToken };
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { user, token, refreshToken } = response.data.data;
    
    // Store tokens and user data
    storeToken(token);
    storeRefreshToken(refreshToken);
    storeUser(user);
    
    return { user, token, refreshToken };
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    const user = response.data.data;
    
    // Update stored user data
    storeUser(user);
    
    return user;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    removeToken();
    removeRefreshToken();
    removeUser();
  }
};

