import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiClock, FiAward, FiCheckCircle,
  FiX, FiDownload, FiInfo, FiArrowRight,
  FiUsers, FiStar, FiCheck
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import internshipService from '../../services/internshipService'


const InternshipDetailsModal = ({ internship, registration, onClose, onRegistered }) => {
  const { user } = useAuth()
  const [registering, setRegistering] = useState(false)
  const [localRegistered, setLocalRegistered] = useState(false)

  const [error, setError] = useState('')

  const isAlreadyRegistered = !!registration || localRegistered
  const regStatus = registration?.status || (localRegistered ? 'registered' : null)

  if (!internship) return null

  const domainsOffered = Array.isArray(internship.domains_offered) ? internship.domains_offered : []
  const keyFeatures    = Array.isArray(internship.key_features)    ? internship.key_features    : []
  const outcomes       = Array.isArray(internship.outcomes)        ? internship.outcomes        : []
  const highlights     = Array.isArray(internship.highlights)      ? internship.highlights      : []

  const handleRegister = async () => {
    if (!user) { window.location.href = '/login'; return }
    setRegistering(true)
    setError('')
    try {
      await internshipService.register(internship.id)
      setLocalRegistered(true)
      onRegistered && onRegistered()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  // Determine which action button to show at the bottom
  const renderActionButton = () => {
    if (regStatus === 'completed') {
      return (
        <>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            🏆 Program Completed — Well Done!
          </div>
          {registration?.certificate_url && (
            <a
              href={registration.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              <FiDownload /> Download Certificate
            </a>
          )}
        </>
      )
    }

    if (isAlreadyRegistered) {
      return (
        <>
          <div className="bg-green-50 border border-green-200 text-green-800 font-semibold text-center py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
            <FiCheck className="w-4 h-4" /> You have applied for this internship
          </div>

        </>
      )
    }

    return (
      <button
        onClick={handleRegister}
        disabled={registering}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg text-sm uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {registering ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Applying...
          </>
        ) : (
          <>Apply for Internship <FiArrowRight /></>
        )}
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-md border border-white/20">
                {internship.logo || '💼'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{internship.title}</h2>
                <p className="text-indigo-100 text-sm mt-0.5">Professional Virtual Internship</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
                {internship.status === 'active' ? '● Active' : '○ Upcoming'}
              </span>
              {internship.certificate_type && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30">
                  🎓 {internship.certificate_type} Certificate
                </span>
              )}
              {internship.current_registrations != null && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 border border-white/30 flex items-center gap-1">
                  <FiUsers className="w-3 h-3" /> {internship.current_registrations} enrolled
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-7">

            {/* Stats Row */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-5 border border-indigo-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <FiClock className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{internship.duration || '4-12 Weeks'}</p>
                </div>
                <div className="text-center border-l border-indigo-100">
                  <FiAward className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credential</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">{internship.certificate_type || 'Verified'}</p>
                </div>
              </div>
            </div>

            {/* Description / Overview */}
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
                <FiInfo className="w-4 h-4 text-indigo-600" /> Overview
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {internship.description || 'No description available.'}
              </p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Domains Offered */}
            {domainsOffered.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Domains Offered
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {domainsOffered.map((domain, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5 flex-shrink-0" />
                      {domain}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Features */}
            {keyFeatures.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Key Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {keyFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <FiStar className="text-amber-400 w-3.5 h-3.5 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outcomes */}
            {outcomes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> What You'll Achieve
                </h3>
                <div className="space-y-2">
                  {outcomes.map((outcome, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                      <FiCheck className="text-emerald-500 w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility note */}
            {internship.max_registrations && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 font-medium">
                ⚡ Limited to {internship.max_registrations} seats —{' '}
                {internship.current_registrations || 0} enrolled so far
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex flex-col gap-3">
            {renderActionButton()}
            <button
              onClick={onClose}
              className="w-full py-2.5 text-slate-400 font-semibold hover:text-slate-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>


    </>
  )
}

export default InternshipDetailsModal
