import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import VideoPlayer from './VideoPlayer'
import SmartPDFViewer from './SmartPDFViewer'
import ChapterNavigation from './ChapterNavigation'
import TestTakingModal from './TestTakingModal'
import { enrollmentService } from '../../services/enrollmentService'
import useChapterTimeTracker from '../../hooks/useChapterTimeTracker'
import { buildCourseSteps } from '../../utils/courseSteps'
import { FiFile, FiPlay, FiEye, FiClipboard } from 'react-icons/fi'
import toast from 'react-hot-toast'

const StudentChapterView = ({ 
  chapter, 
  enrollmentId, 
  chapters = [], 
  onChapterChange, 
  showNavigation = true,
  isPreviewMode = false,
  isAuthenticatedNotEnrolled = false,
  courseId = null,
  hasAdminAccess = false,
  progressionData = null,
  preferredViewMode = 'video',
  onViewModeChange,
  onStepSelect
}) => {
  const [viewMode, setViewMode] = useState(preferredViewMode || 'video')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState({ rating: 0, review: '' })
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const queryClient = useQueryClient()
  
  const chapterProgress = progressionData?.chapters?.find((ch) => ch.id === chapter?.id)
  const isChapterCompleted = chapterProgress?.is_completed || false
  const quizRequired = chapterProgress?.quiz_required || !!(chapter?.test_id || chapter?.test)
  const quizPassed = chapterProgress?.quiz_passed || false
  const contentCompleted = chapterProgress?.content_completed || isChapterCompleted
  const quizUnlocked = chapterProgress?.quiz_unlocked || contentCompleted || hasAdminAccess

  const {
    canProceed,
    flushPendingTime
  } = useChapterTimeTracker({
    enrollmentId,
    chapterId: chapter?.id,
    durationMinutes: chapter?.duration_minutes || chapterProgress?.duration_minutes,
    initialTimeSpent: chapterProgress?.time_spent || 0,
    isCompleted: isChapterCompleted,
    enabled: !!enrollmentId && !isPreviewMode
  })

  const courseSteps = buildCourseSteps(chapters)
  const currentStepKey = viewMode === 'test' && quizRequired
    ? `quiz-${chapter?.id}`
    : `chapter-${chapter?.id}`
  const currentStepIndex = courseSteps.findIndex((step) => step.key === currentStepKey)

  const progressionCanProceed = chapterProgress?.can_proceed || false

  const requiresTimeGate = Boolean(enrollmentId && !isPreviewMode)
  // Enrolled students unlock Next only via 90% time (local tracker or backend can_proceed)
  // or after the chapter content is already completed — not via open-on-load engagement flags.
  const canGoNextOnChapter = isChapterCompleted
    || contentCompleted
    || progressionCanProceed
    || (requiresTimeGate ? canProceed : true)
  const canGoNextOnQuiz = false
  const canGoNext = viewMode === 'test' ? canGoNextOnQuiz : canGoNextOnChapter
  const showQuizPrompt = quizRequired && contentCompleted && !quizPassed && quizUnlocked && !hasAdminAccess
  
  // Check if user has full access
  const hasFullAccess = hasAdminAccess || (!isPreviewMode && !isAuthenticatedNotEnrolled && !!enrollmentId)

  // Debug enrollmentId
  console.log('=== StudentChapterView DEBUG ===')
  console.log('enrollmentId received:', enrollmentId)
  console.log('chapter received:', chapter)
  console.log('chapters array:', chapters)
  console.log('isPreviewMode:', isPreviewMode)
  console.log('hasFullAccess:', hasFullAccess)
  console.log('hasAdminAccess:', hasAdminAccess)
  console.log('================================')


  // Complete course mutation
  const completeCourseMutation = useMutation(
    () => {
      if (!enrollmentId) {
        throw new Error('Enrollment ID is required')
      }
      return enrollmentService.completeCourse(enrollmentId)
    },
    {
      onSuccess: (data) => {
        toast.success('Course completed successfully!')
        setShowFeedback(true) // Show feedback modal after completion
        // Invalidate all relevant queries to ensure UI updates
        queryClient.invalidateQueries(['course', chapter.course_id])
        queryClient.invalidateQueries(['course'])
        queryClient.invalidateQueries(['enrollment', enrollmentId])
        queryClient.invalidateQueries(['enrollment'])
        queryClient.invalidateQueries(['chapterProgression', enrollmentId])
        queryClient.invalidateQueries(['chapterProgression'])
        // Force refetch of course data to get updated progress
        queryClient.refetchQueries(['course', chapter.course_id])
      },
      onError: (error) => {
        console.error('Complete course error:', error)
        toast.error(error.message)
      }
    }
  )

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation(
    (feedbackData) => {
      if (!enrollmentId) {
        throw new Error('Enrollment ID is required')
      }
      return enrollmentService.submitCourseFeedback(enrollmentId, feedbackData)
    },
    {
      onSuccess: async () => {
        toast.success('Thank you for your feedback!')
        setShowFeedback(false)
        // Refresh enrollment/progression so Take Test unlocks without full page reload
        queryClient.invalidateQueries(['course', chapter.course_id])
        queryClient.invalidateQueries(['courses'])
        queryClient.invalidateQueries(['student-enrollments'])
        queryClient.invalidateQueries(['my-completed-courses'])
        queryClient.invalidateQueries(['chapterProgression', enrollmentId])
        queryClient.invalidateQueries(['chapterProgression'])
        queryClient.invalidateQueries(['course-tests'])
        await Promise.all([
          queryClient.refetchQueries(['chapterProgression', enrollmentId]),
          queryClient.refetchQueries(['course', chapter.course_id]),
          queryClient.refetchQueries(['student-enrollments']),
          queryClient.refetchQueries(['course-tests', chapter.course_id])
        ])
        window.dispatchEvent(new CustomEvent('showTestSection'))
      },
      onError: (error) => {
        console.error('Submit feedback error:', error)
        toast.error(error.message)
      }
    }
  )

  // Complete chapter mutation (for progress tracking)
  const completeChapterMutation = useMutation(
    () => {
      if (!enrollmentId) {
        throw new Error('Enrollment ID is required')
      }
      return enrollmentService.completeChapter(enrollmentId, chapter.id)
    },
    {
      onSuccess: async (data) => {
        if (data?.data?.requiresQuiz) {
          toast.success('Chapter content completed! Pass the quiz to continue.')
          setViewMode('test')
          onViewModeChange?.('test')
          onStepSelect?.({
            key: `quiz-${chapter.id}`,
            type: 'quiz',
            chapterId: chapter.id,
            chapter
          })
          await queryClient.refetchQueries(['chapterProgression', enrollmentId])
          return
        }
        toast.success('Chapter completed!')
        // Invalidate all relevant queries to ensure UI updates
        queryClient.invalidateQueries(['course', chapter.course_id])
        queryClient.invalidateQueries(['course'])
        queryClient.invalidateQueries(['enrollment', enrollmentId])
        queryClient.invalidateQueries(['enrollment'])
        queryClient.invalidateQueries(['chapterProgression', enrollmentId])
        queryClient.invalidateQueries(['chapterProgression'])
        queryClient.invalidateQueries('student-enrollments') // Refetch enrollment to get updated progress
        queryClient.invalidateQueries('student-stats') // Refetch stats to update progress and hours
        queryClient.invalidateQueries(['course-tests']) // Refetch tests to update unlock status
        // Force refetch of course data, progression, enrollment, and stats to get updated progress
        // IMPORTANT: Wait for chapterProgression to refetch so tests unlock immediately
        await Promise.all([
          queryClient.refetchQueries(['course', chapter.course_id]),
          queryClient.refetchQueries(['chapterProgression', enrollmentId]),
          queryClient.refetchQueries('student-enrollments'),
          queryClient.refetchQueries('student-stats'), // Refetch stats immediately
          queryClient.refetchQueries(['course-tests', chapter.course_id]) // Explicitly refetch tests
        ])
      },
      onError: (error) => {
        console.error('Complete chapter error:', error)
        toast.error(error.message)
      }
    }
  )

  const goToStep = (step) => {
    if (!step) return
    onStepSelect?.(step)
    const stepChapter = step.chapter || chapter
    const mode = step.type === 'quiz'
      ? 'test'
      : (stepChapter?.video_url || stepChapter?.video_embed_url || stepChapter?.has_video ? 'video' : 'pdf')
    setViewMode(mode)
    onViewModeChange?.(mode)
  }

  const goToNextStep = () => {
    const nextStep = courseSteps[currentStepIndex + 1]
    if (nextStep) goToStep(nextStep)
  }

  const goToPreviousStep = () => {
    const prevStep = courseSteps[currentStepIndex - 1]
    if (prevStep) goToStep(prevStep)
  }

  // Sync view mode from sidebar selection
  useEffect(() => {
    if (!chapter) return
    if (preferredViewMode) {
      setViewMode(preferredViewMode)
    } else {
      const hasVideo = !!(chapter.video_url || chapter.video_embed_url || chapter.has_video)
      const hasPDF = !!(chapter.pdf_url || chapter.has_pdf)
      if (hasVideo) setViewMode('video')
      else if (hasPDF) setViewMode('pdf')
    }
  }, [chapter?.id, preferredViewMode])

  if (!chapter) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <FiFile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chapter Selected</h3>
          <p className="text-gray-600">Select a chapter from the sidebar to view its content.</p>
        </div>
      </div>
    )
  }

  // Students get video_embed_url (raw video_url is stripped for download protection)
  const hasVideo = !!(chapter.video_url || chapter.video_embed_url || chapter.has_video)
  const hasPDF = !!(chapter.pdf_url || chapter.has_pdf)
  const hasTest = !!chapter.test_id || !!chapter.test || !!chapter.has_test
  const chapterTest = chapter.test || (chapter.test_id ? { id: chapter.test_id } : null)

  const handleTakeTest = () => {
    if (!enrollmentId && !hasAdminAccess) {
      toast.error('You must be enrolled to take this test')
      return
    }
    if (!quizUnlocked && !hasAdminAccess) {
      toast.error('Complete the chapter content before taking the quiz')
      return
    }
    setIsTestModalOpen(true)
  }

  const handleCloseTestModal = () => {
    setIsTestModalOpen(false)
    queryClient.invalidateQueries(['course', chapter.course_id])
    queryClient.invalidateQueries(['chapterProgression', enrollmentId])
    queryClient.invalidateQueries('student-enrollments')
    queryClient.invalidateQueries(['course-tests'])
    Promise.all([
      queryClient.refetchQueries(['course', chapter.course_id]),
      queryClient.refetchQueries(['chapterProgression', enrollmentId]),
      queryClient.refetchQueries('student-enrollments')
    ])
  }

  const handleQuizComplete = async () => {
    setIsTestModalOpen(false)
    await queryClient.refetchQueries(['chapterProgression', enrollmentId])
    goToNextStep()
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Compact Content Type Selector with Navigation */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200 px-4 py-2">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50"></div>
        <div className="relative flex items-center justify-between">
          {/* Left side - Previous button */}
          <div className="flex items-center space-x-3">
            {courseSteps.length > 0 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStepIndex <= 0}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentStepIndex > 0
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>
            )}
          </div>
          
          {/* Compact View Mode Toggle */}
          {(hasVideo || hasPDF) && viewMode !== 'test' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-1 shadow-sm">
                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('video')
                      onViewModeChange?.('video')
                      onStepSelect?.({
                        key: `chapter-${chapter.id}`,
                        type: 'chapter',
                        chapterId: chapter.id,
                        chapter
                      })
                    }}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'video'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <FiPlay className="w-3 h-3" />
                    <span>Video</span>
                  </button>
                )}
                {hasPDF && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('pdf')
                      onViewModeChange?.('pdf')
                      onStepSelect?.({
                        key: `chapter-${chapter.id}`,
                        type: 'chapter',
                        chapterId: chapter.id,
                        chapter
                      })
                    }}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      viewMode === 'pdf'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <FiEye className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Right side - Next/Complete (hidden on quiz steps; use Take Test + Submit there) */}
          <div className="flex items-center space-x-3">
            {viewMode !== 'test' && courseSteps.length > 0 && (
              <>
                {currentStepIndex === courseSteps.length - 1 ? (
                  enrollmentId ? (
                    <button
                      type="button"
                      onClick={async () => {
                        await flushPendingTime()
                        completeCourseMutation.mutate()
                      }}
                      disabled={completeCourseMutation.isLoading || !canGoNext}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {completeCourseMutation.isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span>{completeCourseMutation.isLoading ? 'Completing Course...' : 'Complete Course'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
                      <span>Course Preview</span>
                    </div>
                  )
                ) : viewMode !== 'test' && showQuizPrompt ? (
                  <button
                    type="button"
                    onClick={() => goToStep(courseSteps.find((s) => s.key === `quiz-${chapter.id}`))}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-purple-100 hover:bg-purple-200 text-purple-700"
                  >
                    <FiClipboard className="w-3 h-3" />
                    <span>Go to Quiz</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      if (enrollmentId) {
                        await flushPendingTime()
                        completeChapterMutation.mutate(undefined, {
                          onSuccess: (data) => {
                            if (data?.data?.requiresQuiz) return
                            goToNextStep()
                          }
                        })
                      } else {
                        goToNextStep()
                      }
                    }}
                    disabled={completeChapterMutation.isLoading || !canGoNext}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{completeChapterMutation.isLoading ? 'Completing...' : 'Next'}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Large Video/Content Area */}
      <div className="flex-1 bg-gradient-to-br from-white to-gray-50">
        {viewMode === 'test' && hasTest ? (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-indigo-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-12 max-w-2xl"
            >
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FiClipboard className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {chapterTest?.title || 'Chapter Test'}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {chapterTest?.description || 'Complete this test to demonstrate your understanding of the chapter material.'}
              </p>
              
              {chapterTest && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-2xl font-bold text-purple-600">{chapterTest.passing_score ?? '—'}%</div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-2xl font-bold text-indigo-600">
                      {chapterTest.time_limit_minutes ?? '∞'}
                    </div>
                    <div className="text-sm text-gray-600">Time Limit (min)</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-2xl font-bold text-blue-600">
                      {chapterTest.max_attempts ?? '∞'}
                    </div>
                    <div className="text-sm text-gray-600">Max Attempts</div>
                  </div>
                </div>
              )}

              {(hasFullAccess || hasAdminAccess) && (enrollmentId || hasAdminAccess) ? (
                <button
                  onClick={handleTakeTest}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <FiClipboard className="inline w-5 h-5 mr-2" />
                  Take Test
                </button>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-yellow-800 mb-4">
                    {isPreviewMode 
                      ? 'Login and enroll in this course to take the test.'
                      : 'You must be enrolled in this course to take the test.'
                    }
                  </p>
                  {isPreviewMode ? (
                    <Link
                      to={`/login?redirect=/courses/${courseId}`}
                      className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      Login to Access
                    </Link>
                  ) : (
                    <button
                      onClick={async () => {
                        try {
                          await enrollmentService.enrollInCourse(courseId)
                          window.location.reload()
                        } catch (err) {
                          toast.error('Failed to enroll. Please try again.')
                        }
                      }}
                      className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              )}

              {chapterTest?.instructions && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
                  <p className="text-sm text-blue-800">{chapterTest.instructions}</p>
                </div>
              )}
            </motion.div>
          </div>
        ) : viewMode === 'video' && hasVideo ? (
          hasFullAccess && (chapter.video_url || chapter.video_embed_url || chapter.has_video) ? (
            <VideoPlayer
              url={chapter.video_url}
              embedUrl={chapter.video_embed_url}
              title={chapter.title}
              className="h-full w-full"
            />
          ) : (
            // Preview mode - show locked video player
            <div className="relative h-full bg-black flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90"></div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-center p-8 max-w-2xl"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <FiPlay className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Video Content</h3>
                <p className="text-gray-300 mb-6">
                  {isPreviewMode 
                    ? 'Login and enroll to access this video content.'
                    : 'Enroll in this course to access video content.'
                  }
                </p>
                {isPreviewMode ? (
                  <Link
                    to={`/login?redirect=/courses/${courseId}`}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                  >
                    Login to Access
                  </Link>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await enrollmentService.enrollInCourse(courseId)
                        window.location.reload()
                      } catch (err) {
                        toast.error('Failed to enroll. Please try again.')
                      }
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                  >
                    Enroll Now
                  </button>
                )}
              </motion.div>
            </div>
          )
         ) : viewMode === 'pdf' && hasPDF ? (
           hasFullAccess && chapter.pdf_url ? (
             <SmartPDFViewer
               pdfUrl={chapter.pdf_url}
               title={chapter.title}
               className="h-full"
             />
           ) : (
             // Preview mode - show locked PDF viewer
             <div className="relative h-full bg-gray-100 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-90"></div>
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative z-10 text-center p-8 max-w-2xl"
               >
                 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                   <FiEye className="w-12 h-12 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 mb-4">PDF Content</h3>
                 <p className="text-gray-600 mb-6">
                   {isPreviewMode 
                     ? 'Login and enroll to view and download this PDF material.'
                     : 'Enroll in this course to view and download PDF materials.'
                   }
                 </p>
                 {isPreviewMode ? (
                   <Link
                     to={`/login?redirect=/courses/${courseId}`}
                     className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                   >
                     Login to Access
                   </Link>
                 ) : (
                   <button
                     onClick={async () => {
                       try {
                         await enrollmentService.enrollInCourse(courseId)
                         window.location.reload()
                       } catch (err) {
                         toast.error('Failed to enroll. Please try again.')
                       }
                     }}
                     className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                   >
                     Enroll Now
                   </button>
                 )}
               </motion.div>
             </div>
           )
         ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center p-12"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiFile className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Content Available</h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {!hasVideo && !hasPDF && !hasTest
                  ? 'This chapter doesn\'t have any content yet.'
                  : viewMode === 'video' 
                    ? 'This chapter doesn\'t have video content yet.'
                    : 'This chapter doesn\'t have PDF content yet.'}
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Chapter Navigation */}
      {showNavigation && enrollmentId && chapter && chapters.length > 0 && (
        <ChapterNavigation
          enrollmentId={enrollmentId}
          currentChapter={chapter}
          chapters={chapters}
          onChapterChange={onChapterChange}
          isLastChapter={chapters.findIndex(ch => ch.id === chapter.id) === chapters.length - 1}
          isCourseCompleted={false} // This will be updated based on enrollment status
        />
      )}

      {/* Feedback Modal */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rate this Course
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                      className={`text-2xl transition-colors ${
                        star <= feedback.rating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={feedback.review}
                  onChange={(e) => setFeedback(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your thoughts about this course..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                />
              </div>
            </div>

            {/* Mandatory Test Notice */}
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-purple-900">Test Required</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    You must complete the course test to finish this course. The review above is optional.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => {
                    // Skip review but still unlock / show the course test section
                    setShowFeedback(false)
                    Promise.all([
                      queryClient.refetchQueries(['chapterProgression', enrollmentId]),
                      queryClient.refetchQueries(['course', chapter.course_id]),
                      queryClient.refetchQueries(['student-enrollments'])
                    ]).finally(() => {
                      window.dispatchEvent(new CustomEvent('showTestSection', {
                        detail: { courseId: chapter.course_id }
                      }))
                    })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Skip Review
                </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (feedback.rating === 0) {
                      toast.error('Please select a rating')
                      return
                    }
                    submitFeedbackMutation.mutate(feedback)
                  }}
                  disabled={submitFeedbackMutation.isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitFeedbackMutation.isLoading ? 'Submitting...' : 'Submit Review & Take Test'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Test Taking Modal */}
      {hasTest && chapterTest && (
        <TestTakingModal
          isOpen={isTestModalOpen}
          onClose={handleCloseTestModal}
          test={chapterTest}
          enrollmentId={enrollmentId}
          onQuizComplete={handleQuizComplete}
        />
      )}

    </div>
  )
}

export default StudentChapterView
