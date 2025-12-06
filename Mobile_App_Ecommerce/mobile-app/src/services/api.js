import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken, getRefreshToken, storeToken, removeToken, removeRefreshToken, clearAll } from '../utils/storage';
import { authStore } from '../store/authStore';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, logout user
          await clearAll();
          authStore.getState().logout();
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { token } = response.data.data;
        
        // Store new token
        await storeToken(token);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await clearAll();
        authStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

