import { api } from './api'

export const scoreService = {
  // Get student's own score
  getMyScore: async () => {
    try {
      const response = await api.get('/scores/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get score')
    }
  },

  // Get student's achievements
  getMyAchievements: async () => {
    try {
      const response = await api.get('/scores/me/achievements')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get achievements')
    }
  },

  // Recalculate score — syncs any approved submissions that were missed
  recalculateMyScore: async () => {
    try {
      const response = await api.post('/scores/me/recalculate')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to recalculate score')
    }
  }
}

