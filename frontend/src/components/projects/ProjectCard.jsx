import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiClock, FiTag } from 'react-icons/fi';

const ProjectCard = ({ project, locked }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleClick = (e) => {
    // Prevent event bubbling if needed, though mostly handled at container level
    if (locked) {
      console.log('Project is locked, redirecting to pricing');
      navigate('/pricing');
      return;
    }
    console.log('Project accessing:', project.id);
    navigate(`/student/realtime-projects/${project.id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    if (category?.toLowerCase().includes('web')) return '🌐';
    if (category?.toLowerCase().includes('mobile')) return '📱';
    if (category?.toLowerCase().includes('data')) return '📊';
    return '💻';
  };

  // Get static project image based on project name
  const getProjectImage = (name) => {
    const nameLower = name?.toLowerCase() || '';
    if (nameLower.includes('mobile')) {
      return '/images/projects/ecommerce-mobile.png';
    }
    if (nameLower.includes('multi')) {
      return '/images/projects/ecommerce-multi-agent.png';
    }
    if (nameLower.includes('ai') || nameLower.includes('agent')) {
      return '/images/projects/ecommerce-ai-agent.png';
    }
    if (nameLower.includes('ecommerce') || nameLower.includes('web')) {
      return '/images/projects/ecommerce-web.png';
    }
    return '/images/projects/ecommerce-web.png';
  };

  const thumbnailUrl = project.thumbnail
    ? `${apiUrl}/api/realtime-projects/${project.id}/files/${project.thumbnail}`
    : getProjectImage(project.name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white transition-all duration-300 overflow-hidden group border border-gray-200 shadow-lg hover:shadow-indigo-500/20 cursor-pointer relative"
      onClick={handleClick}
    >
      {/* Lock Overlay */}
      {locked && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-300">
          <div className="bg-white/90 p-4 rounded-full shadow-lg">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}

      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={project.name}
          className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/images/projects/ecommerce-web.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

        {/* Difficulty Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 text-xs font-bold rounded-full backdrop-blur-sm ${project.difficulty?.toLowerCase() === 'beginner'
            ? 'bg-green-500/80 text-white'
            : project.difficulty?.toLowerCase() === 'intermediate'
              ? 'bg-yellow-500/80 text-white'
              : 'bg-red-500/80 text-white'
            }`}>
            {project.difficulty || 'Intermediate'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <span>{getCategoryIcon(project.category)}</span>
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {project.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
          {project.description}
        </p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                <FiTag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{project.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {project.estimatedHours && (
              <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <FiClock className="w-3 h-3 mr-1" />
                {project.estimatedHours}h
              </span>
            )}
          </div>

          <button className={`font-semibold text-sm flex items-center transition-colors ${locked ? 'text-amber-600 hover:text-amber-700' : 'text-indigo-600 hover:text-indigo-700'}`}>
            {locked ? 'Get Access' : 'View Project'} <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

