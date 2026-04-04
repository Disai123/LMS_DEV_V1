import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { courseService } from '../../services/courseService'
import toast from 'react-hot-toast'

const CourseManagement = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const queryClient = useQueryClient()

  // Delete course mutation
  const deleteCourseMutation = useMutation(
    (courseId) => courseService.deleteCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course deleted successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Publish course mutation
  const publishCourseMutation = useMutation(
    (courseId) => courseService.publishCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course published successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Unpublish course mutation
  const unpublishCourseMutation = useMutation(
    (courseId) => courseService.unpublishCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course unpublished successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  // Toggle Free/Premium mutation
  const toggleFreeMutation = useMutation(
    ({ id, is_free }) => courseService.updateCourse(id, { is_free }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course type updated successfully')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    }
  )

  const handleDelete = (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      deleteCourseMutation.mutate(courseId)
    }
  }

  const handlePublish = (courseId) => {
    publishCourseMutation.mutate(courseId)
  }

  const handleUnpublish = (courseId) => {
    unpublishCourseMutation.mutate(courseId)
  }

  const handleToggleFree = (id, currentStatus) => {
    toggleFreeMutation.mutate({ id, is_free: !currentStatus })
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published) ||
      (filterStatus === 'free' && course.is_free) ||
      (filterStatus === 'premium' && !course.is_free)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600 mt-1">Manage your courses and track their performance</p>
        </div>
        <Link
          to="/admin/courses/create"
          className="btn-primary mt-4 sm:mt-0"
        >
          Create New Course
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover p-6"
          >
            {/* Course Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.description || 'No description available'}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end ml-2">
                <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border backdrop-blur-sm ${course.is_published
                    ? 'bg-green-500/10 text-green-700 border-green-500/20'
                    : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                  }`}>
                  {course.is_published ? 'Live' : 'Draft'}
                </span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${course.is_free
                    ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                    : 'bg-violet-500/10 text-violet-700 border-violet-500/20'
                  }`}>
                  {course.is_free ? 'Free' : 'Premium'}
                </span>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {course.enrollment_count || 0}
                </div>
                <div className="text-xs text-gray-500">Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {course.average_rating || 0}
                </div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>

            {/* Course Meta */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="capitalize">{course.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="capitalize">{course.difficulty}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                to={`/courses/${course.id}`}
                className="flex-1 btn-secondary text-center text-sm py-2"
              >
                View
              </Link>
              <Link
                to={`/admin/courses/${course.id}/edit`}
                className="flex-1 btn-primary text-center text-sm py-2"
              >
                Edit
              </Link>
              <div className="flex flex-col space-y-1">
                {course.is_published ? (
                  <button
                    onClick={() => handleUnpublish(course.id)}
                    disabled={unpublishCourseMutation.isLoading}
                    className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => handlePublish(course.id)}
                    disabled={publishCourseMutation.isLoading}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => handleToggleFree(course.id, course.is_free)}
                  disabled={toggleFreeMutation.isLoading}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors duration-200 disabled:opacity-50 ${course.is_free
                      ? 'bg-violet-100 text-violet-800 hover:bg-violet-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                >
                  Make {course.is_free ? 'Premium' : 'Free'}
                </button>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  disabled={deleteCourseMutation.isLoading}
                  className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first course'
            }
          </p>
          <Link
            to="/admin/courses/create"
            className="btn-primary"
          >
            Create Your First Course
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default CourseManagement
