import { api } from './api'

export const userService = {
  // Get all users (admin only)
  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/users', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get users')
    }
  },

  // Get students (admin only)
  getStudents: async (params = {}) => {
    try {
      const response = await api.get('/users/students', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get students')
    }
  },

  // Search users (admin only)
  searchUsers: async (params = {}) => {
    try {
      const response = await api.get('/users/search', { params })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search users')
    }
  },

  // Get user by ID (admin only)
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user')
    }
  },

  // Create user (admin only)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  },

  // Update user (admin only)
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  },

  // Activate user (admin only)
  activateUser: async (id) => {
    try {
      const response = await api.put(`/users/${id}/activate`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to activate user')
    }
  },

  // Deactivate user (admin only)
  deactivateUser: async (id) => {
    try {
      const response = await api.put(`/users/${id}/deactivate`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate user')
    }
  },

  // Get user courses (admin only)
  getUserCourses: async (id) => {
    try {
      const response = await api.get(`/users/${id}/courses`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user courses')
    }
  },

  // Get user enrollments (admin only)
  getUserEnrollments: async (id) => {
    try {
      const response = await api.get(`/users/${id}/enrollments`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user enrollments')
    }
  },

  // Update user plan type (admin only)
  updateUserPlan: async (id, plan_type) => {
    try {
      const response = await api.put(`/users/${id}/plan-type`, { plan_type })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user plan')
    }
  }
}

