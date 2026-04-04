import { motion } from 'framer-motion'
import { FiClock, FiGlobe, FiChevronRight, FiCheckCircle, FiEye, FiEdit3, FiAward } from 'react-icons/fi'

const InternshipCard = ({ internship, index, onClick }) => {
  const highlights = internship.highlights?.length
    ? internship.highlights.slice(0, 3)
    : ['Project Based', 'Mentorship', 'Industry Exposure']

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusText = internship.status === 'active' ? 'Active' : 'Upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 flex flex-col h-full"
    >
      {/* Subtle Gradient Overlay on Hover like Hackathons */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative p-6 flex flex-col h-full">
        {/* Header: Title and Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
              {internship.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {internship.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(internship.status)} ml-3`}>
            {statusText}
          </span>
        </div>

        {/* Info Rows (Hackathon Style) */}
        <div className="space-y-3 mb-6">
          {/* Technology/Domain */}
          <div className="flex items-center space-x-2">
            <FiAward className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-600">
              {internship.domains_offered?.[0] || 'Software Engineering'}
            </span>
          </div>

          {/* Mode */}
          <div className="flex items-center space-x-2">
            <FiGlobe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{internship.mode || 'Online'}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-2">
            <FiClock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{internship.duration || '4-12 Weeks'}</span>
          </div>
        </div>

        {/* Action Buttons (Stacked like preferred Hackathon style) */}
        <div className="mt-auto space-y-2">
          <button
            onClick={() => onClick(internship)}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
          >
            <FiEye className="w-4 h-4 mr-2" />
            View Details
          </button>
          
          <button
            onClick={() => onClick(internship)}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm"
          >
            <FiEdit3 className="w-4 h-4 mr-2" />
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default InternshipCard
