import { STORAGE_KEYS } from './constants';

/**
 * Store JWT token
 */
export const storeToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Get JWT token
 */
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove JWT token
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Store refresh token
 */
export const storeRefreshToken = (refreshToken) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
};

/**
 * Store user data
 */
export const storeUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

/**
 * Get user data
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUser = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

/**
 * Clear all stored data
 */
export const clearAll = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

