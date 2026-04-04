import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const InternshipSubmissionModal = ({ isOpen, onClose, internship, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        github_url: '',
        drive_url: '',
        documentation_url: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('/api/internships/submissions', {
                internship_id: internship.id,
                internship_title: internship.title,
                ...formData
            });

            if (response.data.success) {
                toast.success('Tasks submitted successfully!');
                setSubmitted(true);
                if (onSuccess) onSuccess(response.data.data);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setFormData({ github_url: '', drive_url: '', documentation_url: '', description: '' });
                }, 2000);
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit tasks');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Submit Internship Tasks</h2>
                            <p className="text-sm text-gray-500 mt-1">{internship?.title}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-10 text-center space-y-4">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500 text-4xl">
                                ✓
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900">Well Done!</h4>
                            <p className="text-gray-600">Your tasks have been submitted for review. Points will be awarded once the admin approves your work.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* GitHub URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    GitHub Repository URL
                                </label>
                                <input
                                    type="url"
                                    name="github_url"
                                    value={formData.github_url}
                                    onChange={handleChange}
                                    placeholder="https://github.com/yourusername/repo"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Drive/Project URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Project / Demo URL
                                </label>
                                <input
                                    type="url"
                                    name="drive_url"
                                    value={formData.drive_url}
                                    onChange={handleChange}
                                    placeholder="https://your-demo-link.com"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Documentation */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Documentation / Report URL
                                </label>
                                <input
                                    type="url"
                                    name="documentation_url"
                                    value={formData.documentation_url}
                                    onChange={handleChange}
                                    placeholder="Google Drive, Notion, or PDF link"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Brief Description of Work <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="What did you achieve during this internship?"
                                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm resize-vertical"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InternshipSubmissionModal;
