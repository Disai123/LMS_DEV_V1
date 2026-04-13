import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiAward, FiClock, FiCode, 
  FiArrowRight, FiZap, FiSearch,
  FiActivity, FiTarget, FiBriefcase, FiCpu, FiTrendingUp
} from 'react-icons/fi'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import InternshipCard from '../components/internship/InternshipCard'
import InternshipDetailsModal from '../components/internship/InternshipDetailsModal'
import internshipService from '../services/internshipService'

const InternshipsLandingPage = () => {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [search, setSearch] = useState('')

  const fetchInternships = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.q = search
      const res = await internshipService.getAll(params)
      setInternships(res.data.data.internships || [])
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
    <div className="min-h-screen flex flex-col font-display bg-[#fdfdfd]">
      <Header />

      {/* ── MODERN CAREER HERO ─────────────────────────────────────────── */}
      <section className="relative bg-[#0a0c12] overflow-hidden min-h-[85vh] flex items-center">
        {/* Deep Indigo/Cyan radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 10% 30%, rgba(79,70,229,0.15) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(6,182,212,0.12) 0%, transparent 50%)'
        }} />

        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-16">
            
            {/* Left — High-End Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-indigo-400 text-[10px] font-bold tracking-[0.2em] uppercase font-mono">Future Workforce Ready</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-8">
                Sync with the <br/>
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Industry Pulse.</span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-medium">
                Bridge the gap between campus and corporate. Master real-world stacks through immersive virtual tracks designed by industry veterans.
              </p>

              <div className="flex flex-wrap gap-5">
                <button 
                  onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all flex items-center gap-3 shadow-xl shadow-indigo-600/20"
                >
                  Browse Tracks
                  <FiArrowRight />
                </button>
                <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden`}>
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-slate-400 text-sm font-bold tracking-tight">1,200+ Active Learners</span>
                </div>
              </div>
            </motion.div>

            {/* Right — Glassmorphism Matrix Board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 bg-indigo-500/10 blur-3xl rounded-full" />
              <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
                         <FiCpu className="text-white" />
                      </div>
                      <span className="text-white font-bold tracking-tight">Career Launchpad</span>
                   </div>
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">V2.4 Live</span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   {[
                      { icon: <FiAward className="text-cyan-400" />, label: 'Verified Tracks', value: internships.length, trend: '+3 new' },
                      { icon: <FiTrendingUp className="text-emerald-400" />, label: 'Hiring Rate', value: '88%', trend: 'Avg. 15d' },
                      { icon: <FiActivity className="text-indigo-400" />, label: 'Mentors', value: '45+', trend: 'Top tier' },
                      { icon: <FiTarget className="text-rose-400" />, label: 'Certificates', value: '2k+', trend: 'Verified' },
                   ].map((item, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-[1.5rem] p-5">
                         <div className="flex items-center justify-between mb-3 text-lg">
                            {item.icon}
                            <span className="text-[10px] font-bold text-slate-500">{item.trend}</span>
                         </div>
                         <div className="text-2xl font-black text-white mb-1">{item.value}</div>
                         <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
                      </div>
                   ))}
                </div>

                <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-2xl p-4">
                   <div className="flex items-center justify-between text-xs font-bold mb-3">
                      <span className="text-indigo-400 uppercase tracking-widest">Ongoing Success</span>
                      <span className="text-white">92% Engagement</span>
                   </div>
                   <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '92%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" 
                      />
                   </div>
                </div>
              </div>

              {/* Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl space-y-2"
              >
                 <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FiZap className="text-emerald-400 text-sm" />
                 </div>
                 <div className="text-[10px] font-black text-white leading-tight">Fast-track <br/> Certified</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRACKS EXPLORER ────────────────────────────────────────────── */}
      <section id="catalog" className="py-32 bg-[#fdfdfd]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
             <div className="max-w-xl">
                <div className="inline-flex items-center gap-3 mb-6 bg-indigo-500/5 text-indigo-600 px-4 py-1 rounded-full border border-indigo-500/10">
                   <FiBriefcase className="text-sm" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Enrollment</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">Active Opportunities</h2>
                <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">Explore our curated tracks and find the perfect match for your career goals.</p>
             </div>

             <div className="flex flex-wrap gap-4">
                <div className="relative group">
                   <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                   <input
                     type="text"
                     placeholder="Search skills (React, Node...)"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-full sm:w-64 transition-all shadow-sm font-medium"
                   />
                </div>
             </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[430px] bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredInternships.map((internship, index) => (
                <InternshipCard
                  key={internship.id}
                  index={index}
                  internship={internship}
                  onClick={setSelectedInternship}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-10 rotate-3">
                   <FiSearch className="text-4xl text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">No matching tracks found</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">Try a specific skill or tech stack, or clear filters to see all available slots.</p>
                <button 
                  onClick={() => setSearch('')}
                  className="px-10 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
                >
                  Clear Discovery
                </button>
             </div>
          )}
        </div>
      </section>

      {/* ── ADVANTAGE — CLEAN ─────────────────────────────────────────── */}
      <section className="py-32 bg-[#f8faff] border-t border-indigo-100/30">
         <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">Engineered for your professional success.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                  { 
                    icon: <FiAward className="text-indigo-600" />, 
                    title: 'Sync with Industry', 
                    body: 'Our curriculum is constantly updated to match the tools and workflows top-tier engineering teams use today.' 
                  },
                  { 
                    icon: <FiCpu className="text-cyan-600" />, 
                    title: 'Master the Stack', 
                    body: 'Go deep into React, Node, LangChain, and AWS. Build production-grade apps that actually ship.' 
                  },
                  { 
                    icon: <FiTarget className="text-emerald-600" />, 
                    title: 'Proven Certification', 
                    body: 'Earn verified credentials that hiring managers trust. Every certificate is backed by documented work.' 
                  },
               ].map((item, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                     <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-all">
                        {item.icon}
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-4">{item.title}</h3>
                     <p className="text-slate-500 font-medium leading-relaxed">{item.body}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-40 bg-indigo-600 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
           backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 70%)'
         }} />
         <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center relative">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[0.9]">READY TO<br/>SYNC UP?</h2>
            <p className="text-indigo-100/70 text-xl font-bold max-w-xl mx-auto mb-16 italic">"The gap between student and professional is just one track away."</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button 
                 onClick={() => window.location.href='/register'}
                 className="px-12 py-6 bg-white text-indigo-600 font-black text-2xl rounded-3xl hover:scale-105 transition-all shadow-2xl"
               >
                 CREATE FREE ACCOUNT
               </button>
               <button 
                 onClick={() => navigate('/pricing')}
                 className="px-8 py-6 bg-indigo-700/50 text-white font-bold text-lg rounded-3xl border border-white/10 hover:bg-indigo-700/80 transition-all"
               >
                 View All Plans
               </button>
            </div>
         </div>
      </section>

      <Footer />

      {/* Details Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <InternshipDetailsModal
            internship={selectedInternship}
            onClose={() => setSelectedInternship(null)}
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}} />
    </div>
  )
}

export default InternshipsLandingPage
