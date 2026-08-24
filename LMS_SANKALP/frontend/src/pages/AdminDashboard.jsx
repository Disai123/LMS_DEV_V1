import { useState } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { useAuth } from '../context/AuthContext'
import { courseService } from '../services/courseService'
import { enrollmentService } from '../services/enrollmentService'
import Header from '../components/common/Header'
import LoadingSpinner from '../components/common/LoadingSpinner'

import AdminSidebar from '../components/admin/AdminSidebar'
import DashboardOverview from '../components/admin/DashboardOverview'
import CourseManagement from '../components/admin/CourseManagement'
import CreateCourse from '../components/admin/CreateCourse'
import EditCourse from '../components/admin/EditCourse'
import UserAnalytics from '../components/admin/UserAnalytics'
import StudentListPage from './StudentListPage'
import AdminStudentProfilePage from './AdminStudentProfilePage'

const PAGE_TITLES = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of courses, students, and certificates' },
  '/admin/courses': { title: 'Courses', subtitle: 'Manage courses, chapters, and tests' },
  '/admin/courses/create': { title: 'Create Course', subtitle: 'Add a new course to the catalog' },
  '/admin/students': { title: 'Students', subtitle: 'Track student progress and certificates' },
  '/admin/analytics': { title: 'Analytics', subtitle: 'Enrollment and completion insights' },
}

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pathname = location.pathname.replace(/\/$/, '') || '/admin'
  const isDashboardHome = pathname === '/admin'
  const isEditCourse = /\/admin\/courses\/\d+\/edit/.test(pathname)
  const isStudentProfile = /\/admin\/students\/\d+/.test(pathname)

  const pageMeta = isEditCourse
    ? { title: 'Edit Course', subtitle: 'Update course details, chapters, and tests' }
    : isStudentProfile
      ? { title: 'Student Profile', subtitle: 'Progress, assessments, and certificates' }
      : PAGE_TITLES[pathname] || { title: 'Admin', subtitle: 'SANKALP LMS administration' }

  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    'admin-courses',
    () => courseService.getCourses({ limit: 100 }),
    { enabled: isAuthenticated && user?.role === 'admin', refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 }
  )

  const { data: statsData, isLoading: statsLoading } = useQuery(
    'admin-stats',
    () => enrollmentService.getAdminStats(),
    { enabled: isAuthenticated && user?.role === 'admin', refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 }
  )

  const isLoading = coursesLoading || statsLoading
  const adminStats = statsData?.data?.stats || {}

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard', current: isDashboardHome },
    { name: 'Courses', href: '/admin/courses', icon: 'courses', current: pathname === '/admin/courses' || isEditCourse },
    { name: 'Create Course', href: '/admin/courses/create', icon: 'add', current: pathname === '/admin/courses/create' },
    { name: 'Students', href: '/admin/students', icon: 'users', current: pathname.startsWith('/admin/students') },
    { name: 'Analytics', href: '/admin/analytics', icon: 'analytics', current: pathname === '/admin/analytics' },
  ]

  const stats = [
    { name: 'Courses', value: coursesData?.data?.courses?.length || adminStats.totalCourses || 0, color: 'from-indigo-500 to-violet-600' },
    { name: 'Students', value: adminStats.totalStudents || 0, color: 'from-blue-500 to-cyan-600' },
    { name: 'Enrollments', value: adminStats.totalEnrolled || 0, color: 'from-emerald-500 to-teal-600' },
    { name: 'Certificates', value: adminStats.totalCertificates || 0, color: 'from-amber-500 to-orange-500' },
  ]

  if (isLoading && isDashboardHome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="flex">
        <AdminSidebar
          navigation={navigation}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 min-w-0 w-full lg:pl-64">
          <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1600px]">
            {/* Page header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 lg:mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {isDashboardHome ? `Welcome, ${user?.name?.split(' ')[0] || 'Admin'}` : pageMeta.title}
                  </h1>
                  <p className="text-slate-600 mt-1">{pageMeta.subtitle}</p>
                </div>
                {pathname === '/admin/courses' && (
                  <Link
                    to="/admin/courses/create"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    + Create Course
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Dashboard stats */}
            {isDashboardHome && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.name}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            <Routes>
              <Route path="/" element={<DashboardOverview courses={coursesData?.data?.courses || []} stats={adminStats} />} />
              <Route path="/courses" element={<CourseManagement courses={coursesData?.data?.courses || []} />} />
              <Route path="/courses/create" element={<CreateCourse />} />
              <Route path="/courses/:id/edit" element={<EditCourse />} />
              <Route path="/students" element={<StudentListPage embedded />} />
              <Route path="/students/:id" element={<AdminStudentProfilePage embedded />} />
              <Route path="/analytics" element={<UserAnalytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
