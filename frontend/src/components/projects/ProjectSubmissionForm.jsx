import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiGlobe, FiVideo, FiImage, FiFileText, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';


const ProjectSubmissionForm = ({ project, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        project_id: project.id,
        project_name: project.name,
        github_url: '',
        deployed_url: '',
        demo_video_url: '',
        description: '',
        technologies_used: [],
        challenges_faced: '',
        learnings: '',
        screenshots_urls: [''],
        documentation_url: '',
        difficulty: project.difficulty || 'intermediate'
    });

    const [techInput, setTechInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleScreenshotChange = (index, value) => {
        const newScreenshots = [...formData.screenshots_urls];
        newScreenshots[index] = value;
        setFormData(prev => ({ ...prev, screenshots_urls: newScreenshots }));
    };

    const addScreenshotField = () => {
        if (formData.screenshots_urls.length < 5) {
            setFormData(prev => ({
                ...prev,
                screenshots_urls: [...prev.screenshots_urls, '']
            }));
        }
    };

    const removeScreenshotField = (index) => {
        const newScreenshots = formData.screenshots_urls.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, screenshots_urls: newScreenshots }));
    };

    const addTechnology = () => {
        if (techInput.trim() && !formData.technologies_used.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies_used: [...prev.technologies_used, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const removeTechnology = (tech) => {
        setFormData(prev => ({
            ...prev,
            technologies_used: prev.technologies_used.filter(t => t !== tech)
        }));
    };

    const validateStep = () => {
        setError('');

        if (step === 1) {
            if (!formData.github_url) {
                setError('GitHub URL is required');
                return false;
            }
            if (!formData.github_url.includes('github.com')) {
                setError('Please enter a valid GitHub URL');
                return false;
            }
        }

        if (step === 2) {
            if (!formData.description || formData.description.length < 100) {
                setError('Description must be at least 100 characters');
                return false;
            }
            if (formData.technologies_used.length === 0) {
                setError('Please add at least one technology');
                return false;
            }
        }

        if (step === 3) {
            const validScreenshots = formData.screenshots_urls.filter(url => url.trim());
            if (validScreenshots.length === 0) {
                setError('Please add at least one screenshot URL');
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        setLoading(true);
        setError('');

        try {
            // Filter out empty screenshot URLs
            const cleanedData = {
                ...formData,
                screenshots_urls: formData.screenshots_urls.filter(url => url.trim())
            };

            const response = await api.post('/realtime-project-submissions', cleanedData);

            if (response.data.success) {
                onSuccess(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit project');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { number: 1, title: 'Project Links', icon: FiGlobe },
        { number: 2, title: 'Description', icon: FiFileText },
        { number: 3, title: 'Screenshots', icon: FiImage },
        { number: 4, title: 'Review', icon: FiCheck }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Submit Project</h2>
                            <p className="text-indigo-100 mt-1">{project.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition"
                        >
                            <FiX size={24} />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="mt-6 flex items-center justify-between">
                        {steps.map((s, index) => (
                            <React.Fragment key={s.number}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition ${step >= s.number
                                            ? 'bg-white text-indigo-600'
                                            : 'bg-indigo-500 text-white'
                                            }`}
                                    >
                                        {step > s.number ? <FiCheck /> : <s.icon />}
                                    </div>
                                    <span className="text-xs mt-2 text-indigo-100">{s.title}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 rounded transition ${step > s.number ? 'bg-white' : 'bg-indigo-500'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Project Links */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FiGithub className="inline mr-2" />
                                        GitHub Repository URL *
                                    </label>
                                    <input
                                        type="url"
                                        name="github_url"
                                        value={formData.github_url}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username/repository"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FiGlobe className="inline mr-2" />
                                        Deployed Application URL
                                    </label>
                                    <input
                                        type="url"
                                        name="deployed_url"
                                        value={formData.deployed_url}
                                        onChange={handleChange}
                                        placeholder="https://your-app.vercel.app"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FiVideo className="inline mr-2" />
                                        Demo Video URL (YouTube/Loom)
                                    </label>
                                    <input
                                        type="url"
                                        name="demo_video_url"
                                        value={formData.demo_video_url}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <FiFileText className="inline mr-2" />
                                        Documentation URL (Google Docs/Drive)
                                    </label>
                                    <input
                                        type="url"
                                        name="documentation_url"
                                        value={formData.documentation_url}
                                        onChange={handleChange}
                                        placeholder="https://docs.google.com/document/..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Description */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Project Description * (min 100 characters)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Describe your project, what it does, and what you learned..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.description.length} / 100 characters
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Technologies Used *
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                            placeholder="e.g., React, Node.js, MongoDB"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTechnology}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.technologies_used.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                            >
                                                {tech}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTechnology(tech)}
                                                    className="hover:text-indigo-900"
                                                >
                                                    <FiX size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Challenges Faced
                                    </label>
                                    <textarea
                                        name="challenges_faced"
                                        value={formData.challenges_faced}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="What challenges did you encounter and how did you overcome them?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Key Learnings
                                    </label>
                                    <textarea
                                        name="learnings"
                                        value={formData.learnings}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="What did you learn from this project?"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Screenshots */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <p className="text-sm text-gray-600 mb-4">
                                    Add URLs to screenshots (Google Drive, Imgur, etc.). At least one is required.
                                </p>

                                {formData.screenshots_urls.map((url, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => handleScreenshotChange(index, e.target.value)}
                                            placeholder={`Screenshot ${index + 1} URL`}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {formData.screenshots_urls.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeScreenshotField(index)}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <FiX size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {formData.screenshots_urls.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={addScreenshotField}
                                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition"
                                    >
                                        + Add Another Screenshot URL
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                                    <h3 className="font-bold text-lg text-gray-900">Review Your Submission</h3>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">GitHub URL:</p>
                                        <a href={formData.github_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                                            {formData.github_url}
                                        </a>
                                    </div>

                                    {formData.deployed_url && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Deployed URL:</p>
                                            <a href={formData.deployed_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm">
                                                {formData.deployed_url}
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Technologies:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {formData.technologies_used.map((tech, i) => (
                                                <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Description:</p>
                                        <p className="text-sm text-gray-600 mt-1">{formData.description.substring(0, 200)}...</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Screenshots:</p>
                                        <p className="text-sm text-gray-600">{formData.screenshots_urls.filter(u => u).length} screenshot(s)</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                                    <FiAlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-semibold">Before submitting:</p>
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>Ensure all URLs are publicly accessible</li>
                                            <li>Double-check your GitHub repository is public</li>
                                            <li>Verify screenshot links work</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                            <FiAlertCircle />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t">
                        <button
                            type="button"
                            onClick={step === 1 ? onClose : prevStep}
                            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <div className="flex gap-3">
                            {step < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Project'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProjectSubmissionForm;
