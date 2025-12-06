const API_URL = process.env.API_URL || 'http://localhost:5001/api';

const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93'
};

const STORAGE_KEYS = {
  TOKEN: '@ecommerce_token',
  REFRESH_TOKEN: '@ecommerce_refresh_token',
  USER: '@ecommerce_user'
};

export { API_URL, COLORS, STORAGE_KEYS };

