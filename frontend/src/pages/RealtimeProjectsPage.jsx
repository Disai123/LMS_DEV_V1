import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import AccessDenied from '../components/common/AccessDenied';
import { usePermissions } from '../hooks/usePermissions';
import { projectService } from '../services/projectService';
import toast from 'react-hot-toast';

const RealtimeProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { permissions, loading: permissionsLoading, hasAccess, isAdmin } = usePermissions();

  useEffect(() => {
    // Only fetch projects if user has access or is admin
    if (isAdmin || hasAccess('realtimeProjects')) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [isAdmin, permissions]);

  const handleContactAdmin = () => {
    // You can implement email functionality or redirect to contact page
    window.location.href = 'mailto:admin@gnanamai.com?subject=Request for Realtime Projects Access&body=Hello, I would like to request access to realtime projects. My student ID is: [Your Student ID]';
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      if (response.success) {
        // Extract projects array from response.data.projects
        const projectsArray = response.data?.projects || response.data || [];
        setProjects(projectsArray);
      } else {
        throw new Error(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Projects</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check permissions
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Show access denied if user doesn't have permission and is not admin
  if (!isAdmin && !hasAccess('realtimeProjects')) {
    return <AccessDenied feature="realtimeProjects" onContactAdmin={handleContactAdmin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Realtime Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn by doing with hands-on projects that build real-world skills.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Available</h3>
            <p className="text-gray-600">
              Check back later for exciting project opportunities!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(projects || []).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="relative bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 overflow-hidden group border border-gray-200 shadow-lg hover:shadow-indigo-500/20 w-full"
              >
                {/* Lock Overlay */}
                {project.isLocked && (
                  <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center text-center p-6 transition-all duration-300">
                    <div className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-lg border border-gray-700">
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Locked</h3>
                    <p className="text-gray-300 text-sm mb-6 max-w-xs">
                      Upgrade plan to unlock this project.
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.location.href = '/pricing'; }}
                      className="px-6 py-2 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all"
                    >
                      View Plans
                    </button>
                  </div>
                )}
                {/* Project Image/Thumbnail */}
                <div className="relative overflow-hidden">
                  <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="text-white text-4xl font-bold">
                      {project.title?.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${project.difficulty?.toLowerCase() === 'beginner'
                      ? 'bg-green-500/80 text-white'
                      : project.difficulty?.toLowerCase() === 'intermediate'
                        ? 'bg-yellow-500/80 text-white'
                        : 'bg-red-500/80 text-white'
                      }`}>
                      {project.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.duration && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {project.duration}
                        </span>
                      )}
                      {project.phases && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {project.phases} phases
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RealtimeProjectsPage;