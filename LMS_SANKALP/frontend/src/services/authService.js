import { api } from './api'

export const authService = {
  // Student registration
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Traditional login with username/password
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // If it's a network error (backend not running), return a specific response
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        return { success: false, message: 'Backend server not available' }
      }
      throw new Error(error.response?.data?.message || 'Failed to get current user')
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken: refreshToken })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to refresh token')
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to logout')
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const response = await api.put('/auth/profile', updates)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  },

  getMyStudentProfile: async () => {
    try {
      const response = await api.get('/auth/my-student-profile')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get student profile')
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password')
    }
  },

  // Get auth status
  getAuthStatus: async () => {
    try {
      const response = await api.get('/auth/status')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get auth status')
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/auth/account')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete account')
    }
  },

  // Password Reset Methods

  // Request password reset email
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/password-reset/request', { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email')
    }
  },

  // Validate reset token
  validateResetToken: async (token) => {
    try {
      const response = await api.get(`/password-reset/validate/${token}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to validate token')
    }
  },

  // Get user info for reset token
  getResetTokenInfo: async (token) => {
    try {
      const response = await api.get(`/password-reset/token-info/${token}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get token info')
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/password-reset/reset', { token, newPassword })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password')
    }
  }
}
