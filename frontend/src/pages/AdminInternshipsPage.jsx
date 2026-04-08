import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiFileText, FiTrash2, FiUsers, FiClock, FiSearch } from 'react-icons/fi';
import internshipService from '../services/internshipService';
import CreateInternshipModal from '../components/admin/CreateInternshipModal';
import InternshipRegistrationsList from '../components/admin/InternshipRegistrationsList';
import InternshipSubmissionsManagement from '../components/admin/InternshipSubmissionsManagement';

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const AdminInternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  
  // NEW: specific state for submissions
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedInternshipForSubmissions, setSelectedInternshipForSubmissions] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await internshipService.getAll();
      setInternships(res.data.data.internships || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await internshipService.delete(id);
      fetchInternships();
    } catch (err) {
      alert('Failed to delete internship');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await internshipService.togglePublish(id);
      fetchInternships();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleEdit = (internship) => {
    setEditingInternship(internship);
    setShowCreateModal(true);
  };
  
  const handleViewSubmissions = (internship) => {
    setSelectedInternshipForSubmissions(internship);
    setShowSubmissions(true);
  };

  const filteredInternships = internships.filter(i => 
    i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Internship Programs</h1>
            <p className="text-gray-600 mt-2">Manage internship programs for your students.</p>
          </div>
          <button
            onClick={() => { setEditingInternship(null); setShowCreateModal(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Internship</span>
          </button>
        </div>

        {/* Stats Quick View */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Programs</p>
              <p className="text-3xl font-bold text-indigo-600">{internships.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
              🚀
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-3xl font-bold text-green-600">{internships.filter(i => i.is_published).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
              📡
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Applicants</p>
              <p className="text-3xl font-bold text-blue-600">
                {internships.reduce((acc, i) => acc + (i.current_registrations || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Internships Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading programs...</div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4 text-6xl">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Internships Found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new program.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="h-28 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
                  {internship.logo ? (
                    <img src={internship.logo} alt={internship.title} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-5xl">💻</div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Status Badges */}
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_COLORS[internship.status] || 'bg-gray-100 text-gray-800'}`}>
                      {internship.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${internship.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {internship.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{internship.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{internship.description}</p>

                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-xs text-gray-600">
                      <FiClock className="w-4 h-4 mr-2" />
                      <span className="font-medium">{internship.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center">
                        <FiUsers className="w-4 h-4 mr-2" />
                        <span>{internship.current_registrations || 0} Registrations</span>
                      </div>
                      <button
                        onClick={() => setViewingRegistrations(internship)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(internship)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span className="text-xs font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleViewSubmissions(internship)}
                        className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <FiFileText className="w-4 h-4" />
                        <span className="text-xs font-medium">Submissions</span>
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTogglePublish(internship.id)}
                        className={`flex-1 py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1 text-xs font-medium ${
                          internship.is_published
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {internship.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(internship.id)}
                        className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateInternshipModal
          internship={editingInternship}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchInternships(); }}
        />
      )}

      {viewingRegistrations && (
        <InternshipRegistrationsList
          internship={viewingRegistrations}
          onClose={() => setViewingRegistrations(null)}
        />
      )}

      {/* Submissions Management Modal */}
      {showSubmissions && selectedInternshipForSubmissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Submissions - {selectedInternshipForSubmissions.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage and review internship submissions
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmissions(false);
                    setSelectedInternshipForSubmissions(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <InternshipSubmissionsManagement internshipId={selectedInternshipForSubmissions.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInternshipsPage;
