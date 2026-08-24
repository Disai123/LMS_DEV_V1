import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const DashboardOverview = ({ courses, stats }) => {
  const recentCourses = courses?.slice(0, 5) || []

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link to="/admin/courses/create" className="card-hover p-6 text-center group">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Course</h3>
          <p className="text-gray-600 text-sm">Add chapters, tests, and publish content</p>
        </Link>

        <Link to="/admin/courses" className="card-hover p-6 text-center group">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Courses</h3>
          <p className="text-gray-600 text-sm">Edit the Python course and publish updates</p>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
          <Link to="/admin/courses" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {recentCourses.length > 0 ? (
            recentCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {course.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">
                    {course.is_published ? 'Published' : 'Draft'} · {course.enrollment_count || 0} enrolled
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.is_published ? 'Live' : 'Draft'}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No courses yet.</p>
              <Link to="/admin/courses/create" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium mt-2 inline-block">
                Create your first course
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.round(stats?.completionRate || 0)}%</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Completion Rate</h4>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{stats?.totalEnrolled || 0}</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Enrollments</h4>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.round(stats?.averageProgress || 0)}%</span>
            </div>
            <h4 className="text-sm font-medium text-gray-900">Avg Progress</h4>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview
