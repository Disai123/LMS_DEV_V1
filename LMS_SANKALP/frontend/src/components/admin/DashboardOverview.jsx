import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const DashboardOverview = ({ courses, stats }) => {
  const recentCourses = courses?.slice(0, 5) || []

  const quickLinks = [
    {
      to: '/admin/courses/create',
      title: 'Create Course',
      description: 'Add chapters, tests, and publish content',
      color: 'from-emerald-500 to-teal-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      ),
    },
    {
      to: '/admin/courses',
      title: 'Manage Courses',
      description: 'Edit courses, chapters, and tests',
      color: 'from-indigo-500 to-violet-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
    },
    {
      to: '/admin/students',
      title: 'Students',
      description: 'View progress and certificates per student',
      color: 'from-blue-500 to-cyan-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      ),
    },
    {
      to: '/admin/analytics',
      title: 'Analytics',
      description: 'Enrollment and completion insights',
      color: 'from-amber-500 to-orange-500',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={link.to}
              className="block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 mb-3 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center text-white`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {link.icon}
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{link.title}</h3>
              <p className="text-sm text-slate-500">{link.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-900">Recent Courses</h3>
            <Link to="/admin/courses" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                    {course.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{course.title}</p>
                    <p className="text-xs text-slate-500">
                      {course.is_published ? 'Published' : 'Draft'} · {course.enrollment_count || 0} enrolled
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={`/admin/courses/${course.id}/edit#tests`}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      Tests
                    </Link>
                    <Link
                      to={`/admin/courses/${course.id}/edit`}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-500 text-sm mb-3">No courses yet.</p>
                <Link to="/admin/courses/create" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Create your first course
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-5">Platform Overview</h3>
          <div className="space-y-4">
            {[
              { label: 'Completion Rate', value: `${Math.round(stats?.completionRate || 0)}%`, color: 'text-emerald-600' },
              { label: 'Enrollments', value: stats?.totalEnrolled || 0, color: 'text-blue-600' },
              { label: 'Avg Progress', value: `${Math.round(stats?.averageProgress || 0)}%`, color: 'text-violet-600' },
              { label: 'Certificates', value: stats?.totalCertificates || 0, color: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardOverview
