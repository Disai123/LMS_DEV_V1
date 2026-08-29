import { useState } from 'react'
import { useQuery } from 'react-query'
import { userService } from '../../services/userService'
import LoadingSpinner from '../common/LoadingSpinner'

const formatScore = (value) => (value === null || value === undefined ? '—' : `${value}%`)
const formatMinutes = (minutes) => {
  const total = parseInt(minutes, 10) || 0
  if (total < 60) return `${total} min`
  const hours = Math.floor(total / 60)
  const mins = total % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

const StatusBadge = ({ passed, label }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {label}
  </span>
)

const AdminStudentPerformance = ({ studentId }) => {
  const [expandedCourseId, setExpandedCourseId] = useState(null)

  const { data, isLoading, error } = useQuery(
    ['student-performance', studentId],
    () => userService.getStudentPerformance(studentId),
    { enabled: !!studentId, refetchOnWindowFocus: false, staleTime: 60 * 1000 }
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center py-10">
        <p className="text-red-600 mb-2">Failed to load performance data.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    )
  }

  const summary = data?.data?.summary || {}
  const courses = data?.data?.courses || []

  if (courses.length === 0) {
    return (
      <div className="card text-center py-10 text-gray-500">
        No course enrollments yet. Performance data will appear once the student enrolls in courses.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Avg Progress', value: `${summary.avgProgress || 0}%` },
          { label: 'Time Spent', value: formatMinutes(summary.totalTimeSpentMinutes) },
          { label: 'Certified', value: summary.certified || 0 },
          { label: 'Tests Passed', value: summary.testsPassed || 0 },
          { label: 'Avg Total Marks', value: summary.avgTotalMarks != null ? `${summary.avgTotalMarks}%` : '—' }
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {courses.map((course) => {
          const isExpanded = expandedCourseId === course.enrollmentId
          const grades = course.grades || {}
          const breakdown = grades.breakdown || {}

          return (
            <div key={course.enrollmentId} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedCourseId(isExpanded ? null : course.enrollmentId)}
                className="w-full text-left"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 capitalize">
                        {course.status?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{course.progress || 0}% complete</span>
                      <span className="text-xs text-gray-500">{formatMinutes(course.timeSpent)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Marks</p>
                    <p className="text-2xl font-bold text-indigo-600">{formatScore(grades.totalMarks)}</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500">Quiz Average</p>
                      <p className="font-semibold text-gray-900">{formatScore(breakdown.chapterQuizAvg)}</p>
                      <p className="text-xs text-gray-400">Weight: {breakdown.quizWeight || 40}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500">Final Exam</p>
                      <p className="font-semibold text-gray-900">{formatScore(grades.finalExam?.bestScore)}</p>
                      <p className="text-xs text-gray-400">
                        {grades.finalExam
                          ? `${grades.finalExam.attempts || 0} attempt(s)`
                          : 'No final exam'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500">Weighted Total</p>
                      <p className="font-semibold text-gray-900">{formatScore(grades.totalMarks)}</p>
                      <p className="text-xs text-gray-400">Final weight: {breakdown.finalWeight || 60}%</p>
                    </div>
                  </div>

                  {(grades.chapterQuizzes?.length > 0 || course.chapters?.length > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Chapter Breakdown</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 border-b">
                              <th className="py-2 pr-4">Chapter</th>
                              <th className="py-2 pr-4">Content</th>
                              <th className="py-2 pr-4">Quiz Score</th>
                              <th className="py-2 pr-4">Attempts</th>
                              <th className="py-2">Quiz Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(course.chapters?.length ? course.chapters : grades.chapterQuizzes).map((row, index) => {
                              const chapter = course.chapters?.[index]
                              const quiz = grades.chapterQuizzes?.find((q) => q.chapterId === chapter?.chapterId)
                                || grades.chapterQuizzes?.[index]

                              return (
                                <tr key={row.chapterId || quiz?.chapterId || index} className="border-b border-gray-50">
                                  <td className="py-2 pr-4 font-medium text-gray-900">
                                    {chapter?.title || quiz?.title || `Chapter ${index + 1}`}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {chapter?.isCompleted ? (
                                      <StatusBadge passed label="Done" />
                                    ) : (
                                      <span className="text-gray-400">In progress</span>
                                    )}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {formatScore(chapter?.quizBestScore ?? quiz?.bestScore)}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {chapter?.quizAttempts ?? quiz?.attempts ?? 0}
                                  </td>
                                  <td className="py-2">
                                    {(chapter?.quizRequired || quiz) ? (
                                      <StatusBadge
                                        passed={chapter?.quizPassed ?? quiz?.passed}
                                        label={(chapter?.quizPassed ?? quiz?.passed) ? 'Passed' : 'Not passed'}
                                      />
                                    ) : (
                                      <span className="text-gray-400">No quiz</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {grades.finalExam && (
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{grades.finalExam.title || 'Final Exam'}</p>
                        <p className="text-gray-500">{grades.finalExam.attempts || 0} attempt(s)</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{formatScore(grades.finalExam.bestScore)}</span>
                        <StatusBadge passed={grades.finalExam.passed} label={grades.finalExam.passed ? 'Passed' : 'Failed'} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminStudentPerformance
