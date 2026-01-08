import React, { useState } from 'react';
import axios from 'axios';

const ProjectSubmissionModal = ({ projectId, projectName, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        github_url: '',
        description: '',
        screenshot_url: ''
    });
    const [technologies, setTechnologies] = useState([]);
    const [techInput, setTechInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.description.length < 100) {
            setError('Description must be at least 100 characters');
            return;
        }

        if (!formData.github_url.includes('github.com')) {
            setError('Please enter a valid GitHub URL');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            // Use relative path by default to leverage Vite proxy and avoid CORS
            const apiUrl = import.meta.env.VITE_API_URL || '';

            const submissionData = {
                project_id: projectId,
                project_name: projectName,
                github_url: formData.github_url,
                description: formData.description,
                technologies_used: technologies,
                screenshots_urls: [formData.screenshot_url],
                deployed_url: '',
                demo_video_url: '',
                challenges_faced: '',
                learnings: '',
                documentation_url: '',
                difficulty: 'intermediate'
            };

            const response = await axios.post(
                `${apiUrl}/api/realtime-project-submissions`,
                submissionData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addTechnology = () => {
        if (techInput.trim() && !technologies.includes(techInput.trim())) {
            setTechnologies([...technologies, techInput.trim()]);
            setTechInput('');
        }
    };

    const removeTechnology = (tech) => {
        setTechnologies(technologies.filter(t => t !== tech));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Submit Your Project</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* GitHub URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                GitHub Repository URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.github_url}
                                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                placeholder="https://github.com/username/repository"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your project (minimum 100 characters)..."
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm resize-vertical"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length} / 100 characters
                            </p>
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Technologies Used
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                    placeholder="e.g., React, Node.js"
                                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={addTechnology}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-sm"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTechnology(tech)}
                                            className="text-indigo-700 hover:text-indigo-900 font-bold text-lg leading-none"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Screenshot URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Screenshot URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.screenshot_url}
                                onChange={(e) => setFormData({ ...formData, screenshot_url: e.target.value })}
                                placeholder="https://imgur.com/... or Google Drive link"
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
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
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Project for Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectSubmissionModal;
