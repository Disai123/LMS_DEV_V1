import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { chapterService } from '../../services/chapterService'
import toast from 'react-hot-toast'
import LoadingSpinner from '../common/LoadingSpinner'

const ChapterManagement = ({ courseId, courseTitle }) => {
  const queryClient = useQueryClient()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [draggedChapter, setDraggedChapter] = useState(null)

  // Fetch chapters
  const { data: chaptersData, isLoading, error } = useQuery(
    ['chapters', courseId],
    () => chapterService.getCourseChapters(courseId, true), // Include unpublished
    {
      enabled: !!courseId,
      refetchOnWindowFocus: false
    }
  )

  const chapters = chaptersData?.data?.chapters || []

  // Create chapter mutation
  const createChapterMutation = useMutation(
    (chapterData) => chapterService.createChapter(courseId, chapterData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters', courseId])
        setShowCreateForm(false)
        toast.success('Chapter created successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to create chapter')
      }
    }
  )

  // Update chapter mutation
  const updateChapterMutation = useMutation(
    ({ chapterId, chapterData }) => chapterService.updateChapter(courseId, chapterId, chapterData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters', courseId])
        setEditingChapter(null)
        toast.success('Chapter updated successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update chapter')
      }
    }
  )

  // Delete chapter mutation
  const deleteChapterMutation = useMutation(
    (chapterId) => chapterService.deleteChapter(courseId, chapterId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters', courseId])
        toast.success('Chapter deleted successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete chapter')
      }
    }
  )

  // Toggle publish mutation
  const togglePublishMutation = useMutation(
    (chapterId) => chapterService.toggleChapterPublish(courseId, chapterId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters', courseId])
        toast.success('Chapter status updated!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update chapter status')
      }
    }
  )

  // Reorder chapters mutation
  const reorderChaptersMutation = useMutation(
    (chapterOrders) => chapterService.reorderChapters(courseId, chapterOrders),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chapters', courseId])
        toast.success('Chapters reordered successfully!')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to reorder chapters')
      }
    }
  )

  // Handle drag and drop
  const handleDragStart = (e, chapter) => {
    setDraggedChapter(chapter)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetChapter) => {
    e.preventDefault()
    if (!draggedChapter || draggedChapter.id === targetChapter.id) return

    const newChapters = [...chapters]
    const draggedIndex = newChapters.findIndex(ch => ch.id === draggedChapter.id)
    const targetIndex = newChapters.findIndex(ch => ch.id === targetChapter.id)

    // Remove dragged chapter and insert at new position
    const [draggedItem] = newChapters.splice(draggedIndex, 1)
    newChapters.splice(targetIndex, 0, draggedItem)

    // Update chapter orders
    const chapterOrders = newChapters.map((chapter, index) => ({
      id: chapter.id,
      chapter_order: index + 1
    }))

    reorderChaptersMutation.mutate(chapterOrders)
    setDraggedChapter(null)
  }


  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load chapters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Chapters</h3>
          <p className="text-sm text-gray-600">
            Manage the content structure of "{courseTitle}"
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          + Add Chapter
        </button>
      </div>

      {/* Chapters List */}
      <div className="space-y-3">
        <AnimatePresence>
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              draggable
              onDragStart={(e) => handleDragStart(e, chapter)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, chapter)}
              className={`card p-4 cursor-move hover:shadow-md transition-shadow ${
                draggedChapter?.id === chapter.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {chapter.chapter_order}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {chapter.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        chapter.content_type === 'video' 
                          ? 'bg-red-100 text-red-800'
                          : chapter.content_type === 'pdf'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {chapter.content_type.toUpperCase()}
                      </span>
                      {!chapter.is_published && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          DRAFT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chapter.description || 'No description'}
                    </p>
                    {chapter.duration_minutes && (
                      <p className="text-xs text-gray-400">
                        Duration: {chapter.duration_minutes} minutes
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingChapter(chapter)}
                    className="text-indigo-600 hover:text-indigo-500 p-1"
                    title="Edit chapter"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => togglePublishMutation.mutate(chapter.id)}
                    className={`p-1 ${
                      chapter.is_published 
                        ? 'text-yellow-600 hover:text-yellow-500' 
                        : 'text-green-600 hover:text-green-500'
                    }`}
                    title={chapter.is_published ? 'Unpublish chapter' : 'Publish chapter'}
                  >
                    {chapter.is_published ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this chapter?')) {
                        deleteChapterMutation.mutate(chapter.id)
                      }
                    }}
                    className="text-red-600 hover:text-red-500 p-1"
                    title="Delete chapter"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {chapters.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No chapters added yet. Create your first chapter to get started.</p>
          </div>
        )}
      </div>

      {/* Create Chapter Form */}
      {showCreateForm && (
        <ChapterForm
          courseId={courseId}
          onClose={() => setShowCreateForm(false)}
          onSubmit={createChapterMutation.mutate}
          isSubmitting={createChapterMutation.isLoading}
        />
      )}

      {/* Edit Chapter Form */}
      {editingChapter && (
        <ChapterForm
          courseId={courseId}
          chapter={editingChapter}
          onClose={() => setEditingChapter(null)}
          onSubmit={(data) => updateChapterMutation.mutate({ chapterId: editingChapter.id, chapterData: data })}
          isSubmitting={updateChapterMutation.isLoading}
        />
      )}
    </div>
  )
}

// Chapter Form Component
const ChapterForm = ({ courseId, chapter, onClose, onSubmit, isSubmitting }) => {
  // Determine content type based on existing URLs
  const getContentType = (chapter) => {
    if (chapter?.video_url && chapter?.pdf_url) return 'both'
    if (chapter?.video_url) return 'video'
    if (chapter?.pdf_url) return 'pdf'
    return 'video' // default
  }

  const [formData, setFormData] = useState({
    title: chapter?.title || '',
    description: chapter?.description || '',
    content_type: getContentType(chapter),
    video_url: chapter?.video_url || '',
    pdf_url: chapter?.pdf_url || '',
    external_url: chapter?.external_url || '',
    duration_minutes: chapter?.duration_minutes || '',
    is_published: chapter?.is_published ?? true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate based on content type
    if (formData.content_type === 'video' && !formData.video_url) {
      toast.error('Video URL is required for video content')
      return
    }
    if (formData.content_type === 'pdf' && !formData.pdf_url) {
      toast.error('PDF URL is required for PDF content')
      return
    }
    if (formData.content_type === 'url' && !formData.external_url) {
      toast.error('External URL is required for URL content')
      return
    }
    if (formData.content_type === 'both' && !formData.video_url && !formData.pdf_url) {
      toast.error('At least one URL (video or PDF) is required')
      return
    }

    const submitData = { ...formData }
    
    // Remove frontend-specific fields that don't exist in backend
    delete submitData.content_type
    delete submitData.external_url
    
    if (formData.duration_minutes) {
      submitData.duration_minutes = parseInt(formData.duration_minutes)
    }

    onSubmit(submitData)
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {chapter ? 'Edit Chapter' : 'Create New Chapter'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input w-full"
                placeholder="Enter chapter title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="input w-full"
                placeholder="Describe what this chapter covers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                value={formData.content_type}
                onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value }))}
                className="input w-full"
                required
              >
                <option value="video">Video</option>
                <option value="pdf">PDF Document</option>
                <option value="both">Both Video and PDF</option>
                <option value="url">External URL</option>
              </select>
            </div>

            {formData.content_type === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="input w-full"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            )}

            {formData.content_type === 'pdf' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF URL *
                </label>
                <input
                  type="url"
                  value={formData.pdf_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                  className="input w-full"
                  placeholder="https://example.com/document.pdf"
                />
              </div>
            )}

            {formData.content_type === 'both' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    className="input w-full"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF URL *
                  </label>
                  <input
                    type="url"
                    value={formData.pdf_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, pdf_url: e.target.value }))}
                    className="input w-full"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              </div>
            )}

            {formData.content_type === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  External URL *
                </label>
                <input
                  type="url"
                  value={formData.external_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                  className="input w-full"
                  placeholder="https://example.com/resource"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                className="input w-full"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Publish this chapter immediately
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (chapter ? 'Update Chapter' : 'Create Chapter')}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ChapterManagement
