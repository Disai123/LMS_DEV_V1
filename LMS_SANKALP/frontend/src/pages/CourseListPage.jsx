import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { courseService } from '../services/courseService'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import CourseList from '../components/course/CourseList'
import Pagination from '../components/common/Pagination'
import ErrorBoundary from '../components/common/ErrorBoundary'
import { useAuth } from '../context/AuthContext'
import {
  FiSearch, FiX, FiArrowRight, FiSliders
} from 'react-icons/fi'

const DIFFICULTIES = [
  { key: '', label: 'All Levels' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
]

import { getCourseMetadata } from '../utils/courseManifest'

const CourseListPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeDifficulty, setActiveDifficulty] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const COURSES_PER_PAGE = 12

  const { data: coursesData, isLoading, error } = useQuery(
    ['courses', search, activeCategory, activeDifficulty, currentPage],
    () => {
      const params = { page: currentPage, limit: COURSES_PER_PAGE }
      if (search.trim()) params.q = search
      if (activeCategory) params.category = activeCategory
      if (activeDifficulty) params.difficulty = activeDifficulty
      return courseService.getCourses(params)
    },
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 }
  )

  const { data: categoriesData } = useQuery(
    'categories',
    () => courseService.getCategories(),
    { refetchOnWindowFocus: false, staleTime: 10 * 60 * 1000 }
  )

  const courses = coursesData?.data?.courses || []
  
  // Apply Manual Ordering and Plan Overrides
  const processedCourses = courses.map(course => {
    const meta = getCourseMetadata(course.title);
    if (meta) {
      return {
        ...course,
        sequence: meta.sequence
      };
    }
    return { ...course, sequence: 999 };
  });

  const sortedCourses = [...processedCourses].sort((a, b) => a.sequence - b.sequence);
  const categories = categoriesData?.data?.categories || []
  const pagination = coursesData?.data?.pagination || {}
  const totalItems = pagination.totalItems ?? courses.length

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setCategory = useCallback((cat) => {
    setActiveCategory(c => c === cat ? '' : cat)
    setCurrentPage(1)
  }, [])

  const setDiffLevel = useCallback((d) => {
    setActiveDifficulty(d)
    setCurrentPage(1)
  }, [])

  const clearAll = () => {
    setSearch('')
    setActiveCategory('')
    setActiveDifficulty('')
    setCurrentPage(1)
  }

  const hasFilters = search || activeCategory || activeDifficulty

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

        {/* Hero — light theme matching home page */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-amber-50/80" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-amber-300/15 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md mb-5">
                SANKALP LMS · Courses
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
                Explore our{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                  course catalog
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                Browse courses, enroll, complete chapters and assessments, and earn your certificate.
              </p>
              <button
                onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-300/30"
              >
                View All Courses
                <FiArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <div className="bg-white border-t border-indigo-100/50">

          {/* ── STICKY FILTER BAR ────────────────────────────────────────── */}
          <div
            className="sticky top-0 z-30 border-b border-gray-200 shadow-sm bg-white"
            id="courses-section"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Row 1: search + filter + count */}
              <div className="flex items-center gap-3 py-3 border-b border-gray-200/60">
                <div className="relative flex-1 max-w-sm">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                    placeholder="Search courses, topics, instructors..."
                    className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-sm"
                  />
                  {search && (
                    <button onClick={() => { setSearch(''); setCurrentPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(f => !f)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${showFilters || activeDifficulty
                    ? 'bg-slate-900 text-amber-400 border-slate-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <FiSliders className="w-3.5 h-3.5" />
                  Filters
                  {activeDifficulty && (
                    <span className="text-[10px] font-black text-amber-400">
                      · {activeDifficulty}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {hasFilters && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={clearAll}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                    >
                      <FiX className="w-3.5 h-3.5" /> Clear all
                    </motion.button>
                  )}
                </AnimatePresence>

                <div className="ml-auto font-mono text-xs text-gray-400">
                  {isLoading ? '—' : `${totalItems} courses`}
                </div>
              </div>

              {/* Row 2: Category tabs */}
              <div className="flex items-center gap-1 py-2.5 overflow-x-auto">
                <button
                  onClick={() => setCategory('')}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${!activeCategory
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                    }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${activeCategory === cat
                      ? 'bg-amber-400 text-slate-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Expandable difficulty row */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col py-4 border-t border-gray-100 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest w-16">Level:</span>
                        <div className="flex flex-wrap gap-2">
                          {DIFFICULTIES.map(d => (
                            <button
                              key={d.key}
                              onClick={() => setDiffLevel(d.key)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeDifficulty === d.key
                                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── COURSE GRID ───────────────────────────────────────────────── */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Active filter chips */}
            <AnimatePresence>
              {hasFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2 mb-6"
                >
                  {activeCategory && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-amber-400 text-slate-900 rounded-full">
                      {activeCategory}
                      <button onClick={() => setCategory(activeCategory)}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                  {activeDifficulty && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-slate-900 text-white rounded-full">
                      {activeDifficulty}
                      <button onClick={() => setDiffLevel('')}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                  {search && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white text-gray-700 rounded-full border border-gray-200">
                      &ldquo;{search}&rdquo;
                      <button onClick={() => { setSearch(''); setCurrentPage(1) }}><FiX className="w-3 h-3" /></button>
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <CourseList
              courses={sortedCourses}
              isLoading={isLoading}
              error={error}
              showInstructor={true}
              showRating={true}
              variant="light"
            />

            {!isLoading && !error && courses.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage || currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={handlePageChange}
                totalItems={pagination.totalItems || 0}
                itemsPerPage={pagination.itemsPerPage || COURSES_PER_PAGE}
                className="mt-10"
              />
            )}
          </main>
        </div>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default CourseListPage
