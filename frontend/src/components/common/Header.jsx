import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleProtectedClick = (path) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
      // Store redirect path for after login
      localStorage.setItem('redirectAfterLogin', path)
      navigate('/login')
    }
  }

  const handleNavClick = (e, path, requiresAuth = false) => {
    if (!isAuthenticated && requiresAuth) {
      e.preventDefault()
      localStorage.setItem('redirectAfterLogin', path)
      navigate('/login')
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-gray-100/90 backdrop-blur-xl border-b border-gray-300/60 overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 overflow-visible">
            <img
              src="/lms_logo.svg"
              alt="GNANAM AI"
              className="h-10 sm:h-14 w-auto object-contain"
              style={{ maxHeight: '100%' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Courses
            </Link>
            <Link
              to={isAuthenticated ? '/student/realtime-projects' : '/realtime-projects'}
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Realtime Projects
            </Link>
            {/* HIDDEN: Hackathons & Internships nav links temporarily hidden */}
            {/* <Link
              to={isAuthenticated ? '/student/hackathons' : '/hackathons'}
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Hackathons
            </Link>
            <Link
              to={isAuthenticated ? '/student/internships' : '/internships'}
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Internships
            </Link> */}
            <Link
              to="/pricing"
              className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              Pricing
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0d9488&color=fff`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700 font-medium">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 card p-2"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Profile
                        </Link>
                        {user?.role === 'student' && (
                          <Link
                            to="/certificates"
                            className="block px-4 py-2 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            My Certificates
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-3 rounded-lg hover:bg-white/20 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/20"
            >
              <div className="py-4 space-y-2 px-4">
                <Link
                  to="/"
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to={isAuthenticated ? '/student/realtime-projects' : '/realtime-projects'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  Realtime Projects
                </Link>
                {/* HIDDEN: Hackathons & Internships mobile nav links temporarily hidden */}
                {/* <Link
                  to={isAuthenticated ? '/student/hackathons' : '/hackathons'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  Hackathons
                </Link>
                <Link
                  to={isAuthenticated ? '/student/internships' : '/internships'}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  Internships
                </Link> */}
                <Link
                  to="/pricing"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                >
                  Pricing
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/student"
                      className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/notifications"
                      className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Notifications
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-4 text-gray-700 hover:bg-white/20 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

export default Header
