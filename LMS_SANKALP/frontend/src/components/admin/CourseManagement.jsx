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

  const deleteCourseMutation = useMutation(
    (courseId) => courseService.deleteCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course deleted successfully')
      },
      onError: (error) => toast.error(error.message)
    }
  )

  const publishCourseMutation = useMutation(
    (courseId) => courseService.publishCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course published successfully')
      },
      onError: (error) => toast.error(error.message)
    }
  )

  const unpublishCourseMutation = useMutation(
    (courseId) => courseService.unpublishCourse(courseId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses')
        toast.success('Course unpublished successfully')
      },
      onError: (error) => toast.error(error.message)
    }
  )

  const handleDelete = (courseId, courseTitle) => {
    if (window.confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      deleteCourseMutation.mutate(courseId)
    }
  }

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && course.is_published) ||
      (filterStatus === 'draft' && !course.is_published)
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sm:w-44 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Course cards */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {course.title?.charAt(0) || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-slate-900 line-clamp-1">{course.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        course.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {course.is_published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {course.description || 'No description'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
                  <span className="capitalize px-2 py-1 bg-slate-100 rounded-md">{course.category}</span>
                  <span className="capitalize px-2 py-1 bg-slate-100 rounded-md">{course.difficulty}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-indigo-50 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-indigo-600">{course.enrollment_count || 0}</p>
                    <p className="text-xs text-slate-500">Enrolled</p>
                  </div>
                  <div className="rounded-lg bg-violet-50 px-3 py-2 text-center">
                    <p className="text-lg font-bold text-violet-600">{course.average_rating || 0}</p>
                    <p className="text-xs text-slate-500">Rating</p>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 border-t border-slate-100">
                <div className="flex flex-wrap gap-2 pt-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex-1 min-w-[70px] text-center px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="flex-1 min-w-[70px] text-center px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/admin/courses/${course.id}/edit#tests`}
                    className="flex-1 min-w-[70px] text-center px-3 py-2 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors"
                  >
                    Tests
                  </Link>
                  {course.is_published ? (
                    <button
                      onClick={() => unpublishCourseMutation.mutate(course.id)}
                      disabled={unpublishCourseMutation.isLoading}
                      className="flex-1 min-w-[70px] px-3 py-2 text-xs font-medium rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors disabled:opacity-50"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      onClick={() => publishCourseMutation.mutate(course.id)}
                      disabled={publishCourseMutation.isLoading}
                      className="flex-1 min-w-[70px] px-3 py-2 text-xs font-medium rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                    >
                      Publish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    disabled={deleteCourseMutation.isLoading}
                    className="flex-1 min-w-[70px] px-3 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No courses found' : 'No courses yet'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first course to get started'}
          </p>
          <Link
            to="/admin/courses/create"
            className="inline-flex px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Create Course
          </Link>
        </div>
      )}
    </div>
  )
}

export default CourseManagement
