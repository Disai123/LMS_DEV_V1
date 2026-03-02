import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar, FiUsers, FiAward, FiClock, FiCode,
  FiArrowRight, FiX, FiCheck, FiSend, FiUser, FiZap
} from 'react-icons/fi';
import { hackathonService } from '../services/hackathonService';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import Header from '../components/common/Header';

// ─── Status helpers ──────────────────────────────────────────────────────────
const statusConfig = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
  active: { label: 'Live Now', bg: 'bg-green-100 text-green-800 border-green-200' },
};
const difficultyConfig = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};

const CARD_ACCENTS = [
  'border-l-blue-500',
  'border-l-amber-500',
  'border-l-violet-500',
  'border-l-emerald-500',
  'border-l-rose-500',
  'border-l-cyan-500',
]

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

// ─── Join Modal ──────────────────────────────────────────────────────────────
const JoinModal = ({ hackathon, onClose }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamMembers: [{ name: '', email: '' }, { name: '', email: '' }],
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const addMember = () => setFormData(p => ({ ...p, teamMembers: [...p.teamMembers, { name: '', email: '' }] }));
  const removeMember = (i) => formData.teamMembers.length > 1 && setFormData(p => ({ ...p, teamMembers: p.teamMembers.filter((_, j) => j !== i) }));
  const updateMember = (i, field, val) => setFormData(p => ({ ...p, teamMembers: p.teamMembers.map((m, j) => j === i ? { ...m, [field]: val } : m) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const valid = formData.teamMembers.filter(m => m.name.trim() && m.email.trim());
      if (!valid.length) { alert('Add at least one team member.'); return; }
      await hackathonService.submitJoinRequest(hackathon.id, {
        teamName: formData.teamName,
        teamMembers: valid,
        message: formData.message
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header stripe */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-t-3xl" />

        <div className="p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Request Sent!</h3>
              <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">
                Your team request for <strong>{hackathon.name}</strong> has been sent. You'll be notified once approved.
              </p>
              <button onClick={onClose} className="px-8 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-500 transition-colors">
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">Join Hackathon</h3>
                  <p className="text-gray-400 text-sm">{hackathon.name}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Team Name *</label>
                  <input
                    type="text" required value={formData.teamName}
                    onChange={e => setFormData(p => ({ ...p, teamName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                    placeholder="Enter your team name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Team Members *</label>
                  <div className="space-y-3">
                    {formData.teamMembers.map((member, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text" value={member.name}
                            onChange={e => updateMember(i, 'name', e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                            placeholder="Full Name"
                          />
                          <input
                            type="email" value={member.email}
                            onChange={e => updateMember(i, 'email', e.target.value)}
                            className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                            placeholder="Email"
                          />
                        </div>
                        {formData.teamMembers.length > 1 && (
                          <button type="button" onClick={() => removeMember(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addMember}
                    className="mt-3 flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-sm">
                    <FiUser className="w-4 h-4" /> Add Member
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Message to Admin</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm resize-none"
                    placeholder="Tell us about your team's experience..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    Cancel
                  </button>
                  <motion.button
                    type="submit" disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    className="flex-1 py-3 bg-amber-400 text-slate-900 font-black rounded-xl hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {submitting ? <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <FiSend className="w-4 h-4" />}
                    {submitting ? 'Sending...' : 'Send Request'}
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const HackathonLandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { hasAccess, isAdmin } = usePermissions();

  const [hackathons, setHackathons] = useState([]);
  const [enrolledHackathons, setEnrolledHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => { fetchHackathons(); }, [isAuthenticated]);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const res = await hackathonService.getAllHackathons({ sort: 'start_date', order: 'desc', limit: 15 });
      const sorted = (res.data.hackathons || []).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      setHackathons(sorted);
      if (isAuthenticated && user) {
        try {
          const enrolled = await hackathonService.getMyHackathons();
          setEnrolledHackathons(enrolled.data?.hackathons || []);
        } catch { /* silent */ }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      {/* ── POSTER HERO ────────────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 overflow-hidden">
        {/* Amber radial spotlight glow — breaks the matte flatness */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.05) 45%, transparent 70%)'
        }} />

        {/* Grain texture overlay — boosted opacity */}
        <div className="absolute inset-0 opacity-[0.35]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }} />

        {/* Amber diagonal stripe — more visible */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-400 opacity-[0.18] skew-x-12 origin-top-right" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">

            {/* Left — Poster title */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase font-mono">GNANAM · Hackathon Series</span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white leading-[0.88] tracking-tight mb-6">
                HACK.<br />
                <span className="text-amber-400">BUILD.</span><br />
                WIN.
              </h1>

              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                Compete with talented developers, ship innovative solutions in
                limited time, and prove what you can build under real pressure.
              </p>
            </div>

            {/* Right — Live stats board */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full md:w-64 flex-shrink-0 shadow-xl shadow-black/30">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Event Dashboard</span>
              </div>
              <div className="space-y-5">
                {[
                  { label: 'Total Events', value: hackathons.length, color: 'text-white' },
                  { label: 'Active Now', value: hackathons.filter(h => h.status === 'active').length, color: 'text-green-400' },
                  { label: 'Upcoming', value: hackathons.filter(h => h.status === 'upcoming').length, color: 'text-blue-400' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">{s.label}</span>
                    <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FiZap className="w-3 h-3 text-amber-400" />
                  24/7 Support Available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom zigzag border */}
        <div className="relative h-8">
          <svg viewBox="0 0 1200 32" preserveAspectRatio="none" className="absolute inset-0 w-full h-full fill-[#FAF9F6]">
            <polygon points="0,32 100,0 200,32 300,0 400,32 500,0 600,32 700,0 800,32 900,0 1000,32 1100,0 1200,32 1200,32 0,32" />
          </svg>
        </div>
      </section>

      {/* ── ENROLLED (if logged in) ────────────────────────────────────────── */}
      {isAuthenticated && enrolledHackathons.length > 0 && (
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-6 bg-green-500" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Your Active Events</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrolledHackathons.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-green-100 border-l-4 border-l-green-500 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">Enrolled</span>
                  {h.difficulty && <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyConfig[h.difficulty] || 'bg-gray-100 text-gray-600'}`}>{h.difficulty}</span>}
                </div>
                <h3 className="font-black text-slate-900 mb-2 text-lg">{h.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{h.description}</p>
                <div className="text-xs text-gray-400 flex items-center gap-1.5 mb-4">
                  <FiCalendar className="w-3.5 h-3.5" />
                  {formatDate(h.start_date)} — {formatDate(h.end_date)}
                </div>
                <button
                  onClick={() => navigate('/student/hackathons')}
                  className="w-full py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  View Details <FiArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── ALL HACKATHONS ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-6 bg-amber-400" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Open Events</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900">Available Hackathons</h2>
          </div>
          <div className="text-right text-sm text-gray-400 hidden md:block">
            <div className="font-bold text-slate-900">{hackathons.length}</div>
            <div>Events</div>
          </div>
        </div>

        {hackathons.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Active Hackathons</h3>
            <p className="text-gray-400 text-sm">Check back soon — new events are added monthly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {hackathons.map((hackathon, index) => {
              const status = statusConfig[hackathon.status] || { label: hackathon.status, bg: 'bg-gray-100 text-gray-700 border-gray-200' };
              const isActive = hackathon.status === 'active';
              return (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className={`group bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${CARD_ACCENTS[index % CARD_ACCENTS.length]} overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Active ribbon */}
                  {isActive && (
                    <div className="bg-green-500 text-white text-xs font-black text-center py-1.5 tracking-widest uppercase">
                      🔴 Live Now
                    </div>
                  )}

                  <div className="p-6">
                    {/* Status + difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${status.bg}`}>{status.label}</span>
                      {hackathon.difficulty && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyConfig[hackathon.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                          {hackathon.difficulty}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{hackathon.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-5 leading-relaxed">{hackathon.description}</p>

                    {hackathon.technology && (
                      <div className="flex items-center gap-2 mb-4">
                        <FiCode className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-gray-600">{hackathon.technology}</span>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 mb-5 bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(hackathon.start_date)} — {formatDate(hackathon.end_date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiClock className="w-3.5 h-3.5 text-gray-400" />
                        {formatTime(hackathon.start_date)} — {formatTime(hackathon.end_date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiUsers className="w-3.5 h-3.5 text-gray-400" />
                        {hackathon.current_participants || 0} participants
                        {hackathon.max_groups && ` · Max ${hackathon.max_groups} groups`}
                      </div>
                    </div>

                    {/* Prize */}
                    {hackathon.prize_description && (
                      <div className="mb-5 flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <FiAward className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 leading-relaxed">{hackathon.prize_description}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedHackathon(hackathon)}
                      className="w-full py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 text-sm flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? 'Join Hackathon' : 'Request to Join'}
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── WHY JOIN ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 mt-8">
        {/* Zigzag top */}
        <div className="relative -mt-8 mb-12 h-8">
          <svg viewBox="0 0 1200 32" preserveAspectRatio="none" className="absolute inset-0 w-full h-full fill-slate-900">
            <polygon points="0,0 100,32 200,0 300,32 400,0 500,32 600,0 700,32 800,0 900,32 1000,0 1100,32 1200,0 1200,32 0,32" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Why Join</span>
              <div className="h-px w-10 bg-amber-400" />
            </div>
            <h2 className="text-4xl font-black text-white">The GNANAM Edge</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FiZap className="w-6 h-6" />, title: 'Build Under Pressure', body: 'Time-boxed challenges force you to make real engineering decisions fast — the most valuable skill you can build.' },
              { icon: <FiUsers className="w-6 h-6" />, title: 'Real Team Dynamics', body: 'Collaborate with developers across different skill levels. Learn to delegate, communicate, and ship together.' },
              { icon: <FiAward className="w-6 h-6" />, title: 'Win Recognition', body: 'Top performers receive prizes, certificates, and social proof that stands out on any resume or portfolio.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 transition-colors"
              >
                <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center text-amber-400 mb-5">
                  {item.icon}
                </div>
                <h3 className="font-black text-white text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedHackathon && (
          <JoinModal
            hackathon={selectedHackathon}
            onClose={() => setSelectedHackathon(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HackathonLandingPage;
