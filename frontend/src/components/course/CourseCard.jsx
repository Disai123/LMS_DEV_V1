import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import useCourseLogo from '../../hooks/useCourseLogo'
import { FiStar, FiUsers, FiClock, FiArrowRight, FiLock } from 'react-icons/fi'
import { PRICING_HIDDEN } from '../../config/features'

const difficultyConfig = {
  beginner: { label: 'Beginner', class: 'bg-green-500/15 text-green-400 border-green-500/20' },
  intermediate: { label: 'Intermediate', class: 'bg-amber-400/15 text-amber-400 border-amber-400/20' },
  advanced: { label: 'Advanced', class: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

// Subtle tinted left-border accent per card index cycle — injected by CourseList
const ACCENT_BORDERS = [
  'border-l-blue-500',
  'border-l-amber-400',
  'border-l-emerald-500',
  'border-l-violet-500',
  'border-l-rose-500',
  'border-l-cyan-500',
]

const CourseCard = ({ course, index = 0, showInstructor = true, showRating = true, isLocked = false }) => {
  const navigate = useNavigate()
  const { logoUrl } = useCourseLogo(course.id, !!course.logo)
  const effectiveLocked = PRICING_HIDDEN ? false : isLocked

  const difficulty = difficultyConfig[course.difficulty] || difficultyConfig['beginner']
  const thumbnail = (course.logo && logoUrl) ? logoUrl : course.thumbnail || null
  const accent = ACCENT_BORDERS[index % ACCENT_BORDERS.length]

  const numericRating = (() => {
    const r = course.average_rating
    return r && typeof r === 'number' && !isNaN(r) ? r : 0
  })()

  const handleClick = (e) => {
    if (effectiveLocked) {
      e.preventDefault()
      navigate('/pricing')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className={`bg-slate-900 border border-l-4 ${accent} rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col w-full ${
        effectiveLocked
          ? 'border-slate-700 opacity-75 cursor-pointer'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-black/30'
      }`}
    >
      <Link to={effectiveLocked ? '/pricing' : `/courses/${course.id}`} onClick={handleClick} className="flex flex-col flex-1">

        {/* Thumbnail */}
        <div className="relative overflow-hidden h-44">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          ) : (
            /* Premium dark fallback with amber dot-grid & glow */
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden" style={{ background: '#0A0F1E' }}>
              <div className="absolute inset-0 opacity-[0.07]" style={{
                backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)',
                backgroundSize: '22px 22px'
              }} />
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at 50% 70%, rgba(251,191,36,0.14) 0%, transparent 65%)'
              }} />
              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}
                >
                  <span className="text-3xl font-black text-amber-400">{course.title?.charAt(0)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

          {/* Lock overlay — shown when course is plan-gated */}
          {effectiveLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{ background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(3px)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }}
              >
                <FiLock className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">
                {course.required_plan} plan
              </span>
            </div>
          )}

          {/* Difficulty badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border backdrop-blur-sm ${difficulty.class}`}>
              {difficulty.label}
            </span>
          </div>

          {/* Free/Premium badge */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`px-2 py-1 text-[10px] font-bold rounded-lg border backdrop-blur-sm ${course.is_free
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : 'bg-violet-500/20 text-violet-400 border-violet-500/30'
              }`}>
              {course.is_free ? 'Free' : 'Premium'}
            </motion.span>

            {/* Live/Draft badge (only for admins or when needed) */}
            <span className={`px-2 py-1 text-[10px] font-bold rounded-lg backdrop-blur-sm ${course.is_published
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}>
              {course.is_published ? '● Live' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-1">

          {/* Category + student count */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/15 px-2.5 py-1 rounded-full tracking-wide">
              {course.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <FiUsers className="w-3 h-3" />
              {course.enrollment_count || 0}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-black text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors duration-200 leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          {showInstructor && course.instructor && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-800">
              <img
                src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${course.instructor.name}&background=0f172a&color=fbbf24&bold=true`}
                alt={course.instructor.name}
                className="w-6 h-6 rounded-full object-cover border border-slate-700"
              />
              <span className="text-xs text-slate-400 font-medium">{course.instructor.name}</span>
            </div>
          )}

          {/* Footer: Rating + Duration + Arrow */}
          <div className="flex items-center justify-between mt-auto gap-2">
            {showRating && (
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(numericRating) ? 'text-amber-400' : 'text-slate-700'}`}
                    style={{ fill: i < Math.floor(numericRating) ? 'currentColor' : 'none' }}
                  />
                ))}
                <span className="text-xs text-white font-bold ml-1">{numericRating.toFixed(1)}</span>
                <span className="text-xs text-slate-600 ml-0.5">({course.total_ratings || 0})</span>
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              {course.estimated_duration && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FiClock className="w-3 h-3" />
                  {course.estimated_duration}h
                </span>
              )}
              <div className="w-7 h-7 bg-amber-400/10 border border-amber-400/15 rounded-lg flex items-center justify-center group-hover:bg-amber-400 group-hover:border-amber-400 transition-all duration-300">
                <FiArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-900 transition-colors" />
              </div>
            </div>
          </div>
        </div>

      </Link>
    </motion.div>
  )
}

export default CourseCard
