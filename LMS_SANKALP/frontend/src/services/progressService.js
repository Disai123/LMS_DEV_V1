import { api } from './api'

export const progressService = {
  getChapterProgress: async (enrollmentId) => {
    const response = await api.get(`/progress/enrollment/${enrollmentId}`)
    return response.data
  },

  addTimeSpent: async (enrollmentId, chapterId, minutes) => {
    const response = await api.post(
      `/progress/enrollment/${enrollmentId}/chapter/${chapterId}/time-spent`,
      { minutes }
    )
    return response.data
  },

  markPdfViewed: async (enrollmentId, chapterId) => {
    const response = await api.post(
      `/progress/enrollment/${enrollmentId}/chapter/${chapterId}/pdf-viewed`
    )
    return response.data
  },

  markVideoWatched: async (enrollmentId, chapterId) => {
    const response = await api.post(
      `/progress/enrollment/${enrollmentId}/chapter/${chapterId}/video-watched`
    )
    return response.data
  }
}

export default progressService
