import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiGithub, FiGlobe, FiVideo, FiEye, FiCheck, FiX, FiFilter, FiSearch, FiImage, FiFileText } from 'react-icons/fi';
import { api } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const AdminProjectSubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'internships'

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        fetchSubmissions();
        fetchStats();
    }, [statusFilter, currentPage, activeTab]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            const params = {
                page: currentPage,
                limit: 10
            };
            if (statusFilter !== 'all') params.status = statusFilter;
            
            const endpoint = activeTab === 'projects' 
                ? '/realtime-project-submissions/admin/all' 
                : '/internships/admin/submissions/all';

            console.log(`Fetching ${activeTab} submissions with params:`, params);
            const response = await api.get(endpoint, { params });
            console.log(`${activeTab} Submissions response:`, response.data);

            setSubmissions(response.data.data || []);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error(`Error fetching ${activeTab} submissions:`, err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to load submissions';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const endpoint = activeTab === 'projects'
                ? '/realtime-project-submissions/admin/stats'
                : '/internships/admin/submissions/stats';
            
            const response = await api.get(endpoint);
            setStats(response.data.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
            setStats(null);
        }
    };

    const handleApprove = async () => {
        if (!selectedSubmission) return;

        setActionLoading(true);
        try {
            const endpoint = activeTab === 'projects'
                ? `/realtime-project-submissions/${selectedSubmission.id}/approve`
                : `/internships/admin/submissions/${selectedSubmission.id}/approve`;

            await api.post(endpoint, {
                feedback: feedback || 'Great work!'
            });

            setShowReviewModal(false);
            setSelectedSubmission(null);
            setFeedback('');
            fetchSubmissions();
            fetchStats();
            alert(`${activeTab === 'projects' ? 'Project' : 'Internship'} approved and points awarded!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to approve submission');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedSubmission || !feedback) {
            alert('Please provide feedback for rejection');
            return;
        }

        setActionLoading(true);
        try {
            const endpoint = activeTab === 'projects'
                ? `/realtime-project-submissions/${selectedSubmission.id}/reject`
                : `/internships/admin/submissions/${selectedSubmission.id}/reject`;

            await api.post(endpoint, {
                feedback
            });

            setShowReviewModal(false);
            setSelectedSubmission(null);
            setFeedback('');
            fetchSubmissions();
            fetchStats();
            alert(`${activeTab === 'projects' ? 'Project' : 'Internship'} rejected`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reject submission');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRequestRevision = async () => {
        if (!selectedSubmission || !feedback) {
            alert('Please provide feedback for revision request');
            return;
        }

        setActionLoading(true);
        try {
            await api.post(`/realtime-project-submissions/${selectedSubmission.id}/request-revision`, {
                feedback
            });

            setShowReviewModal(false);
            setSelectedSubmission(null);
            setFeedback('');
            fetchSubmissions();
            fetchStats();
            alert('Revision requested');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to request revision');
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiClock, label: 'Pending' },
            approved: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle, label: 'Approved' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle, label: 'Rejected' },
            revision_requested: { bg: 'bg-orange-100', text: 'text-orange-800', icon: FiAlertCircle, label: 'Revision Requested' }
        };

        const badge = badges[status] || badges.pending;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    const filteredSubmissions = submissions.filter(sub => {
        const studentName = sub.student?.name || '';
        const title = activeTab === 'projects' ? (sub.project_name || '') : (sub.internship_title || '');
        
        return searchQuery === '' ||
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            studentName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading && !submissions.length) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading submissions...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Submissions Dashboard</h1>
                        <p className="text-gray-600">Review and approve student submissions</p>
                    </motion.div>

                    {/* Tab Switcher */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => { setActiveTab('projects'); setCurrentPage(1); setStatusFilter('all'); }}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${activeTab === 'projects'
                                ? 'bg-indigo-600 text-white transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Realtime Projects
                        </button>
                        {/* HIDDEN: Internships tab temporarily hidden */}
                        {/* <button
                            onClick={() => { setActiveTab('internships'); setCurrentPage(1); setStatusFilter('all'); }}
                            className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${activeTab === 'internships'
                                ? 'bg-indigo-600 text-white transform scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Internships
                        </button> */}
                    </div>

                    {/* Statistics Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-lg p-6"
                            >
                                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                                <div className="text-sm text-gray-600 mt-1">Total</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-yellow-50 rounded-xl shadow-lg p-6 border border-yellow-200"
                            >
                                <div className="text-3xl font-bold text-yellow-800">{stats.pending}</div>
                                <div className="text-sm text-yellow-700 mt-1">Pending</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-green-50 rounded-xl shadow-lg p-6 border border-green-200"
                            >
                                <div className="text-3xl font-bold text-green-800">{stats.approved}</div>
                                <div className="text-sm text-green-700 mt-1">Approved</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-red-50 rounded-xl shadow-lg p-6 border border-red-200"
                            >
                                <div className="text-3xl font-bold text-red-800">{stats.rejected}</div>
                                <div className="text-sm text-red-700 mt-1">Rejected</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-orange-50 rounded-xl shadow-lg p-6 border border-orange-200"
                            >
                                <div className="text-3xl font-bold text-orange-800">{stats.revision_requested}</div>
                                <div className="text-sm text-orange-700 mt-1">Revisions</div>
                            </motion.div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by project or student..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {['all', 'pending', 'approved', 'rejected', 'revision_requested'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === status
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'all' ? 'All' : status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submissions Table */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                            {error}
                        </div>
                    )}

                    {filteredSubmissions.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                            <FiAlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Found</h3>
                            <p className="text-gray-500">No submissions match your current filters.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Difficulty</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredSubmissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{submission.student?.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500">{submission.student?.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {activeTab === 'projects' ? submission.project_name : submission.internship_title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                                        {activeTab === 'projects' ? submission.difficulty : (submission.internship?.duration || 'Final Task')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(submission.submitted_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(submission.status)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSubmission(submission);
                                                            setShowReviewModal(true);
                                                            setFeedback('');
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                                                    >
                                                        <FiEye />
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} submissions
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                            disabled={currentPage === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {activeTab === 'projects' ? selectedSubmission.project_name : selectedSubmission.internship_title}
                                    </h2>
                                    <p className="text-gray-600">
                                        Submitted by {selectedSubmission.student?.name} on {new Date(selectedSubmission.submitted_at).toLocaleDateString()}
                                    </p>
                                    <div className="mt-2">{getStatusBadge(selectedSubmission.status)}</div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setSelectedSubmission(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                {/* Links */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FiGlobe /> Project Links
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedSubmission.github_url && (
                                            <a
                                                href={selectedSubmission.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <FiGithub className="text-gray-700" />
                                                <span className="text-sm text-gray-700">GitHub Repository</span>
                                            </a>
                                        )}
                                        {selectedSubmission.deployed_url && (
                                            <a
                                                href={selectedSubmission.deployed_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <FiGlobe className="text-gray-700" />
                                                <span className="text-sm text-gray-700">Live Demo</span>
                                            </a>
                                        )}
                                        {selectedSubmission.demo_video_url && (
                                            <a
                                                href={selectedSubmission.demo_video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <FiVideo className="text-gray-700" />
                                                <span className="text-sm text-gray-700">Demo Video</span>
                                            </a>
                                        )}
                                        {selectedSubmission.documentation_url && (
                                            <a
                                                href={selectedSubmission.documentation_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <FiFileText className="text-gray-700" />
                                                <span className="text-sm text-gray-700">Documentation</span>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSubmission.description}</p>
                                </div>

                                {/* Technologies */}
                                {selectedSubmission.technologies_used && selectedSubmission.technologies_used.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Technologies Used</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSubmission.technologies_used.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Challenges */}
                                {selectedSubmission.challenges_faced && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Challenges Faced</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSubmission.challenges_faced}</p>
                                    </div>
                                )}

                                {/* Learnings */}
                                {selectedSubmission.learnings && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Key Learnings</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSubmission.learnings}</p>
                                    </div>
                                )}

                                {/* Screenshots */}
                                {selectedSubmission.screenshots_urls && selectedSubmission.screenshots_urls.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <FiImage /> Screenshots
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {selectedSubmission.screenshots_urls.map((url, i) => (
                                                <a
                                                    key={i}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:underline text-sm p-2 bg-gray-50 rounded"
                                                >
                                                    Screenshot {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Feedback Input */}
                                {selectedSubmission.status === 'pending' || selectedSubmission.status === 'revision_requested' ? (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Admin Feedback</h3>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            rows="4"
                                            placeholder="Provide feedback to the student..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                ) : selectedSubmission.admin_feedback && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Previous Feedback</h3>
                                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedSubmission.admin_feedback}</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {(selectedSubmission.status === 'pending' || selectedSubmission.status === 'revision_requested') && (
                                <div className="flex items-center gap-3 mt-8 pt-6 border-t">
                                    <button
                                        onClick={handleApprove}
                                        disabled={actionLoading}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                                    >
                                        <FiCheck />
                                        {actionLoading ? 'Processing...' : 'Approve & Award Points'}
                                    </button>
                                    <button
                                        onClick={handleRequestRevision}
                                        disabled={actionLoading}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50"
                                    >
                                        <FiAlertCircle />
                                        Request Revision
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={actionLoading}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                                    >
                                        <FiX />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default AdminProjectSubmissionsPage;
