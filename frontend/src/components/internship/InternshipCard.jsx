import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiEye, FiAward, FiUsers, FiEdit2, FiCheckCircle, FiSend } from 'react-icons/fi'
import internshipService from '../../services/internshipService'
import InternshipSubmissionModal from './InternshipSubmissionModal'

const STATUS_BADGE = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Under Review' },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Approved ✓' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Revision Needed' },
  revision_requested: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Revision Requested' },
}

const InternshipCard = ({ internship, index, onClick, registration }) => {
  const [submission, setSubmission] = useState(null)
  const [loadingSub, setLoadingSub] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const getTimelineStatus = () => {
    if (!internship.start_date || !internship.end_date) return internship.status || 'active';

    const now = new Date();
    const start = new Date(internship.start_date);
    const end = new Date(internship.end_date);

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const currentStatus = getTimelineStatus();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ongoing';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  // Fetch this student's submission for this specific internship
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setLoadingSub(true)
    internshipService.getMySubmissionForInternship(internship.id)
      .then(res => setSubmission(res.data?.data || null))
      .catch(() => setSubmission(null))
      .finally(() => setLoadingSub(false))
  }, [internship.id])

  const subCfg = submission ? (STATUS_BADGE[submission.status] || STATUS_BADGE.pending) : null
  const domain = internship.domains_offered?.[0] || 'Software Engineering'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 flex flex-col h-full"
      >
        {/* Top accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="relative p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0 border border-indigo-100">
              {internship.logo || '💼'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
                {internship.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{internship.description}</p>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(currentStatus)}`}>
              {getStatusText(currentStatus)}
            </span>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiAward className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{domain}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>{internship.duration || '4-12 Weeks'}</span>
            </div>
            {internship.current_registrations != null && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiUsers className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{internship.current_registrations} enrolled</span>
              </div>
            )}
          </div>

          {/* Submission status badge (if submitted) */}
          {!loadingSub && submission && subCfg && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${subCfg.bg} mb-4`}>
              <FiCheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${subCfg.text}`} />
              <span className={`text-xs font-bold ${subCfg.text}`}>
                Submission: {subCfg.label}
              </span>
              {submission.points_awarded > 0 && (
                <span className="ml-auto text-xs font-black text-emerald-600">+{submission.points_awarded}pts</span>
              )}
            </div>
          )}

          {/* Highlights */}
          {internship.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {internship.highlights.slice(0, 3).map((h, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons — same pattern as hackathon card */}
          <div className="mt-auto space-y-2">
            {/* Always show View Details */}
            <button
              onClick={() => onClick(internship)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <FiEye className="w-4 h-4" />
              View Details
            </button>

            {/* Show submission controls if already submitted */}
            {!loadingSub && submission ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors text-xs"
                >
                  <FiEye className="w-3.5 h-3.5" /> View Submission
                </button>
                {submission.status !== 'approved' && (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-xs"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
              </div>
            ) : !loadingSub && registration ? (
              /* Registered but not submitted yet */
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                <FiSend className="w-4 h-4" /> Submit Project
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Submission modal — per-internship, outside the card */}
      {showSubmitModal && (
        <InternshipSubmissionModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          internship={internship}
          onSuccess={() => {
            setShowSubmitModal(false)
            // Re-fetch submission to update badge
            internshipService.getMySubmissionForInternship(internship.id)
              .then(res => setSubmission(res.data?.data || null))
              .catch(() => { })
          }}
        />
      )}
    </>
  )
}

export default InternshipCard
