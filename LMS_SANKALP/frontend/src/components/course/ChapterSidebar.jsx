import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiFileText, FiClipboard } from 'react-icons/fi'
import { buildCourseSteps, getStepStatus } from '../../utils/courseSteps'

const ChapterSidebar = ({
  chapters = [],
  selectedStepKey = null,
  onStepSelect,
  courseTitle,
  progressionData = null,
  resumeChapterId = null,
  hasAdminAccess = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const courseSteps = useMemo(() => buildCourseSteps(chapters), [chapters])

  const resumeStepKey = useMemo(() => {
    if (!resumeChapterId) return null
    const chapterStep = courseSteps.find(
      (step) => step.type === 'chapter' && step.chapterId === resumeChapterId
    )
    return chapterStep?.key || null
  }, [courseSteps, resumeChapterId])

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Course Content</h3>
              <p className="text-xs text-gray-600 truncate">{courseTitle}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {courseSteps.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No chapters available</p>
          </div>
        ) : (
          <div className="p-1">
            {courseSteps.map((step, index) => {
              const { isAccessible, isCompleted, quizBestScore } = getStepStatus(
                step,
                progressionData,
                hasAdminAccess
              )
              const isSelected = selectedStepKey === step.key
              const isResumeTarget = resumeStepKey === step.key && !isCompleted
              const isQuiz = step.type === 'quiz'

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`mb-1 rounded-md border transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-200'
                      : isAccessible
                        ? 'hover:bg-gray-50 border-transparent'
                        : 'opacity-50 border-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => isAccessible && onStepSelect?.(step)}
                    disabled={!isAccessible}
                    className={`w-full p-2 text-left rounded-md transition-colors ${
                      isSelected
                        ? 'text-indigo-900'
                        : isAccessible
                          ? 'text-gray-700 hover:text-gray-900'
                          : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : isAccessible
                              ? isQuiz ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'
                              : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : step.stepNumber}
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <h4 className="text-xs font-medium truncate">{step.title}</h4>
                            {isResumeTarget && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold shrink-0">
                                Continue
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              {isQuiz ? (
                                <>
                                  <FiClipboard className="w-3 h-3 text-purple-500" />
                                  <span className="text-purple-600">Quiz</span>
                                </>
                              ) : step.subtitle === 'Video' ? (
                                <>
                                  <FiPlay className="w-3 h-3 text-red-500" />
                                  <span>Video lesson</span>
                                </>
                              ) : step.subtitle === 'PDF' ? (
                                <>
                                  <FiFileText className="w-3 h-3 text-blue-500" />
                                  <span>PDF lesson</span>
                                </>
                              ) : (
                                <span>{step.subtitle}</span>
                              )}
                            </span>
                            {isQuiz && isCompleted && quizBestScore != null && (
                              <span className="text-green-600 font-medium">{Math.round(quizBestScore)}%</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            {courseSteps.length} step{courseSteps.length !== 1 ? 's' : ''} in course
          </div>
        </div>
      )}
    </div>
  )
}

export default ChapterSidebar
