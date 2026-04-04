import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import internshipService from '../services/internshipService'
import CreateInternshipModal from '../components/admin/CreateInternshipModal'
import InternshipRegistrationsList from '../components/admin/InternshipRegistrationsList'

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700 border-green-200',
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200'
}

const AdminInternshipsPage = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingInternship, setEditingInternship] = useState(null)
  const [viewingRegistrations, setViewingRegistrations] = useState(null)
  const [search, setSearch] = useState('')

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const res = await internshipService.getAll({ q: search })
      setInternships(res.data.data.internships || [])
    } catch (err) {
      console.error('Error fetching internships:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [search])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return
    try {
      await internshipService.delete(id)
      fetchInternships()
    } catch (err) {
      alert('Failed to delete internship')
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      await internshipService.togglePublish(id)
      fetchInternships()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  return (
    <div className="space-y-8 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">Manage Internships</h1>
          <p className="text-gray-500 mt-1">Create and monitor internship programs for your students.</p>
        </div>
        <button
          onClick={() => { setEditingInternship(null); setShowCreateModal(true) }}
          className="btn-primary flex items-center gap-2 shadow-magic"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Internship
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Programs</p>
              <p className="text-3xl font-bold text-primary">{internships.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              🚀
            </div>
          </div>
        </div>
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-3xl font-bold text-success">{internships.filter(i => i.is_published).length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/5 flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              📡
            </div>
          </div>
        </div>
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Applicants</p>
              <p className="text-3xl font-bold text-secondary">
                {internships.reduce((acc, i) => acc + (i.current_registrations || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              👥
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-[2rem] shadow-card overflow-hidden border border-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Program</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Registrations</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Published</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading programs...</td>
                </tr>
              ) : internships.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">No internships found.</td>
                </tr>
              ) : (
                internships.map((internship) => (
                  <tr key={internship.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-xl text-primary shadow-sm border border-primary/10">
                          {internship.logo || '📖'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{internship.title}</p>
                          <p className="text-xs text-secondary font-semibold uppercase tracking-wider">{internship.duration}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_COLORS[internship.status]}`}>
                        {internship.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingRegistrations(internship)}
                        className="text-sm font-bold text-primary hover:text-secondary transition-colors underline decoration-dotted underline-offset-4"
                      >
                        {internship.current_registrations || 0} Students
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(internship.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          internship.is_published ? 'bg-success' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            internship.is_published ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingInternship(internship); setShowCreateModal(true) }}
                          className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(internship.id)}
                          className="p-2 text-error hover:bg-error/5 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateInternshipModal
          internship={editingInternship}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchInternships() }}
        />
      )}

      {viewingRegistrations && (
        <InternshipRegistrationsList
          internship={viewingRegistrations}
          onClose={() => setViewingRegistrations(null)}
        />
      )}
    </div>
  )
}

export default AdminInternshipsPage
