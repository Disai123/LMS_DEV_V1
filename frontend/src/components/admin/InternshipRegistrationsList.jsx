import { useState, useEffect } from 'react'
import internshipService from '../../services/internshipService'

const InternshipRegistrationsList = ({ internship, onClose }) => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchRegistrations()
  }, [internship.id])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const res = await internshipService.getRegistrations(internship.id)
      setRegistrations(res.data.data.registrations || [])
    } catch (err) {
      console.error('Error fetching registrations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (regId, status) => {
    try {
      setUpdatingId(regId)
      await internshipService.updateRegistration(internship.id, regId, { status })
      await fetchRegistrations()
    } catch (err) {
      alert('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-strong border border-white/50">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-secondary"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display flex items-center gap-3">
              Applicants: {internship.title}
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                {registrations.length} Total
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Review student progress and issue certificates.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Fetching applicant data...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="text-6xl mb-4 grayscale opacity-30">👥</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No students registered yet</h3>
              <p className="text-slate-500">Wait for students to discover this program.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date Registered</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Current Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {reg.student?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{reg.student?.name}</p>
                            <p className="text-xs text-slate-400 mt-1">{reg.student?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">
                          {new Date(reg.registered_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          reg.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          reg.status === 'dropped' ? 'bg-red-100 text-red-700 border-red-200' :
                          'bg-amber-100 text-amber-700 border-amber-200'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          disabled={updatingId === reg.id}
                          value={reg.status}
                          onChange={(e) => handleStatusUpdate(reg.id, e.target.value)}
                          className="text-xs font-bold border-slate-200 rounded-lg h-9 px-2 bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="registered">Registered</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="dropped">Dropped</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 flex items-center justify-end bg-slate-50/30">
          <button
            onClick={onClose}
            className="btn-primary min-w-[140px] shadow-magic"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  )
}

export default InternshipRegistrationsList
