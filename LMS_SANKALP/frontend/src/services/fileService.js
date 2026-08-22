import { api } from './api'

export const fileService = {
  // Download file
  downloadFile: async (id) => {
    try {
      const response = await api.get(`/files/${id}/download`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get download URL')
    }
  },

  // Preview file (for PDFs)
  previewFile: async (id) => {
    try {
      const response = await api.get(`/files/${id}/preview`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get preview URL')
    }
  },

  // Get course files
  getCourseFiles: async (courseId) => {
    try {
      const response = await api.get(`/files/course/${courseId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get course files')
    }
  },

  // Get file information
  getFileInfo: async (id) => {
    try {
      const response = await api.get(`/files/${id}/info`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get file information')
    }
  },

  // Upload file
  uploadFile: async (courseId, formData) => {
    try {
      const response = await api.post(`/courses/${courseId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file')
    }
  }
}
