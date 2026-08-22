import { motion } from 'framer-motion'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseService } from '../services/courseService'
import { enrollmentService } from '../services/enrollmentService'
import { activityService } from '../services/activityService'
import Header from '../components/common/Header'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AllCoursesModal from '../components/course/AllCoursesModal'
import EnrolledCoursesModal from '../components/course/EnrolledCoursesModal'
import StudentCourseCard from '../components/course/StudentCourseCard'
import EnrolledCourseCard from '../components/course/EnrolledCourseCard'
import toast from 'react-hot-toast'

const StudentDashboard = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useQuery(
    'student-courses',
    () => courseService.getCourses({ limit: 6 }),
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, retry: 1 }
  )

  const { data: enrollmentsData, isLoading: enrollmentsLoading, error: enrollmentsError } = useQuery(
    'student-enrollments',
    () => enrollmentService.getMyEnrollments(),
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, retry: 1 }
  )

  const { data: activitiesData, isLoading: activitiesLoading } = useQuery(
    'student-activities',
    () => activityService.getMyActivities(5),
    { refetchOnWindowFocus: false, staleTime: 2 * 60 * 1000, retry: 1 }
  )

  const enrollMutation = useMutation(
    (courseId) => enrollmentService.enrollInCourse(courseId),
    {
      onSuccess: (_, courseId) => {
        toast.success('Successfully enrolled in course!')
        queryClient.invalidateQueries('student-enrollments')
        queryClient.invalidateQueries('student-courses')
        queryClient.invalidateQueries(['course', courseId])
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to enroll in course')
      }
    }
  )

  const [enrollingCourseId, setEnrollingCourseId] = useState(null)
  const [isAllCoursesModalOpen, setIsAllCoursesModalOpen] = useState(false)
  const [isEnrolledCoursesModalOpen, setIsEnrolledCoursesModalOpen] = useState(false)

  const isLoading = coursesLoading || enrollmentsLoading || activitiesLoading
  const courses = coursesData?.data?.courses || []
  const enrollments = enrollmentsData?.data?.enrollments || []
  const activities = activitiesData?.data?.activities || []

  const isEnrolled = (courseId) =>
    enrollments.some((enrollment) => enrollment.course?.id === courseId)

  const handleEnroll = async (courseData) => {
    const courseId = typeof courseData === 'object' ? courseData.id : courseData
    try {
      setEnrollingCourseId(courseId)
      await enrollMutation.mutateAsync(courseId)
    } finally {
      setEnrollingCourseId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (coursesError || enrollmentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-stone-100">
        <Header />
        <div className="flex items-center justify-center py-20 text-center px-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Dashboard</h1>
            <p className="text-gray-600 mb-6">Please refresh and try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  const completedCourses = enrollments.filter((e) => ['certified', 'completed'].includes(e.status)).length
  const inProgressCourses = enrollments.filter((e) => e.status === 'enrolled' && e.progress > 0 && e.progress < 100).length
  const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / Math.max(enrollments.length, 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-teal-50">
      <Header />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-amber-700 rounded-2xl shadow-2xl px-5 py-5"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
              Welcome, <span className="text-yellow-300">{user?.name || 'Student'}!</span>
            </h1>
            <p className="text-sm text-amber-100 mb-4">
              Continue your learning journey, complete courses, and earn certificates.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate('/courses')} className="px-3 py-1.5 bg-white text-slate-700 text-sm font-semibold rounded-lg">
                Browse Courses
              </button>
              <button onClick={() => navigate('/certificates')} className="px-3 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30">
                Certificates
              </button>
              <button onClick={() => navigate('/notifications')} className="px-3 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30">
                Notifications
              </button>
              <button onClick={() => navigate('/profile')} className="px-3 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30">
                Profile
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Enrolled', value: enrollments.length, color: 'from-blue-500 to-blue-600' },
              { label: 'Completed', value: completedCourses, color: 'from-green-500 to-emerald-600' },
              { label: 'In Progress', value: inProgressCourses, color: 'from-yellow-500 to-orange-500' },
              { label: 'Avg. Progress', value: `${Math.round(totalProgress)}%`, color: 'from-teal-500 to-cyan-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">My Courses</h3>
                <button onClick={() => setIsEnrolledCoursesModalOpen(true)} className="text-sm text-indigo-600 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment, index) => (
                  <EnrolledCourseCard
                    key={enrollment.id}
                    enrollment={enrollment}
                    index={index}
                    onContinue={(courseId) => navigate(`/courses/${courseId}`)}
                  />
                ))}
                {enrollments.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    <p className="mb-4">No courses enrolled yet.</p>
                    <button onClick={() => navigate('/courses')} className="px-4 py-2 bg-teal-700 text-white rounded-lg">
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Explore Courses</h3>
                <button onClick={() => setIsAllCoursesModalOpen(true)} className="text-sm text-indigo-600 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course, index) => (
                  <StudentCourseCard
                    key={course.id}
                    course={course}
                    index={index}
                    isEnrolled={isEnrolled(course.id)}
                    isEnrolling={enrollingCourseId === course.id}
                    enrollingCourseId={enrollingCourseId}
                    onEnroll={() => handleEnroll(course)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
              <p className="text-gray-600">No recent activity yet.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title || activity.activity_type}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <AllCoursesModal
        isOpen={isAllCoursesModalOpen}
        onClose={() => setIsAllCoursesModalOpen(false)}
      />

      <EnrolledCoursesModal
        isOpen={isEnrolledCoursesModalOpen}
        onClose={() => setIsEnrolledCoursesModalOpen(false)}
      />
    </div>
  )
}

export default StudentDashboard
