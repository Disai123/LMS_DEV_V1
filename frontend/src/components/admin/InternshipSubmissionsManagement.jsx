import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiUser
} from 'react-icons/fi';
import internshipService from '../../services/internshipService';

const InternshipSubmissionsManagement = ({ internshipId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Review Details Modal
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false);
  
  // State for Action Modal
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [reviewData, setReviewData] = useState({
    action: 'approve', // 'approve' or 'reject'
    feedback: '',
    points: 100
  });

  useEffect(() => {
    fetchSubmissions();
  }, [internshipId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await internshipService.getAllSubmissions({ internship_id: internshipId, limit: 100 });
      setSubmissions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionDetails(true);
  };

  const handleReviewSubmission = (submission) => {
    setReviewingSubmission(submission);
    setReviewData({
      action: 'approve',
      feedback: submission.admin_feedback || '',
      points: 100
    });
  };

  const handleReviewSubmit = async () => {
    try {
      if (reviewData.action === 'approve') {
        await internshipService.approveSubmission(reviewingSubmission.id, {
          feedback: reviewData.feedback,
          points: parseInt(reviewData.points)
        });
      } else {
        await internshipService.rejectSubmission(reviewingSubmission.id, {
          feedback: reviewData.feedback
        });
      }
      setReviewingSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Error reviewing submission:', error);
      alert(error.response?.data?.message || 'Failed to review submission');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'revision_requested':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Submissions</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchSubmissions}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
          <p className="text-gray-600">
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} received
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
          <p className="text-gray-600">Submissions will appear here once students submit their tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {submission.internship_title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${getStatusColor(submission.status)}`}>
                    {submission.status.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {submission.description || 'No description provided.'}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FiUser className="w-4 h-4" />
                    <span>{submission.student?.name || 'Unknown Student'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>Submitted: {formatDate(submission.submitted_at)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 md:ml-4">
                <button
                  onClick={() => handleViewSubmission(submission)}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  title="View Details"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                
                {submission.status === 'pending' && (
                  <button
                    onClick={() => handleReviewSubmission(submission)}
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    title="Review Submission"
                  >
                    <FiCheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Action Modal */}
      {reviewingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Submission
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={reviewData.action}
                  onChange={(e) => setReviewData({ ...reviewData, action: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="approve">Approve & Award Points</option>
                  <option value="reject">Reject / Request Revision</option>
                </select>
              </div>

              {reviewData.action === 'approve' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points to Award
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reviewData.points}
                    onChange={(e) => setReviewData({ ...reviewData, points: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter points"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback {reviewData.action === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter feedback for the student..."
                  required={reviewData.action === 'reject'}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setReviewingSubmission(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={reviewData.action === 'reject' && !reviewData.feedback}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Details Modal */}
      {showSubmissionDetails && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Submission Details</h3>
                <p className="text-sm text-gray-500 mt-1">Submitted by {selectedSubmission.student?.name}</p>
              </div>
              <button
                onClick={() => setShowSubmissionDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Status</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                  {selectedSubmission.description || 'No description provided.'}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Links & Resources</h4>
                <div className="space-y-3">
                  {selectedSubmission.github_url ? (
                    <a href={selectedSubmission.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-indigo-600">
                      GitHub Repository
                    </a>
                  ) : (
                    <div className="p-3 border border-gray-200 rounded-lg text-gray-500 bg-gray-50">No GitHub link</div>
                  )}
                  {selectedSubmission.drive_url ? (
                    <a href={selectedSubmission.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-blue-600">
                      Google Drive Link (Demo/Video)
                    </a>
                  ) : (
                    <div className="p-3 border border-gray-200 rounded-lg text-gray-500 bg-gray-50">No Drive link</div>
                  )}
                  {selectedSubmission.documentation_url ? (
                    <a href={selectedSubmission.documentation_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-green-600">
                      Documentation Link
                    </a>
                  ) : (
                    <div className="p-3 border border-gray-200 rounded-lg text-gray-500 bg-gray-50">No Documentation link</div>
                  )}
                </div>
              </div>

              {selectedSubmission.admin_feedback && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Admin Feedback</h4>
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-yellow-800 whitespace-pre-wrap">
                    {selectedSubmission.admin_feedback}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowSubmissionDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipSubmissionsManagement;
