import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiGithub, FiGlobe, FiVideo, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MyProjectSubmissionsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/realtime-project-submissions/my-submissions');
            setSubmissions(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                icon: FiClock,
                label: 'Pending Review'
            },
            approved: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                icon: FiCheckCircle,
                label: 'Approved'
            },
            rejected: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                icon: FiXCircle,
                label: 'Rejected'
            },
            revision_requested: {
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                icon: FiAlertCircle,
                label: 'Revision Requested'
            }
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;

        try {
            await api.delete(`/realtime-project-submissions/${id}`);
            fetchSubmissions();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete submission');
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading your submissions...</p>
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
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Project Submissions</h1>
                        <p className="text-gray-600">Track the status of your realtime project submissions</p>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Submissions List */}
                    {submissions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl shadow-lg p-12 text-center"
                        >
                            <div className="text-gray-400 mb-4">
                                <FiAlertCircle className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Submissions Yet</h3>
                            <p className="text-gray-500 mb-6">You haven't submitted any projects yet.</p>
                            <a
                                href="/student/realtime-projects"
                                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Browse Projects
                            </a>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {submissions.map((submission, index) => (
                                <motion.div
                                    key={submission.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
                                >
                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{submission.project_name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span>Submitted {new Date(submission.submitted_at).toLocaleDateString()}</span>
                                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                        {submission.difficulty}
                                                    </span>
                                                </div>
                                            </div>
                                            {getStatusBadge(submission.status)}
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-700 mb-4 line-clamp-2">{submission.description}</p>

                                        {/* Technologies */}
                                        {submission.technologies_used && submission.technologies_used.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {submission.technologies_used.map((tech, i) => (
                                                    <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Links */}
                                        <div className="flex flex-wrap gap-4 mb-4">
                                            {submission.github_url && (
                                                <a
                                                    href={submission.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                                                >
                                                    <FiGithub />
                                                    <span className="text-sm">GitHub</span>
                                                </a>
                                            )}
                                            {submission.deployed_url && (
                                                <a
                                                    href={submission.deployed_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                                                >
                                                    <FiGlobe />
                                                    <span className="text-sm">Live Demo</span>
                                                </a>
                                            )}
                                            {submission.demo_video_url && (
                                                <a
                                                    href={submission.demo_video_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
                                                >
                                                    <FiVideo />
                                                    <span className="text-sm">Video</span>
                                                </a>
                                            )}
                                        </div>

                                        {/* Points Awarded */}
                                        {submission.status === 'approved' && submission.points_awarded > 0 && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                                <p className="text-green-800 font-semibold">
                                                    🎉 Earned {submission.points_awarded} points!
                                                </p>
                                            </div>
                                        )}

                                        {/* Admin Feedback */}
                                        {submission.admin_feedback && (
                                            <div className={`border rounded-lg p-3 mb-4 ${submission.status === 'approved' ? 'bg-green-50 border-green-200' :
                                                submission.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                                    'bg-orange-50 border-orange-200'
                                                }`}>
                                                <p className="text-sm font-semibold text-gray-700 mb-1">Admin Feedback:</p>
                                                <p className="text-sm text-gray-600">{submission.admin_feedback}</p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 pt-4 border-t">
                                            <button
                                                onClick={() => setSelectedSubmission(submission)}
                                                className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <FiEye />
                                                View Details
                                            </button>

                                            {(submission.status === 'pending' || submission.status === 'revision_requested') && (
                                                <>
                                                    <button
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                                    >
                                                        <FiEdit />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(submission.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <FiTrash2 />
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubmission.project_name}</h2>
                                    {getStatusBadge(selectedSubmission.status)}
                                </div>
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-700">{selectedSubmission.description}</p>
                                </div>

                                {selectedSubmission.challenges_faced && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Challenges Faced</h3>
                                        <p className="text-gray-700">{selectedSubmission.challenges_faced}</p>
                                    </div>
                                )}

                                {selectedSubmission.learnings && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Key Learnings</h3>
                                        <p className="text-gray-700">{selectedSubmission.learnings}</p>
                                    </div>
                                )}

                                {selectedSubmission.screenshots_urls && selectedSubmission.screenshots_urls.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Screenshots</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedSubmission.screenshots_urls.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                                                    Screenshot {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default MyProjectSubmissionsPage;
