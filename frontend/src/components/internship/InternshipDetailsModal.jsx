import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiClock, FiGlobe, FiAward, FiCheckCircle, 
  FiX, FiDownload, FiInfo, FiTrendingUp, FiCheck, FiArrowRight
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import internshipService from '../../services/internshipService'
import InternshipSubmissionModal from './InternshipSubmissionModal'

const InternshipDetailsModal = ({ internship, registration, onClose, onRegistered }) => {
  const { user } = useAuth()
  const [registering, setRegistering] = useState(false)
  const [localRegistered, setLocalRegistered] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [error, setError] = useState('')

  const isAlreadyRegistered = !!registration || localRegistered
  const regStatus = registration?.status || (localRegistered ? 'registered' : null)

  if (!internship) return null

  const domainsOffered = internship.domains_offered || []
  const keyFeatures = internship.key_features || []
  const outcomes = internship.outcomes || []

  const handleRegister = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setRegistering(true)
    setError('')
    try {
      await internshipService.register(internship.id)
      setLocalRegistered(true)
      onRegistered && onRegistered()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Header (Hackathon Style) */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <FiX className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-md">
              {internship.logo || '💼'}
            </div>
            <div>
               <h2 className="text-2xl font-bold">{internship.title}</h2>
               <p className="text-indigo-100 text-sm">Professional Virtual Internship</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white`}>
              {internship.status === 'active' ? 'Active' : 'Upcoming'}
            </span>
            <div className="flex items-center space-x-2 text-sm">
              <FiAward className="w-4 h-4" />
              <span>{internship.domains_offered?.[0] || 'Software Engineering'}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Schedule/Stats Box (Hackathon Style) */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center group">
                <FiClock className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</h4>
                <p className="text-sm font-bold text-slate-900 mt-1">{internship.duration || '4-12 Weeks'}</p>
              </div>
              <div className="text-center group border-x border-indigo-100">
                <FiGlobe className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mode</h4>
                <p className="text-sm font-bold text-slate-900 mt-1">{internship.mode || 'Online'}</p>
              </div>
              <div className="text-center group">
                <FiAward className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credential</h4>
                <p className="text-sm font-bold text-slate-900 mt-1">Verified</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FiInfo className="w-5 h-5 mr-2 text-indigo-600" />
              Overview
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {internship.description}
            </p>
          </div>

          {/* Domains & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {domainsOffered.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                   Domains
                </h3>
                <div className="space-y-2">
                  {domainsOffered.map((domain, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
                      {domain}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {keyFeatures.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                   Key Features
                </h3>
                <div className="space-y-2">
                  {keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <FiCheckCircle className="text-indigo-400 w-3.5 h-3.5" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-8 border-t border-gray-100 flex flex-col gap-3">
          {regStatus === 'completed' ? (
            <>
               <div className="bg-emerald-100 text-emerald-800 font-bold text-center py-3 rounded-lg text-sm uppercase tracking-wider">
                🏆 Program Completed
              </div>
              {registration?.certificate_url && (
                <a
                  href={registration.certificate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  <FiDownload /> Download Certificate
                </a>
              )}
            </>
          ) : isAlreadyRegistered ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors text-sm uppercase tracking-wider shadow-md"
            >
              📝 Submit Final Work
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {registering ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Apply for Internship <FiArrowRight /></>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 text-slate-500 font-semibold hover:text-slate-900 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </motion.div>

      {/* Submission Modal */}
      <InternshipSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        internship={internship}
        onSuccess={() => {
          setShowSubmitModal(false);
          onRegistered && onRegistered();
        }}
      />
    </div>
  )
}

export default InternshipDetailsModal
