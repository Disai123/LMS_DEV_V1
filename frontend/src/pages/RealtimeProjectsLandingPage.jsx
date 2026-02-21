import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import api from '../services/api'
import { FiArrowRight, FiClock, FiLayers, FiCode, FiLock } from 'react-icons/fi'

// ─── Project card accent colors ─────────────────────────────────────────────
const ACCENTS = [
  { border: 'border-l-blue-400', badge: 'bg-blue-900/40 text-blue-300 border-blue-700', dot: 'bg-blue-400', num: 'text-blue-400' },
  { border: 'border-l-violet-400', badge: 'bg-violet-900/40 text-violet-300 border-violet-700', dot: 'bg-violet-400', num: 'text-violet-400' },
  { border: 'border-l-emerald-400', badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700', dot: 'bg-emerald-400', num: 'text-emerald-400' },
  { border: 'border-l-rose-400', badge: 'bg-rose-900/40 text-rose-300 border-rose-700', dot: 'bg-rose-400', num: 'text-rose-400' },
]

const PHASES = [
  { step: '01', label: 'BRD', full: 'Business Requirements' },
  { step: '02', label: 'UI/UX', full: 'Design & Prototyping' },
  { step: '03', label: 'Dev', full: 'Full-Stack Development' },
  { step: '04', label: 'QA', full: 'Testing & Quality' },
  { step: '05', label: 'Deploy', full: 'Deployment & Launch' },
]

const RealtimeProjectsLandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await api.get('/realtime-projects/public')
        if (response.data.success && response.data.data) {
          const mapped = response.data.data.map((p, i) => ({
            id: p.id || i + 1,
            title: p.name,
            description: p.description,
            difficulty: p.difficulty || 'Intermediate',
            duration: `${p.estimatedHours || 40} hrs`,
            phases: 5,
            technologies: p.tags || [],
            category: p.category || 'Full-Stack',
            order: p.order !== undefined ? p.order : 999,
            isExtension: false,
          })).sort((a, b) => a.order - b.order)
          setProjects(mapped)
        }
      } catch {
        setProjects(getFallback())
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const getFallback = () => [
    { id: 1, title: 'E-Commerce Web Application', description: 'Build a complete, production-ready e-commerce platform from scratch with React, Node.js, and PostgreSQL.', difficulty: 'Intermediate', duration: '40 hrs', phases: 5, technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js'], category: 'Full-Stack', order: 1, isExtension: false },
    { id: 2, title: 'E-Commerce AI Agent', description: 'Extend your e-commerce platform with an intelligent AI shopping assistant using LangChain and OpenAI.', difficulty: 'Advanced', duration: '30 hrs', phases: 5, technologies: ['Python', 'LangChain', 'OpenAI API', 'FastAPI'], category: 'AI/ML', order: 2, isExtension: true },
    { id: 3, title: 'E-Commerce Mobile App', description: 'Transform your e-commerce platform into a native mobile experience with React Native for iOS and Android.', difficulty: 'Intermediate', duration: '35 hrs', phases: 5, technologies: ['React Native', 'Expo', 'AsyncStorage'], category: 'Mobile', order: 3, isExtension: true },
    { id: 4, title: 'Multi-Agent AI System', description: 'Build an advanced multi-agent AI system for e-commerce with agent orchestration using LangGraph.', difficulty: 'Advanced', duration: '45 hrs', phases: 5, technologies: ['LangGraph', 'Python', 'FastAPI', 'Redis'], category: 'AI/ML', order: 4, isExtension: true },
  ]

  const handleGetStarted = () => {
    localStorage.setItem('redirectAfterLogin', '/student/realtime-projects')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Dot matrix bg */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-3xl">
            {/* Terminal label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-xs text-slate-500 ml-2">gnanam.ai / realtime-projects</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-amber-400" />
                <span className="font-mono text-amber-400 text-xs tracking-widest uppercase">Workshop Series</span>
              </div>

              <h1 className="text-6xl sm:text-7xl font-black leading-none mb-6 tracking-tight">
                Build.<br />
                <span className="text-slate-400">Ship.</span><br />
                <span className="text-amber-400">Own it.</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-10">
                Stop watching tutorials. Build production-grade applications through
                structured 5-phase projects — from BRD to deployment — exactly how
                real engineering teams work.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-7 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 text-sm"
                >
                  Start a Project
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="inline-flex items-center gap-2 text-slate-500 text-sm border border-slate-700 px-5 py-4 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {projects.length} projects available
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5-PHASE PROCESS ───────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <FiLayers className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Every project follows 5 real-world phases</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {PHASES.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3">
                <span className="font-mono text-xs text-slate-600">{p.step}</span>
                <div>
                  <div className="text-sm font-bold text-white">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.full}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center text-slate-600">
              <FiArrowRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-xl px-5 py-3">
              <span className="text-amber-400 font-bold text-sm">Portfolio-Ready Project</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT CARDS ─────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FiCode className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Current Workshop Projects</span>
              </div>
              <h2 className="text-4xl font-black text-white">Featured Projects</h2>
            </div>
            <div className="text-slate-600 font-mono text-sm">{projects.length} / 10+ available</div>
          </div>

          <div className="space-y-5">
            {projects.map((project, index) => {
              const accent = ACCENTS[index % ACCENTS.length]
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`group relative bg-slate-900 border border-slate-800 border-l-4 ${accent.border} rounded-2xl p-7 hover:bg-slate-800/80 hover:border-slate-700 transition-all duration-300 cursor-pointer`}
                  onClick={handleGetStarted}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Number */}
                    <div className={`font-mono text-5xl font-black ${accent.num} opacity-30 group-hover:opacity-60 transition-opacity flex-shrink-0 leading-none`}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Main content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-black text-white">{project.title}</h3>
                        {project.isExtension && (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${accent.badge}`}>Extension</span>
                        )}
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">{project.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-2xl">{project.description}</p>
                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, ti) => (
                          <span key={ti} className="font-mono text-xs bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-lg">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta + CTA */}
                    <div className="flex flex-col items-end gap-4 flex-shrink-0">
                      <div className="flex gap-4 text-right">
                        <div>
                          <div className="text-xs text-slate-600 flex items-center gap-1 justify-end mb-1"><FiClock className="w-3 h-3" /> Duration</div>
                          <div className="text-sm font-bold text-white">{project.duration}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Difficulty</div>
                          <div className={`text-sm font-bold ${project.difficulty === 'Advanced' ? 'text-rose-400' : 'text-amber-400'}`}>{project.difficulty}</div>
                        </div>
                      </div>
                      <button
                        onClick={handleGetStarted}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-amber-400 hover:text-slate-900 hover:border-amber-400 transition-all duration-300 group-hover:opacity-100"
                      >
                        Start Project <FiArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Locked projects hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiLock className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">5+ More Projects Unlocked with Premium</div>
                <div className="text-slate-500 text-sm">Mobile Apps · Blockchain · Social Platform · IoT · SaaS Starter</div>
              </div>
            </div>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 font-black px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors text-sm flex-shrink-0"
            >
              Unlock All <FiArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── WHY SECTION ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-800 rounded-2xl overflow-hidden">
            {[
              { num: '01', title: 'Real-World Structure', body: 'Every project follows the same lifecycle as professional software teams — BRD, Design, Build, Test, Deploy.' },
              { num: '02', title: 'Hands-On Only', body: 'No more passive watching. You write the code, make the decisions, debug the errors — just like a real dev.' },
              { num: '03', title: 'Portfolio-Ready Output', body: 'Each completed project is a deployable, demo-able application that showcases your skills to employers.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 p-8"
              >
                <div className="font-mono text-4xl font-black text-slate-800 mb-5">{item.num}</div>
                <h3 className="text-lg font-black text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-amber-400" />
                <span className="font-mono text-amber-400 text-xs tracking-widest uppercase">Ready to build?</span>
              </div>
              <h2 className="text-4xl font-black text-white">Start your first project today.</h2>
              <p className="text-slate-500 mt-3 text-sm">No experience required. Just bring the determination.</p>
            </div>
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-8 py-5 rounded-2xl hover:bg-amber-300 transition-all duration-300 text-base flex-shrink-0"
            >
              Get Started — Free
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default RealtimeProjectsLandingPage
