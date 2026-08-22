import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { analyzeUrl, getUrlTypeDisplayName, supportsEmbedding } from '../../utils/urlAnalyzer'
import toast from 'react-hot-toast'
import { FiCheck, FiAlertCircle, FiExternalLink, FiYoutube, FiFile, FiPlus, FiTrash2 } from 'react-icons/fi'

const CreateCourseNew = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [chapters, setChapters] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      difficulty: 'beginner',
      estimated_duration: 0,
      learning_objectives: [''],
      tags: []
    }
  })

  // Add chapter
  const addChapter = () => {
    const newChapter = {
      id: Date.now(), // Temporary ID for frontend
      title: '',
      description: '',
      video_url: '',
      pdf_url: '',
      chapter_order: chapters.length + 1,
      duration_minutes: 0,
      is_published: true
    }
    setChapters([...chapters, newChapter])
  }

  // Update chapter
  const updateChapter = useCallback((index, updatedChapter) => {
    setChapters(prevChapters => {
      const newChapters = [...prevChapters]
      newChapters[index] = { ...newChapters[index], ...updatedChapter }
      return newChapters
    })
  }, [])

  // Remove chapter
  const removeChapter = useCallback((index) => {
    setChapters(prevChapters => {
      const newChapters = prevChapters.filter((_, i) => i !== index)
      // Update chapter orders
      return newChapters.map((chapter, i) => ({
        ...chapter,
        chapter_order: i + 1
      }))
    })
  }, [])

  // Add learning objective
  const addObjective = () => {
    const currentObjectives = watch('learning_objectives') || []
    setValue('learning_objectives', [...currentObjectives, ''])
  }

  // Remove learning objective
  const removeObjective = (index) => {
    const currentObjectives = watch('learning_objectives') || []
    const newObjectives = currentObjectives.filter((_, i) => i !== index)
    setValue('learning_objectives', newObjectives)
  }

  // Create course mutation
  const createCourseMutation = useMutation(courseService.createCourse, {
    onSuccess: () => {
      queryClient.invalidateQueries('courses')
    }
  })

  // Form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const filteredData = {
        ...data,
        learning_objectives: data.learning_objectives.filter(obj => obj && obj.trim() !== ''),
        tags: Array.isArray(data.tags) ? data.tags : []
      }

      const courseResponse = await createCourseMutation.mutateAsync(filteredData)
      const courseId = courseResponse.data.course.id

      // Create chapters
      if (chapters.length > 0) {
        for (const chapter of chapters) {
          if (chapter.title.trim()) {
            // Create chapter with URL-based content
            const chapterData = {
              title: chapter.title,
              description: chapter.description,
              video_url: chapter.video_url || null,
              pdf_url: chapter.pdf_url || null,
              chapter_order: chapter.chapter_order,
              duration_minutes: chapter.duration_minutes,
              is_published: chapter.is_published
            }
            
            await courseService.createChapter(courseId, chapterData)
          }
        }
      }

      toast.success('Course and chapters created successfully!')
      navigate('/admin/courses')
    } catch (error) {
      console.error('Course creation error:', error)
      toast.error('Failed to create course')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
            <p className="text-gray-600">Build and publish your course content</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Course Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    {...register('title', { required: 'Course title is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Describe what students will learn in this course"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    {...register('difficulty', { required: 'Difficulty is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {errors.difficulty && (
                    <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Chapters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Chapters</h2>
                <button
                  type="button"
                  onClick={addChapter}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Chapter</span>
                </button>
              </div>

              {chapters.length === 0 ? (
                <div className="text-center py-12">
                  <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No chapters added yet</p>
                  <button
                    type="button"
                    onClick={addChapter}
                    className="btn-primary"
                  >
                    Add Your First Chapter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter, index) => (
                    <ChapterCard
                      key={chapter.id}
                      chapter={chapter}
                      index={index}
                      onUpdate={updateChapter}
                      onRemove={removeChapter}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/courses')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

// Chapter Card Component
const ChapterCard = ({ chapter, index, onUpdate, onRemove }) => {
  const [videoUrl, setVideoUrl] = useState(chapter.video_url || '')
  const [pdfUrl, setPdfUrl] = useState(chapter.pdf_url || '')
  const [title, setTitle] = useState(chapter.title || '')
  const [description, setDescription] = useState(chapter.description || '')
  const [videoAnalysis, setVideoAnalysis] = useState(null)
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false)
  const onUpdateRef = useRef(onUpdate)
  
  // Update the ref when onUpdate changes
  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  // Analyze video URL when it changes
  useEffect(() => {
    if (videoUrl) {
      setIsAnalyzingVideo(true)
      try {
        const analysis = analyzeUrl(videoUrl)
        setVideoAnalysis(analysis)
      } catch (error) {
        setVideoAnalysis(null)
      } finally {
        setIsAnalyzingVideo(false)
      }
    } else {
      setVideoAnalysis(null)
    }
  }, [videoUrl])

  // Update parent when chapter data changes (with debouncing to prevent infinite loops)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdateRef.current(index, {
        title,
        description,
        video_url: videoUrl,
        pdf_url: pdfUrl,
        video_analysis: videoAnalysis
      })
    }, 100) // 100ms debounce

    return () => clearTimeout(timeoutId)
  }, [title, description, videoUrl, pdfUrl, videoAnalysis, index])

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Chapter {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Chapter Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chapter Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter chapter title"
          />
        </div>

        {/* Chapter Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter chapter description"
          />
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL (YouTube/Google Drive)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/..."
          />
          {isAnalyzingVideo && (
            <p className="mt-1 text-sm text-blue-600">Analyzing video URL...</p>
          )}
          {videoAnalysis && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <FiCheck className="inline w-4 h-4 mr-1" />
                {getUrlTypeDisplayName(videoAnalysis.type)} detected
              </p>
              {videoAnalysis.embedUrl && (
                <p className="text-xs text-green-600 mt-1">
                  Embed URL: {videoAnalysis.embedUrl}
                </p>
              )}
            </div>
          )}
        </div>

        {/* PDF URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF URL (Google Drive)
          </label>
          <input
            type="url"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="https://drive.google.com/file/d/.../view"
          />
        </div>
      </div>
    </div>
  )
}

export default CreateCourseNew
