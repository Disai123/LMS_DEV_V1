import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard', current: location.pathname === '/admin' },
    { name: 'Courses', href: '/admin/courses', icon: 'courses', current: location.pathname.startsWith('/admin/courses') },
    { name: 'Create Course', href: '/admin/courses/create', icon: 'add', current: location.pathname === '/admin/courses/create' }
  ]

  const stats = [
    {
      name: 'Total Courses',
      value: coursesData?.data?.courses?.length || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Total Enrollments',
      value: statsData?.data?.stats?.totalEnrolled || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="flex">
        <AdminSidebar navigation={navigation} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 lg:ml-64">
          <main className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600 mt-2">Manage courses and publish learning content.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="stat-card"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                        <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Routes>
                <Route path="/" element={<DashboardOverview courses={coursesData?.data?.courses || []} stats={statsData?.data?.stats || {}} />} />
                <Route path="/courses" element={<CourseManagement courses={coursesData?.data?.courses || []} />} />
                <Route path="/courses/create" element={<CreateCourse />} />
                <Route path="/courses/:id/edit" element={<EditCourse />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
