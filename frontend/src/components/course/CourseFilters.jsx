import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'

const CourseFilters = ({ onFilterChange, filters = {}, categories = [] }) => {
  const [localFilters, setLocalFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  })

  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    setLocalFilters({
      category: filters.category || '',
      difficulty: filters.difficulty || '',
      search: filters.search || ''
    })
  }, [filters])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  const categoryOptions = ['All Categories', ...categories]
  const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)

    if (key === 'search') {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => {
        onFilterChange(newFilters)
      }, 300)
    } else {
      onFilterChange(newFilters)
    }
  }

  const clearFilters = () => {
    const clearedFilters = { category: '', difficulty: '', search: '' }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(v => v !== '')

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm"
    >
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 tracking-[0.1em] uppercase">
            Search Courses
          </label>
          <div className="relative">
            <input
              type="text"
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title, instructor, or keywords..."
              className="w-full px-4 py-3 pl-10 bg-stone-50 border border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 tracking-[0.1em] uppercase">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm appearance-none cursor-pointer"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 tracking-[0.1em] uppercase">
              Difficulty
            </label>
            <select
              value={localFilters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all text-sm appearance-none cursor-pointer"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty === 'All Levels' ? '' : difficulty.toLowerCase()}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-between pt-4 border-t border-gray-100"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Active filters:</span>
              {localFilters.category && (
                <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                  {localFilters.category}
                </span>
              )}
              {localFilters.difficulty && (
                <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  {localFilters.difficulty}
                </span>
              )}
              {localFilters.search && (
                <span className="px-2.5 py-1 text-xs font-bold bg-stone-100 text-stone-700 rounded-full border border-stone-200">
                  &ldquo;{localFilters.search}&rdquo;
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-slate-900 font-bold transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <FiX className="w-3.5 h-3.5" />
              Clear all
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default CourseFilters
