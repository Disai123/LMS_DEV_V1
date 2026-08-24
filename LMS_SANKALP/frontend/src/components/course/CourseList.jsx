import { motion } from 'framer-motion'
import CourseCard from './CourseCard'
import LoadingSpinner from '../common/LoadingSpinner'
import { FiAlertCircle, FiBookOpen } from 'react-icons/fi'

const CourseList = ({ courses, isLoading, error, showInstructor = true, showRating = true }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Error loading courses</h3>
          <p className="text-gray-500 mb-6 text-sm">{error.message || 'Something went wrong'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-amber-400 text-slate-900 font-black rounded-xl hover:bg-amber-300 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiBookOpen className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500 text-sm">Try adjusting or clearing your filters.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="relative"
        >
          <CourseCard
            course={course}
            index={index}
            showInstructor={showInstructor}
            showRating={showRating}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default CourseList
