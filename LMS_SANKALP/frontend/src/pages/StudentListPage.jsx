import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { enrollmentService } from '../services/enrollmentService'
import LoadingSpinner from '../components/common/LoadingSpinner'

const StudentListPage = ({ embedded = false }) => {
  const { user, isAuthenticated } = useAuth()

  const { data: studentsData, isLoading } = useQuery(
    'students',
    () => userService.getStudents({ limit: 100 }),
    {
      enabled: isAuthenticated && user?.role === 'admin',
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
    }
  )

  const { data: statsData } = useQuery(
    'admin-stats-students',
    () => enrollmentService.getAdminStats(),
    {
      enabled: isAuthenticated && user?.role === 'admin',
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
    }
  )

  if (isLoading) {
    return embedded ? (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const students = studentsData?.data?.students || []
  const stats = statsData?.data?.stats || {}

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600 mt-1">View student progress, enrollments, and certificates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm font-medium text-gray-500">Total Students</p>
          <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-gray-500">Active Enrollments</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalActive || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-gray-500">Avg Progress</p>
          <p className="text-2xl font-semibold text-gray-900">{Math.round(stats.averageProgress || 0)}%</p>
        </div>
        <div className="card">
          <p className="text-sm font-medium text-gray-500">Certificates Issued</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalCertificates || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <img
                src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=6366f1&color=fff`}
                alt={student.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{student.name}</h3>
                <p className="text-sm text-gray-500 truncate">{student.email}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                  student.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {student.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <Link
              to={`/admin/students/${student.id}`}
              className="block w-full text-center mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              View Progress & Certificates
            </Link>
          </motion.div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12 card">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
          <p className="text-gray-500">Students will appear here once they register and enroll.</p>
        </div>
      )}
    </motion.div>
  )

  if (embedded) return content

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{content}</div>
    </div>
  )
}

export default StudentListPage
