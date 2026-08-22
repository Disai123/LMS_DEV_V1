import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from 'react-query';
import { projectService } from '../../services/projectService';
import toast from 'react-hot-toast';
import { FiVideo, FiExternalLink, FiCheck, FiX } from 'react-icons/fi';

const ProjectVideoManager = ({ project, onClose }) => {
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const uploadVideoMutation = useMutation(
    (videoUrl) => {
      return projectService.updateProjectVideoUrl(project.id, videoUrl);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['project', project.id]);
        toast.success('Project video updated successfully!');
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update project video');
      }
    }
  );

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      toast.error('Please enter a video URL');
      return;
    }

    setIsUploading(true);
    try {
      await uploadVideoMutation.mutateAsync(videoUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setVideoUrl(project?.videoUrl || '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manage Project Video</h2>
              <p className="text-gray-600 mt-1">{project?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Supports YouTube, Google Drive, and other video hosting platforms
            </p>
          </div>

          {/* Current Video Preview */}
          {project?.videoUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Video
              </label>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={project.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Video Guidelines */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Video Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Video should be 5-15 minutes long for optimal engagement</li>
              <li>• Include project overview, key features, and learning outcomes</li>
              <li>• Use high-quality audio and clear visuals</li>
              <li>• Consider adding captions for accessibility</li>
              <li>• Make sure the video is publicly accessible or shared with appropriate permissions</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading || !videoUrl.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4" />
                Update Video URL
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectVideoManager;
