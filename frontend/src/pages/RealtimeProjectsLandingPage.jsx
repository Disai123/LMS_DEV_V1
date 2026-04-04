import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import api from '../services/api'
import {
  FiArrowRight, FiClock, FiLayers, FiCode, FiLock,
  FiCheckCircle, FiZap, FiChevronDown, FiChevronUp,
  FiStar, FiPackage
} from 'react-icons/fi'

// ─── Accent palette ──────────────────────────────────────────────────────────
const ACCENTS = [
  {
    border: 'border-l-blue-500',
    glow: 'hover:shadow-blue-500/10',
    num: 'text-blue-500',
    badge: 'bg-blue-900/40 text-blue-300 border-blue-700',
    tag: 'bg-blue-950 text-blue-300 border-blue-800',
    ring: 'ring-blue-500/30',
    phaseDot: 'bg-blue-500',
    gradient: 'from-blue-900/20 to-transparent',
  },
  {
    border: 'border-l-violet-500',
    glow: 'hover:shadow-violet-500/10',
    num: 'text-violet-500',
    badge: 'bg-violet-900/40 text-violet-300 border-violet-700',
    tag: 'bg-violet-950 text-violet-300 border-violet-800',
    ring: 'ring-violet-500/30',
    phaseDot: 'bg-violet-500',
    gradient: 'from-violet-900/20 to-transparent',
  },
  {
    border: 'border-l-emerald-500',
    glow: 'hover:shadow-emerald-500/10',
    num: 'text-emerald-500',
    badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
    tag: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    ring: 'ring-emerald-500/30',
    phaseDot: 'bg-emerald-500',
    gradient: 'from-emerald-900/20 to-transparent',
  },
  {
    border: 'border-l-rose-500',
    glow: 'hover:shadow-rose-500/10',
    num: 'text-rose-500',
    badge: 'bg-rose-900/40 text-rose-300 border-rose-700',
    tag: 'bg-rose-950 text-rose-300 border-rose-800',
    ring: 'ring-rose-500/30',
    phaseDot: 'bg-rose-500',
    gradient: 'from-rose-900/20 to-transparent',
  },
  {
    border: 'border-l-amber-500',
    glow: 'hover:shadow-amber-500/10',
    num: 'text-amber-500',
    badge: 'bg-amber-900/40 text-amber-300 border-amber-700',
    tag: 'bg-amber-950 text-amber-300 border-amber-800',
    ring: 'ring-amber-500/30',
    phaseDot: 'bg-amber-500',
    gradient: 'from-amber-900/20 to-transparent',
  },
]

// ─── Project-specific "what you'll build" snapshots ──────────────────────────
const PROJECT_GLIMPSES = {
  'todo-app': {
    emoji: '✅',
    whatYouBuild: [
      'Full CRUD task manager with user auth',
      'Drag-and-drop task prioritisation',
      'Real-time sync with WebSocket',
      'Responsive PWA with offline support',
    ],
    phases: [
      { label: 'BRD', detail: 'Define requirements & user stories' },
      { label: 'UI/UX', detail: 'UI/UX wireframes & component design' },
      { label: 'Build', detail: 'React frontend + Node.js REST API' },
      { label: 'QA', detail: 'Unit tests, integration & E2E testing' },
      { label: 'Deploy', detail: 'CI/CD pipeline + cloud deployment' },
    ],
    plan: 'free',
    planLabel: 'Free',
    outcome: 'Portfolio-ready task app',
  },
  'ecommerce-web': {
    emoji: '🛒',
    whatYouBuild: [
      'Production e-commerce store with cart & checkout',
      'Admin dashboard with inventory control',
      'Duplicate payment gateway integration',
      'JWT auth, role-based access, order tracking',
    ],
    phases: [
      { label: 'BRD', detail: 'Stakeholder analysis & market mapping' },
      { label: 'UI/UX', detail: 'High-fidelity User Interface prototypes' },
      { label: 'Build', detail: 'React + Node.js + PostgreSQL full stack' },
      { label: 'QA', detail: 'Load testing & security audit' },
      { label: 'Deploy', detail: 'Dockerised deployment on AWS/GCP' },
    ],
    plan: 'basic',
    planLabel: 'Basic',
    outcome: 'E-commerce Full Stack platform',
  },
  'ecommerce-ai-agent': {
    emoji: '🤖',
    whatYouBuild: [
      'AI shopping assistant powered by LangChain & Langgraph',
      'Natural language search & product recommendation',
      'Multi-turn conversation memory',
      'FastAPI backend with streaming responses',
    ],
    phases: [
      { label: 'BRD', detail: 'AI feature spec & prompt engineering plan' },
      { label: 'UI/UX', detail: 'Chat interface & agent widget design' },
      { label: 'Build', detail: 'LangChain agents + GROQ + FastAPI' },
      { label: 'QA', detail: 'Hallucination testing & safety guardrails' },
      { label: 'Deploy', detail: 'Model serving on render instances' },
    ],
    plan: 'pro',
    planLabel: 'Pro',
    outcome: 'AI-powered shopping assistant',
  },
  'multi-agent': {
    emoji: '🧠',
    whatYouBuild: [
      'Multi-agent AI system with LangGraph orchestration',
      'Autonomous agents with memory & tool calling',
      'Real-time agent monitoring dashboard',
      'FastAPI backend with Redis task queuing',
    ],
    phases: [
      { label: 'BRD', detail: 'Agent roles, goals & orchestration design' },
      { label: 'UI/UX', detail: 'Agent dashboard & flow visualisation' },
      { label: 'Build', detail: 'LangGraph + FastAPI + Redis + GROQ' },
      { label: 'QA', detail: 'Agent reliability & hallucination testing' },
      { label: 'Deploy', detail: 'Render Deployment with Auto deployment' },
    ],
    plan: 'pro',
    planLabel: 'Pro',
    outcome: 'Production multi-agent AI orchestration system',
  },
  'trip-planner': {
    emoji: '✈️',
    whatYouBuild: [
      'AI-powered travel planning web app',
      'Itinerary builder with maps & weather integration',
      'Budget calculator & booking link aggregator',
      'User auth with saved trips & sharing',
    ],
    phases: [
      { label: 'BRD', detail: 'User personas, market research & scope' },
      { label: 'UI/UX', detail: 'Interactive map UI & Figma prototypes' },
      { label: 'Build', detail: 'React + FASTAPI + Open Weather Maps API + GROQ' },
      { label: 'QA', detail: 'API mocking, performance & UX testing' },
      { label: 'Deploy', detail: 'Render Deployment with Auto deployment' },
    ],
    plan: 'pro',
    planLabel: 'Pro',
    outcome: 'AI-powered travel planning platform',
  },
}

const DEFAULT_GLIMPSE = (title) => ({
  emoji: '🚀',
  whatYouBuild: [
    `Build a complete, production-ready ${title}`,
    'Implement authentication & role-based access',
    'Design and ship a responsive frontend',
    'Write tests, CI/CD and deploy to cloud',
  ],
  phases: [
    { label: 'BRD', detail: 'Requirements & user stories' },
    { label: 'UI/UX', detail: 'Wireframes & prototyping' },
    { label: 'Build', detail: 'Full-stack implementation' },
    { label: 'QA', detail: 'Testing & quality assurance' },
    { label: 'Deploy', detail: 'Render deployment & launch' },
  ],
  plan: 'basic',
  planLabel: 'Basic',
  outcome: 'Portfolio-ready production app',
})

const PLAN_COLORS = {
  free: { bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-700', icon: '🟢' },
  basic: { bg: 'bg-blue-900/50', text: 'text-blue-300', border: 'border-blue-700', icon: '🔵' },
  pro: { bg: 'bg-violet-900/50', text: 'text-violet-300', border: 'border-violet-700', icon: '⭐' },
}

const PHASES_OVERVIEW = [
  { step: '01', label: 'BRD', full: 'Business Requirements' },
  { step: '02', label: 'UI/UX', full: 'Design & Prototyping' },
  { step: '03', label: 'Dev', full: 'Full-Stack Development' },
  { step: '04', label: 'QA', full: 'Testing & Quality' },
  { step: '05', label: 'Deploy', full: 'Deployment & Launch' },
]

// ─── Single project card with expandable glimpse ──────────────────────────────
const ProjectCard = ({ project, index, onGetStarted }) => {
  const [expanded, setExpanded] = useState(index === 0)
  const accent = ACCENTS[index % ACCENTS.length]

  // Match glimpse by project id
  const projectKey = Object.keys(PROJECT_GLIMPSES).find(k =>
    project.id?.toLowerCase().includes(k) ||
    project.title?.toLowerCase().includes(k.replace(/-/g, ' '))
  )
  const glimpse = projectKey ? PROJECT_GLIMPSES[projectKey] : DEFAULT_GLIMPSE(project.title)
  const planStyle = PLAN_COLORS[glimpse.plan] || PLAN_COLORS.basic

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className={`group relative bg-slate-900 border border-slate-800 border-l-4 ${accent.border} rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl ${accent.glow} transition-all duration-300`}
    >
      {/* ── Card header (always visible) ── */}
      <div
        className="flex flex-col lg:flex-row lg:items-center gap-5 p-6 cursor-pointer select-none"
        onClick={() => setExpanded(e => !e)}
      >
        {/* Index number */}
        <div className={`font-mono text-5xl font-black ${accent.num} opacity-25 group-hover:opacity-50 transition-opacity flex-shrink-0 leading-none`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Title & badges */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-2xl">{glimpse.emoji}</span>
            <h3 className="text-xl font-black text-white">{project.title}</h3>
            {project.isExtension && (
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${accent.badge}`}>Extension</span>
            )}
            {/* Plan badge */}
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${planStyle.bg} ${planStyle.text} ${planStyle.border}`}>
              {glimpse.plan === 'free' ? '🟢 Free' : glimpse.plan === 'basic' ? '🔵 Basic' : '⭐ Pro'} Plan
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-6 flex-shrink-0 lg:text-right">
          <div>
            <div className="text-xs text-slate-600 flex items-center gap-1 mb-1"><FiClock className="w-3 h-3" /> Duration</div>
            <div className="text-sm font-bold text-white">{project.duration}</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Difficulty</div>
            <div className={`text-sm font-bold ${project.difficulty === 'Advanced' ? 'text-rose-400' : project.difficulty === 'Beginner' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {project.difficulty}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors`}>
            {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* ── Expanded Glimpse ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="glimpse"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`bg-gradient-to-b ${accent.gradient} border-t border-slate-800`}>
              <div className="p-6 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: What you'll build */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCheckCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">What You'll Build</span>
                  </div>
                  <ul className="space-y-2">
                    {glimpse.whatYouBuild.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${accent.phaseDot} mt-2 flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {/* Outcome badge */}
                  <div className="mt-4 flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2">
                    <FiStar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-xs text-amber-300 font-semibold">{glimpse.outcome}</span>
                  </div>
                </div>

                {/* Middle: 5-Phase journey */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <FiLayers className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Project Journey</span>
                  </div>
                  <div className="space-y-2">
                    {glimpse.phases.map((phase, pi) => (
                      <div key={pi} className="flex items-start gap-3">
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full ${accent.phaseDot} flex items-center justify-center text-white text-[10px] font-black`}>
                            {pi + 1}
                          </div>
                          {pi < glimpse.phases.length - 1 && (
                            <div className="w-px h-3 bg-slate-700 mt-1" />
                          )}
                        </div>
                        <div className="pb-1">
                          <div className="text-xs font-bold text-white">{phase.label}</div>
                          <div className="text-xs text-slate-500 leading-tight">{phase.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Tech stack + CTA */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FiCode className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tech Stack</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, ti) => (
                        <span
                          key={ti}
                          className={`font-mono text-xs border px-2.5 py-1 rounded-lg ${accent.tag}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-5">
                    {glimpse.plan !== 'free' && (
                      <div className={`flex items-center gap-2 text-xs mb-3 px-3 py-2 rounded-xl border ${planStyle.bg} ${planStyle.text} ${planStyle.border}`}>
                        <FiLock className="w-3 h-3" />
                        Requires {glimpse.planLabel} plan to start
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onGetStarted() }}
                      className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 text-slate-900 font-black px-5 py-3 rounded-xl hover:bg-amber-300 transition-all duration-300 text-sm"
                    >
                      <FiZap className="w-4 h-4" />
                      {glimpse.plan === 'free' ? 'Start for Free' : `Unlock with ${glimpse.planLabel}`}
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
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
            id: p.id || String(i + 1),
            title: p.name,
            description: p.description,
            difficulty: p.difficulty
              ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)
              : 'Intermediate',
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
    { id: 'todo-app', title: 'Todo App', description: 'Build a full-featured task manager with authentication, real-time sync, and offline support.', difficulty: 'Beginner', duration: '20 hrs', phases: 5, technologies: ['React', 'Node.js', 'SQLite DB'], category: 'Full-Stack', order: 1, isExtension: false },
    { id: 'ecommerce-web', title: 'E-Commerce Web Application', description: 'Build a complete, production-ready e-commerce platform from scratch with React, Node.js, and PostgreSQL.', difficulty: 'Intermediate', duration: '40 hrs', phases: 5, technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js'], category: 'Full-Stack', order: 2, isExtension: false },
    { id: 'ecommerce-ai-agent', title: 'E-Commerce AI Agent', description: 'Extend your e-commerce platform with an intelligent AI shopping assistant using LangChain and OpenAI.', difficulty: 'Advanced', duration: '30 hrs', phases: 5, technologies: ['Python', 'LangChain', 'GROQ API', 'FastAPI'], category: 'AI/ML', order: 3, isExtension: true },
    { id: 'multi-agent', title: 'Multi-Agent AI System', description: 'Build an advanced multi-agent AI system with LangGraph orchestration, autonomous tool-calling agents, and a real-time monitoring dashboard.', difficulty: 'Advanced', duration: '45 hrs', phases: 5, technologies: ['LangGraph', 'Python', 'FastAPI', 'Redis', 'GROQ API'], category: 'AI/ML', order: 4, isExtension: true },
    { id: 'trip-planner', title: 'Trip Planner AI App', description: 'Build an AI-powered travel planning platform with itinerary generation, maps integration, budget tracking and trip sharing.', difficulty: 'Advanced', duration: '35 hrs', phases: 5, technologies: ['React', 'Node.js', 'Open Weather Maps API', 'GROQ API', 'PostgreSQL'], category: 'Full-Stack', order: 5, isExtension: false },
  ]

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/student/realtime-projects')
    } else {
      localStorage.setItem('redirectAfterLogin', '/student/realtime-projects')
      navigate('/login')
    }
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

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-800">
        {/* Dot matrix */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        {/* Amber radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 80% at 20% 50%, rgba(251,191,36,0.07) 0%, transparent 70%)'
        }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-3xl">
            {/* Terminal dots */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-10">
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
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-amber-400" />
                <span className="font-mono text-amber-400 text-xs tracking-widest uppercase">Workshop Series · {projects.length} Projects</span>
              </div>

              <h1 className="text-6xl sm:text-7xl font-black leading-none mb-6 tracking-tight">
                Build.<br />
                <span className="text-slate-500">Ship.</span><br />
                <span className="text-amber-400">Own it.</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
                Stop watching tutorials. Build <strong className="text-white">production-grade applications</strong> through
                structured 5-phase projects — from BRD to deployment — exactly how
                real engineering teams work.
              </p>

              {/* Plan legend */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { icon: '🟢', plan: 'Free', desc: 'Start immediately' },
                  { icon: '🔵', plan: 'Basic', desc: 'Unlock more projects' },
                  { icon: '⭐', plan: 'Pro', desc: 'Full access' },
                ].map((p) => (
                  <div key={p.plan} className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                    <span>{p.icon}</span>
                    <span className="text-sm font-bold text-white">{p.plan}</span>
                    <span className="text-xs text-slate-500">— {p.desc}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-7 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 text-sm shadow-lg shadow-amber-400/20"
                >
                  Start a Project
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center gap-3 border border-slate-700 text-slate-300 font-bold px-6 py-4 rounded-xl hover:border-amber-400/50 hover:text-white transition-all duration-300 text-sm"
                >
                  <FiPackage className="w-4 h-4" /> View Plans
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5-PHASE BANNER ─────────────────────────────────────────────────── */}
      <section className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <FiLayers className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Every project follows 5 real-world phases</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {PHASES_OVERVIEW.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3">
                <span className="font-mono text-xs text-slate-600">{p.step}</span>
                <div>
                  <div className="text-sm font-bold text-white">{p.label}</div>
                  <div className="text-xs text-slate-500">{p.full}</div>
                </div>
              </div>
            ))}
            <FiArrowRight className="w-4 h-4 text-slate-600" />
            <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-xl px-5 py-3">
              <FiStar className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold text-sm">Portfolio-Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT GLIMPSE CARDS ──────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FiCode className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Click any card to see the full glimpse</span>
              </div>
              <h2 className="text-4xl font-black text-white">Featured Projects</h2>
            </div>
            <div className="text-slate-600 font-mono text-sm hidden sm:block">{projects.length} available</div>
          </div>

          <div className="space-y-4">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onGetStarted={handleGetStarted}
              />
            ))}
          </div>

          {/* Locked hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 bg-slate-900/60 border border-slate-800 border-dashed rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiLock className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <div className="font-bold text-white mb-1">5+ More Projects Unlocked with Pro</div>
                <div className="text-slate-500 text-sm">Blockchain · Social Platform · IoT · SaaS Starter · Data Pipeline</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 font-black px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors text-sm flex-shrink-0"
            >
              View All Plans <FiArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── WHY SECTION ────────────────────────────────────────────────────── */}
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

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
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
              className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black px-8 py-5 rounded-2xl hover:bg-amber-300 transition-all duration-300 text-base flex-shrink-0 shadow-xl shadow-amber-400/20"
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
