import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/**
 * Store JWT token
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

/**
 * Get JWT token
 */
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Remove JWT token
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Store refresh token
 */
export const storeRefreshToken = async (refreshToken) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error removing refresh token:', error);
  }
};

/**
 * Store user data
 */
export const storeUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

/**
 * Get user data
 */
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

/**
 * Clear all stored data
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

