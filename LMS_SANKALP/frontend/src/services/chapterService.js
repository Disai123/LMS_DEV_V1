import { api } from './api';

export const chapterService = {
  // Get all chapters for a course
  getCourseChapters: async (courseId, includeUnpublished = false) => {
    const response = await api.get(`/courses/${courseId}/chapters`, {
      params: { includeUnpublished }
    });
    return response.data;
  },

  // Get a specific chapter
  getChapterById: async (courseId, chapterId) => {
    const response = await api.get(`/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  },

  // Create a new chapter
  createChapter: async (courseId, chapterData) => {
    const response = await api.post(`/courses/${courseId}/chapters`, chapterData);
    return response.data;
  },

  // Update a chapter
  updateChapter: async (courseId, chapterId, chapterData) => {
    const response = await api.put(`/courses/${courseId}/chapters/${chapterId}`, chapterData);
    return response.data;
  },

  // Delete a chapter
  deleteChapter: async (courseId, chapterId) => {
    const response = await api.delete(`/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  },

  // Reorder chapters
  reorderChapters: async (courseId, chapterOrders) => {
    const response = await api.put(`/courses/${courseId}/chapters/reorder`, {
      chapterOrders
    });
    return response.data;
  },

  // Toggle chapter publish status
  toggleChapterPublish: async (courseId, chapterId) => {
    const response = await api.patch(`/courses/${courseId}/chapters/${chapterId}/toggle-publish`);
    return response.data;
  }
};
