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
  FiSearch, FiX, FiArrowRight, FiSliders,
  FiBookOpen, FiAward, FiZap, FiUsers
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
      <div className="min-h-screen" style={{ background: '#0F172A' }}>
        <Header />

        {/* ══════════════════════════════════════════════════════════════════
            HERO — dark slate with amber radial glow spotlight
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: '#0F172A' }}>

          {/* Amber spotlight glow — the hero's unique signature */}
          <div className="absolute inset-0 pointer-events-none">
            <div style={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: '70%',
              height: '120%',
              background: 'radial-gradient(ellipse at 30% 50%, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 40%, transparent 70%)',
            }} />
          </div>

          {/* Subtle dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />

          {/* Faint horizontal rule lines — editorial feel */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(transparent calc(100% - 1px), rgba(255,255,255,0.03) 100%)',
            backgroundSize: '100% 80px'
          }} />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-14">

            {/* Overline */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="h-px w-12 bg-amber-400" />
              <span className="font-mono text-amber-400 text-xs tracking-[0.28em] uppercase">
                GNANAM AI · Course Catalog
              </span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">

              {/* ── Left: editorial headline ─────────────────────────────── */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="font-black leading-[1.15] tracking-tight mb-8"
                  style={{ fontSize: 'clamp(2.7rem, 5.5vw, 6.2rem)' }}
                >
                  <span className="text-white block">MASTER</span>
                  <span className="text-amber-400 block">ANY SKILL.</span>
                  <span className="block" style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(255,255,255,0.15)'
                  }}>LAND ANY JOB.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10 font-light"
                >
                  AI-powered learning that adapts to <em className="text-white not-italic font-semibold">you</em> — every course, every project, every certificate is built for real-world impact.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-8 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 text-sm shadow-lg shadow-amber-400/25"
                  >
                    Browse Courses
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  {!user && (
                    <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center gap-3 border border-slate-700 text-slate-300 font-bold px-8 py-4 rounded-xl hover:border-amber-400/50 hover:text-white transition-all duration-300 text-sm"
                    >
                      Sign In
                    </button>
                  )}
                </motion.div>

              </div>

              {/* ── Right: stacked feature cards ─────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-3 pt-4"
              >
                {[
                  {
                    icon: <FiZap className="w-5 h-5" />,
                    title: 'AI-Adaptive Curriculum',
                    body: 'Lessons that adjust to your pace and learning style in real time.',
                    accent: 'border-l-amber-400'
                  },
                  {
                    icon: <FiBookOpen className="w-5 h-5" />,
                    title: 'Live Project Integration',
                    body: 'Every course links to a deployable, portfolio-ready real project.',
                    accent: 'border-l-blue-400'
                  },
                  {
                    icon: <FiAward className="w-5 h-5" />,
                    title: 'Industry Certificates',
                    body: 'Verifiable certificates built around skills companies hire for.',
                    accent: 'border-l-emerald-400'
                  },
                  {
                    icon: <FiUsers className="w-5 h-5" />,
                    title: 'Community & Mentorship',
                    body: 'Learn alongside peers and get guidance from industry mentors.',
                    accent: 'border-l-violet-400'
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`bg-white/[0.04] border border-white/[0.07] border-l-2 ${card.accent} rounded-xl p-4 hover:bg-white/[0.07] transition-colors duration-200`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-amber-400/70 mt-0.5 flex-shrink-0">{card.icon}</div>
                      <div>
                        <div className="text-white font-bold text-sm mb-0.5">{card.title}</div>
                        <div className="text-slate-400 text-xs leading-relaxed">{card.body}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CATALOG SECTION — warm light background (catalog feel)
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{ background: '#F5F4F0' }}>

          {/* ── STICKY FILTER BAR ────────────────────────────────────────── */}
          <div
            className="sticky top-0 z-30 border-b border-gray-200 shadow-sm"
            style={{ background: '#F5F4F0' }}
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

        {/* ══════════════════════════════════════════════════════════════════
            BOTTOM CTA — back to dark for bookend symmetry
        ══════════════════════════════════════════════════════════════════ */}
        <section className="py-20" style={{ background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-amber-400" />
                  <span className="font-mono text-amber-400 text-xs tracking-widest uppercase">Ready to grow?</span>
                </div>
                <h2 className="text-4xl font-black text-white">
                  Your next skill is<br />
                  <span className="text-amber-400">one course away.</span>
                </h2>
                <p className="text-slate-500 mt-3 text-sm">
                  Start learning · Industry certificates · Hands-on chapters
                </p>
              </div>
              <button
                onClick={() => navigate(user ? '/student' : '/login')}
                className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-8 py-5 rounded-2xl hover:bg-amber-300 transition-all duration-300 text-base flex-shrink-0 shadow-xl shadow-amber-400/20"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default CourseListPage
