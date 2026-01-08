import axios from 'axios'

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Use VITE_API_URL if set (for both development and production)
  if (import.meta.env.VITE_API_URL) {
    const url = import.meta.env.VITE_API_URL
    // Ensure the URL doesn't end with /api (we'll add it in the axios baseURL)
    return url.endsWith('/api') ? url : `${url}/api`
  }

  // Fallback for local development if VITE_API_URL is not set
  console.warn('⚠️ VITE_API_URL is not set. Using default: http://localhost:5000/api')
  console.warn('For production deployment, please set VITE_API_URL in your .env file')
  return 'http://localhost:5000/api'
}

const API_BASE_URL = getApiBaseUrl()

console.log('🔗 API Base URL:', API_BASE_URL)


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // List of routes that don't need authentication
    const publicRoutes = [
      '/auth/register',
      '/auth/login',
      '/auth/google',
      '/auth/google/callback',
      '/auth/refresh',
      '/courses/categories',
      '/courses/search',
      '/courses/popular',
      '/courses/top-rated'
    ]

    // Always add token if available (let backend decide what's public)
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      // Only warn for routes that definitely need authentication
      const protectedRoutes = ['/admin', '/users', '/enrollments']
      const needsAuth = protectedRoutes.some(route => config.url?.includes(route))
      if (needsAuth) {
        console.warn('No access token found for protected route:', config.url)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh and API errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle API URL configuration errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('❌ Network Error: Unable to connect to backend API')
      console.error('This usually means:')
      console.error('1. Backend server is not running')
      console.error('2. VITE_API_URL is not set correctly')
      console.error('3. CORS is not configured properly')
      console.error('Current API URL:', API_BASE_URL)

      // Show user-friendly error
      if (typeof window !== 'undefined') {
        const errorDiv = document.createElement('div')
        errorDiv.style.cssText = `
          position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
          background: #ff4444; color: white; padding: 10px; text-align: center;
          font-family: Arial, sans-serif; font-size: 14px;
        `
        errorDiv.innerHTML = `
          <strong>Connection Error:</strong> Cannot connect to backend API. 
          Please check if the backend server is running and VITE_API_URL is configured correctly.
        `
        document.body.appendChild(errorDiv)
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', newRefreshToken)

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export { api }
export default api
