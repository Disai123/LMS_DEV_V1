import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { courseService } from '../../services/courseService'
import { api } from '../../services/api'
import { analyzeUrl, getUrlTypeDisplayName, supportsEmbedding } from '../../utils/urlAnalyzer'
import toast from 'react-hot-toast'
import ChapterManagement from './ChapterManagement'
import { FiCheck, FiAlertCircle, FiExternalLink, FiYoutube, FiFile } from 'react-icons/fi'

const CreateCourse = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdCourseId, setCreatedCourseId] = useState(null)
  const [introContentType, setIntroContentType] = useState('video')
  const [introFile, setIntroFile] = useState(null)
  const [urlAnalysis, setUrlAnalysis] = useState(null)
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      video_url: '',
      category: 'other',
      difficulty: 'beginner',
      estimated_duration: 0,
      tags: [],
      learning_objectives: ['', '', ''], // Start with 3 empty objectives
      is_published: false
    }
  })

  const learningObjectives = watch('learning_objectives') || []
  const videoUrl = watch('video_url')
  const externalUrl = watch('external_url')

  // Analyze URL when it changes
  useEffect(() => {
    const urlToAnalyze = introContentType === 'video' ? videoUrl : externalUrl
    
    if (urlToAnalyze && urlToAnalyze.trim() !== '') {
      setIsAnalyzingUrl(true)
      const analysis = analyzeUrl(urlToAnalyze)
      setUrlAnalysis(analysis)
      setIsAnalyzingUrl(false)
    } else {
      setUrlAnalysis(null)
    }
  }, [videoUrl, externalUrl, introContentType])

  // Add learning objective
  const addLearningObjective = () => {
    const currentObjectives = learningObjectives || []
    setValue('learning_objectives', [...currentObjectives, ''])
  }

  // Remove learning objective
  const removeLearningObjective = (index) => {
    const currentObjectives = learningObjectives || []
    const newObjectives = currentObjectives.filter((_, i) => i !== index)
    setValue('learning_objectives', newObjectives)
  }

  // Handle file upload for course introduction
  const handleIntroFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (introContentType === 'pdf' && file.type === 'application/pdf') {
        setIntroFile(file)
        toast.success('PDF file selected successfully!')
      } else if (introContentType === 'video' && (file.type.startsWith('video/') || file.type === 'application/octet-stream')) {
        setIntroFile(file)
        toast.success('Video file selected successfully!')
      } else {
        toast.error(`Please select a valid ${introContentType.toUpperCase()} file`)
        setIntroFile(null)
      }
    }
  }

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        setLogoFile(file)
        
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          setLogoPreview(e.target.result)
        }
        reader.readAsDataURL(file)
        
        toast.success('Logo selected successfully!')
      } else {
        toast.error('Please select a valid image file (PNG, JPG, GIF, etc.)')
        setLogoFile(null)
        setLogoPreview(null)
      }
    }
  }

  // Create course mutation
  const createCourseMutation = useMutation(
    (courseData) => courseService.createCourse(courseData),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course created successfully!')
        setCreatedCourseId(response.data.course.id)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Filter out empty learning objectives and tags
      const filteredData = {
        ...data,
        learning_objectives: data.learning_objectives.filter(obj => obj && obj.trim() !== ''),
        tags: Array.isArray(data.tags) ? data.tags : [],
        intro_content_type: introContentType
      }

      // Remove video_url if not using video content type
      if (introContentType !== 'video') {
        delete filteredData.video_url
      }

      // Remove external_url if not using external URL content type
      if (introContentType !== 'url') {
        delete filteredData.external_url
      }

      // Add URL analysis data if available
      if (urlAnalysis && urlAnalysis.isValid) {
        filteredData.url_analysis = {
          type: urlAnalysis.type,
          embed_url: urlAnalysis.embedUrl,
          video_id: urlAnalysis.videoId,
          file_id: urlAnalysis.fileId,
          thumbnail: urlAnalysis.thumbnail,
          supports_embedding: supportsEmbedding(urlAnalysis.type)
        }
      }

      // Handle file uploads if needed
      if (introContentType === 'pdf' && introFile) {
        try {
          const formData = new FormData()
          formData.append('files', introFile)
          
          // First create the course without the file
          const courseResponse = await createCourseMutation.mutateAsync(filteredData)
          const courseId = courseResponse.data.course.id
          
          // Then upload the file and update the course
          const fileResponse = await api.post(`/courses/${courseId}/files`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          
          if (fileResponse.data) {
            const fileData = fileResponse.data
            // Update course with file ID
            const updateResponse = await api.put(`/courses/${courseId}`, {
              intro_file_id: fileData.data.files[0].id
            })
            
            if (!updateResponse.data) {
              throw new Error('Failed to update course with file reference')
            }
            
            toast.success('Course and file uploaded successfully!')
          } else {
            throw new Error('File upload failed')
          }
        } catch (fileError) {
          console.error('File upload error:', fileError)
          toast.error('Course created but file upload failed')
        }
      } else if (logoFile) {
        try {
          const formData = new FormData()
          formData.append('logo', logoFile)
          
          // First create the course without the logo
          const courseResponse = await createCourseMutation.mutateAsync(filteredData)
          const courseId = courseResponse.data.course.id
          
          // Then upload the logo and update the course
          const logoResponse = await api.post(`/courses/${courseId}/logo`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          
          if (logoResponse.data) {
            const logoData = logoResponse.data
            // Update course with logo URL
            const updateResponse = await api.put(`/courses/${courseId}`, {
              logo: logoData.data.logoUrl
            })
            
            if (!updateResponse.data) {
              throw new Error('Failed to update course with logo')
            }
            
            toast.success('Course and logo uploaded successfully!')
          } else {
            throw new Error('Logo upload failed')
          }
        } catch (logoError) {
          console.error('Logo upload error:', logoError)
          toast.error('Course created but logo upload failed')
        }
      } else {
        // For video URL and external URL, just create the course
        await createCourseMutation.mutateAsync(filteredData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ]

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Create New Course</h2>
          <p className="text-gray-600 mt-2">
            Build an engaging course with multimedia content and clear learning objectives.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Course title is required' })}
                      className="input w-full"
                      placeholder="Enter course title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="input w-full"
                      placeholder="Describe what students will learn in this course"
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Upload a logo for your course (PNG, JPG, GIF, WebP, SVG, etc.)
                    </p>
                    
                    {logoPreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Course Introduction Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Introduction Content
                    </label>
                    
                    {/* Content Type Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="video"
                            checked={introContentType === 'video'}
                            onChange={(e) => setIntroContentType(e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Video URL</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="pdf"
                            checked={introContentType === 'pdf'}
                            onChange={(e) => setIntroContentType(e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">PDF Upload</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="url"
                            checked={introContentType === 'url'}
                            onChange={(e) => setIntroContentType(e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">External URL</span>
                        </label>
                      </div>
                    </div>

                    {/* Content Input based on type */}
                    {introContentType === 'video' && (
                      <div>
                        <input
                          type="url"
                          {...register('video_url')}
                          className="input w-full"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Add a YouTube, Vimeo, or other video URL for course introduction
                        </p>
                        
                        {/* URL Analysis Results */}
                        {isAnalyzingUrl && (
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                            Analyzing URL...
                          </div>
                        )}
                        
                        {urlAnalysis && !isAnalyzingUrl && (
                          <div className={`mt-2 p-3 rounded-lg border ${
                            urlAnalysis.isValid 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-start">
                              {urlAnalysis.isValid ? (
                                <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                              ) : (
                                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center">
                                  {urlAnalysis.type === 'youtube' && <FiYoutube className="w-4 h-4 text-red-500 mr-1" />}
                                  {urlAnalysis.type === 'google_drive' && <FiFile className="w-4 h-4 text-blue-500 mr-1" />}
                                  <span className="text-sm font-medium">
                                    {getUrlTypeDisplayName(urlAnalysis.type)}
                                  </span>
                                  {supportsEmbedding(urlAnalysis.type) && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      Embeddable
                                    </span>
                                  )}
                                </div>
                                {urlAnalysis.isValid ? (
                                  <p className="text-sm text-green-700 mt-1">
                                    {urlAnalysis.description}
                                  </p>
                                ) : (
                                  <p className="text-sm text-red-700 mt-1">
                                    {urlAnalysis.error}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {introContentType === 'pdf' && (
                      <div>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleIntroFileChange}
                          className="input w-full"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Upload a PDF document for course introduction
                        </p>
                        {introFile && (
                          <p className="mt-1 text-sm text-green-600">
                            Selected: {introFile.name}
                          </p>
                        )}
                      </div>
                    )}

                    {introContentType === 'url' && (
                      <div>
                        <input
                          type="url"
                          {...register('external_url')}
                          className="input w-full"
                          placeholder="https://example.com/course-intro"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Add an external URL for course introduction
                        </p>
                        
                        {/* URL Analysis Results */}
                        {isAnalyzingUrl && (
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                            Analyzing URL...
                          </div>
                        )}
                        
                        {urlAnalysis && !isAnalyzingUrl && (
                          <div className={`mt-2 p-3 rounded-lg border ${
                            urlAnalysis.isValid 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-start">
                              {urlAnalysis.isValid ? (
                                <FiCheck className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                              ) : (
                                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center">
                                  {urlAnalysis.type === 'youtube' && <FiYoutube className="w-4 h-4 text-red-500 mr-1" />}
                                  {urlAnalysis.type === 'google_drive' && <FiFile className="w-4 h-4 text-blue-500 mr-1" />}
                                  <span className="text-sm font-medium">
                                    {getUrlTypeDisplayName(urlAnalysis.type)}
                                  </span>
                                  {supportsEmbedding(urlAnalysis.type) && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      Embeddable
                                    </span>
                                  )}
                                </div>
                                {urlAnalysis.isValid ? (
                                  <p className="text-sm text-green-700 mt-1">
                                    {urlAnalysis.description}
                                  </p>
                                ) : (
                                  <p className="text-sm text-red-700 mt-1">
                                    {urlAnalysis.error}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
                  <button
                    type="button"
                    onClick={addLearningObjective}
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    + Add Objective
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  What will students be able to do after completing this course?
                </p>
                
                <div className="space-y-3">
                  {learningObjectives.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        {...register(`learning_objectives.${index}`)}
                        className="input flex-1"
                        placeholder={`Learning objective ${index + 1}`}
                      />
                      {learningObjectives.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLearningObjective(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Settings */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      {...register('category')}
                      className="input w-full"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      {...register('difficulty')}
                      className="input w-full"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Duration (hours)
                    </label>
                    <input
                      type="number"
                      {...register('estimated_duration', { min: 0 })}
                      className="input w-full"
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('is_published')}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Publish course immediately
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add tags to help students find your course
                </p>
                
                <div className="space-y-2">
                  {['react', 'javascript', 'web-development', 'programming', 'tutorial'].map((tag) => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        value={tag}
                        {...register('tags')}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/admin/courses')}
                    className="btn-secondary w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Chapter Management - Show after course creation */}
        {createdCourseId && (
          <div className="mt-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Course Chapters</h3>
                  <p className="text-sm text-gray-600">
                    Manage the content structure of "{watch('title') || 'Course'}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/courses/${createdCourseId}/edit`)}
                  className="btn-primary"
                >
                  Manage Chapters
                </button>
              </div>
              
              <div className="text-center py-8 text-gray-500">
                <p>Course created successfully! Click "Manage Chapters" to add content.</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate('/admin/courses')}
                className="btn-primary"
              >
                Finish & Go to Courses
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default CreateCourse
