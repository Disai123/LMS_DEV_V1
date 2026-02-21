import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiStar, FiCode, FiCpu } from 'react-icons/fi';

const ProjectsUpsell = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 relative"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FiLock className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Unlock Realtime Projects
                    </h2>

                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Get hands-on experience by building real-world applications.
                        Upgrade your plan to access our full library of industry-standard projects.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-10 text-left max-w-3xl mx-auto">
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <FiCode className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Real Scenarios</h3>
                            </div>
                            <p className="text-sm text-gray-600">Work on projects derived from actual industry requirements.</p>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <FiCpu className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Modern Tech</h3>
                            </div>
                            <p className="text-sm text-gray-600">Master the latest frameworks and tools used by top companies.</p>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                                    <FiStar className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Portfolio Ready</h3>
                            </div>
                            <p className="text-sm text-gray-600">Build a stunning portfolio to showcase your skills to recruiters.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                    >
                        Upgrade to Pro
                    </button>

                    <p className="mt-4 text-sm text-gray-500">
                        Starting at just <span className="font-bold text-gray-900">₹499/month</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectsUpsell;
