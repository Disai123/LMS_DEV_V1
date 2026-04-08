import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import InternshipCard from '../components/internship/InternshipCard'
import InternshipDetailsModal from '../components/internship/InternshipDetailsModal'
import internshipService from '../services/internshipService'
import { useAuth } from '../context/AuthContext'

const StudentInternshipsPage = () => {
  const { user } = useAuth()
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [myRegistrations, setMyRegistrations] = useState([])
  const [search, setSearch] = useState('')

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.q = search
      const res = await internshipService.getAll(params)
      setInternships(res.data.data.internships || [])

      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const regRes = await internshipService.getMyInternships()
          setMyRegistrations(regRes.data.data.registrations || [])
        } catch (e) {
          console.error('Error fetching my registrations:', e)
        }
      }
    } catch (err) {
      console.error('Error fetching internships:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInternships()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInternships()
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const filteredInternships = internships;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-display">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Virtual Internships
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium mb-6">
            Discover virtual internships and showcase your capabilities. Gain real-world experience and accelerate your career.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by role, skill, or tech..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500 font-bold uppercase tracking-wider">
            Showing {filteredInternships.length} of {internships.length} internships
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredInternships.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="text-6xl mb-6 grayscale opacity-20">🔎</div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No matching tracks found</h3>
            <p className="text-slate-500 font-medium">Try broadening your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map((internship, index) => (
              <InternshipCard
                key={internship.id}
                index={index}
                internship={internship}
                registration={myRegistrations.find(r => r.internship_id === internship.id)}
                onClick={setSelectedInternship}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Details Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <InternshipDetailsModal
            internship={selectedInternship}
            registration={myRegistrations.find(r => r.internship_id === selectedInternship.id)}
            onClose={() => setSelectedInternship(null)}
            onRegistered={() => {
              setSelectedInternship(null)
              fetchInternships()
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default StudentInternshipsPage
