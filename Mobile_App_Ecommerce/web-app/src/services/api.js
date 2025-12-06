import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken, getRefreshToken, storeToken, clearAll } from '../utils/storage';

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
  (config) => {
    const token = getToken();
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
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token - check if this is a public endpoint
          const publicEndpoints = ['/products', '/categories'];
          const isPublicEndpoint = publicEndpoints.some(endpoint => 
            originalRequest.url?.includes(endpoint)
          );
          
          // Don't redirect for public endpoints or cart (cart handles 401 gracefully)
          // Only redirect for authenticated endpoints like /orders, /profile, etc.
          if (!isPublicEndpoint && !originalRequest.url?.includes('/cart')) {
            clearAll();
            // Only redirect if not already on login/register page
            if (!window.location.pathname.includes('/login') && 
                !window.location.pathname.includes('/register')) {
              window.location.href = '/login';
            }
          }
          return Promise.reject(error);
        }

        // Try to refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        });

        const { token } = response.data.data;
        
        // Store new token
        storeToken(token);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - check if this is a public endpoint
        const publicEndpoints = ['/products', '/categories'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
          originalRequest.url?.includes(endpoint)
        );
        
        // Don't redirect for public endpoints or cart
        if (!isPublicEndpoint && !originalRequest.url?.includes('/cart')) {
          clearAll();
          // Only redirect if not already on login/register page
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

