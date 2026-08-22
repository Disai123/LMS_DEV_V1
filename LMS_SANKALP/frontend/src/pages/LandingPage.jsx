import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import { useRef } from 'react'
import { FiBookOpen, FiCode, FiUsers, FiAward, FiTrendingUp, FiZap, FiTarget, FiGlobe, FiStar, FiPlay, FiShield, FiCheck, FiArrowRight } from 'react-icons/fi'

// ─── Marquee Strip ──────────────────────────────────────────────────────────
const marqueeItems = [
  'Course Learning', 'Chapter Progress', 'Assessments', 'Certificates',
  'Expert Content', 'Skill Building', 'Progress Tracking', 'Learning Paths'
]

const MarqueeStrip = () => (
  <div className="overflow-hidden bg-amber-500 py-3 relative">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      className="flex gap-12 whitespace-nowrap"
    >
      {[...marqueeItems, ...marqueeItems].map((item, i) => (
        <span key={i} className="text-white font-bold text-sm tracking-widest uppercase flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
          {item}
        </span>
      ))}
    </motion.div>
  </div>
)

// ─── Hero Floating Card ──────────────────────────────────────────────────────
const HeroMockup = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    {/* Main card */}
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="absolute top-8 left-4 w-64 bg-white rounded-2xl shadow-2xl p-5 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold">G</div>
        <div>
          <div className="text-xs font-bold text-gray-800">Python for AI</div>
          <div className="text-xs text-gray-400">4 modules left</div>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full" style={{ width: '68%' }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Progress</span><span className="font-bold text-amber-600">68%</span>
      </div>
    </motion.div>

    {/* Certificate card */}
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 3 }}
      animate={{ opacity: 1, y: 0, rotate: 3 }}
      transition={{ duration: 0.9, delay: 0.6 }}
      className="absolute bottom-12 right-0 w-60 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl p-5 border border-amber-400/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center">
          <FiAward className="w-4 h-4 text-amber-400" />
        </div>
        <span className="text-xs font-bold text-white">Certificate Earned</span>
      </div>
      <div className="text-xs text-gray-400 mb-2">Web Development Fundamentals</div>
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => <FiStar key={i} className="w-3 h-3 text-amber-400 fill-current" />)}
        <span className="text-xs text-gray-400 ml-1">Excellence</span>
      </div>
    </motion.div>

    {/* Stats pill */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="absolute top-0 right-8 bg-white rounded-2xl shadow-xl px-5 py-3 border border-gray-100 flex items-center gap-3"
    >
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
        <FiTrendingUp className="w-4 h-4 text-green-600" />
      </div>
      <div>
        <div className="text-base font-black text-gray-900">85%</div>
        <div className="text-xs text-gray-400">Success Rate</div>
      </div>
    </motion.div>

    {/* Hackathon badge */}
    <motion.div
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute bottom-0 left-12 bg-amber-400 rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-2"
    >
      <FiUsers className="w-4 h-4 text-white" />
      <span className="text-xs font-bold text-white">Live Hackathon →</span>
    </motion.div>
  </div>
)

// ─── Main Component ──────────────────────────────────────────────────────────
const LandingPage = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const handleLoginClick = () => navigate('/login')
  const handleExploreCourses = () => navigate('/courses')
  const handleExploreProjects = () => navigate(isAuthenticated ? '/student/realtime-projects' : '/realtime-projects')
  const handleExploreHackathons = () => navigate(isAuthenticated ? '/student/hackathons' : '/hackathons')

  return (
    <div className="min-h-screen bg-stone-50 overflow-x-hidden">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-slate-900 via-primary-dark to-slate-900 overflow-hidden flex flex-col">

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        {/* Gold accent line left */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-amber-400 to-transparent opacity-60" />

        <motion.div style={{ y: heroY }} className="relative flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left — Editorial Text */}
              <div>
                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center gap-3 mb-10"
                >
                  <div className="h-px w-12 bg-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase">India's Premier AI Learning Platform</span>
                </motion.div>

                {/* Stacked editorial headline */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="mb-10"
                >
                  <div className="overflow-hidden mb-2">
                    <motion.h1
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                      className="text-7xl sm:text-8xl lg:text-[6.5rem] font-black text-white leading-[0.9] tracking-tight font-display"
                    >
                      LEARN.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden mb-2 flex items-center gap-4">
                    <motion.h1
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.25 }}
                      className="text-7xl sm:text-8xl lg:text-[6.5rem] font-black text-amber-400 leading-[0.9] tracking-tight font-display"
                    >
                      BUILD.
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h1
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.35 }}
                      className="text-7xl sm:text-8xl lg:text-[6.5rem] font-black text-white/30 leading-[0.9] tracking-tight font-display"
                      style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}
                    >
                      ACHIEVE.
                    </motion.h1>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="text-gray-400 text-lg max-w-md leading-relaxed mb-10 font-light"
                >
                  AI-powered personalized learning, real-world projects, live hackathons,
                  and industry-recognized certifications — all in one platform.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="flex flex-wrap gap-4"
                >
                  {isAuthenticated ? (
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/student'}
                      className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-bold text-base px-7 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20"
                    >
                      Go to Dashboard
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-bold text-base px-7 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20"
                    >
                      Start for Free
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={handleExploreCourses}
                    className="inline-flex items-center gap-3 border border-white/20 text-white font-semibold text-base px-7 py-4 rounded-xl hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300"
                  >
                    <FiPlay className="w-4 h-4" />
                    Explore Courses
                  </button>
                </motion.div>
              </div>

              {/* Right — Floating UI Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="hidden lg:block relative h-96"
              >
                <HeroMockup />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-primary py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '1,200+', label: 'Active Learners' },
              { num: '10+', label: 'AI Courses' },
              { num: '85%', label: 'Success Rate' },
              { num: '24/7', label: 'Support' }
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1 font-display">{s.num}</div>
                <div className="text-sm text-white/60 font-medium tracking-wide">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-stone-50 relative overflow-hidden">

        {/* Decorative editorial number */}
        <div className="absolute -right-8 top-12 text-[18rem] font-black text-gray-100 leading-none select-none pointer-events-none font-display">01</div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-amber-400" />
                <span className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase">What We Offer</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6 font-display">
                Everything you need<br />
                <span className="text-amber-500">to grow.</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
                From AI-personalised coursework to hands-on projects and live hackathons —
                GNANAM AI is built to accelerate real career outcomes.
              </p>
              <button
                onClick={handleExploreCourses}
                className="inline-flex items-center gap-2 text-primary font-bold border-b-2 border-amber-400 pb-1 hover:gap-4 transition-all duration-300"
              >
                Browse all courses <FiArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Right — 4 feature blocks */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FiBookOpen className="w-6 h-6" />, title: 'AI Courses', desc: 'Adaptive learning paths', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                { icon: <FiCode className="w-6 h-6" />, title: 'Live Projects', desc: 'Build real applications', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
                { icon: <FiUsers className="w-6 h-6" />, title: 'Hackathons', desc: 'Compete & collaborate', color: 'bg-green-50 text-green-600', border: 'border-green-100' },
                { icon: <FiAward className="w-6 h-6" />, title: 'Certificates', desc: 'Industry-recognised', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ y: -6, shadow: 'xl' }}
                  className={`bg-white border ${f.border} rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-400">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORM FEATURES ─────────────────────────────────────────────── */}
      <section className="py-28 bg-slate-900 relative overflow-hidden">

        {/* Editorial number */}
        <div className="absolute -left-8 top-12 text-[18rem] font-black text-white/5 leading-none select-none pointer-events-none font-display">02</div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-400" />
              <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase">Platform Capabilities</span>
              <div className="h-px w-10 bg-amber-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight font-display">
              Built for serious<br /><span className="text-amber-400">learners.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-3xl overflow-hidden">
            {[
              { icon: <FiTrendingUp className="w-7 h-7" />, title: 'Smart Analytics', desc: 'Track progress with detailed insights and personalised recommendations tailored to your learning style.' },
              { icon: <FiZap className="w-7 h-7" />, title: 'Instant Feedback', desc: 'Get immediate AI-powered analysis on your code, projects, and quiz answers in real time.' },
              { icon: <FiTarget className="w-7 h-7" />, title: 'Goal Tracking', desc: 'Set milestones, monitor streaks, and stay motivated with structured learning goals.' },
              { icon: <FiGlobe className="w-7 h-7" />, title: 'Global Community', desc: 'Connect with learners worldwide, share projects, and collaborate on real-world challenges.' },
              { icon: <FiStar className="w-7 h-7" />, title: 'Expert Mentors', desc: 'Get guidance from industry professionals who have built real products and led real teams.' },
              { icon: <FiShield className="w-7 h-7" />, title: 'Career Boost', desc: 'Our curriculum is built around the skills employers actively seek — practical, not theoretical.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-900 p-8 group hover:bg-slate-800 transition-colors duration-300 cursor-default"
              >
                <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS RIBBON ────────────────────────────────────────────── */}
      <section className="py-8 bg-amber-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-slate-900 font-black text-xl font-display">Ready to start learning today?</p>
          <div className="flex gap-4">
            <button onClick={handleExploreCourses} className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm">
              View Courses
            </button>
            <button onClick={handleExploreProjects} className="bg-white text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-stone-100 transition-colors text-sm">
              See Projects
            </button>
            <button onClick={handleExploreHackathons} className="border-2 border-slate-900 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-sm">
              Hackathons
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="py-28 bg-stone-50 relative overflow-hidden" id="pricing">

        {/* Editorial number */}
        <div className="absolute -right-8 top-12 text-[18rem] font-black text-gray-100 leading-none select-none pointer-events-none font-display">03</div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-400" />
              <span className="text-amber-600 text-xs font-bold tracking-[0.2em] uppercase">Pricing</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight font-display">
                Transparent pricing.<br />
                <span className="text-amber-500">Zero surprises.</span>
              </h2>
              <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                Choose the plan that fits your ambition. Start free, upgrade when you're ready.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col hover:shadow-xl transition-all duration-300 group"
            >
              <div className="mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
                  <FiZap className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Free</h3>
                <p className="text-gray-400 text-sm mb-6">For explorers</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900">Free</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Forever · No card required</p>
              </div>
              <div className="space-y-4 flex-grow mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Courses</p>
                  <div className="space-y-1">
                    {['Python for Beginners', 'Machine Learning'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Projects</p>
                  <div className="space-y-1">
                    {['Todo Application'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Extras</p>
                  <div className="space-y-1">
                    {['Community Forum Access', 'Course Certificates', 'Hackathon Access'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-slate-400" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:border-slate-900 hover:text-slate-900 transition-all duration-300 text-sm"
              >
                Get Free Access
              </button>
            </motion.div>

            {/* Basic — Featured */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-primary rounded-3xl p-8 flex flex-col shadow-2xl shadow-primary/30 relative overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide">Popular</span>
              </div>
              {/* Gold top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />

              <div className="mb-8">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <FiPlay className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-1">Basic</h3>
                <p className="text-white/50 text-sm mb-6">For motivated learners</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-white/60">₹</span>
                  <span className="text-5xl font-black text-white">299</span>
                  <span className="text-lg text-white/40 line-through">₹999</span>
                  <span className="text-xs font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">Save 70%</span>
                </div>
                <p className="text-white/50 text-xs mt-2 font-medium">One-time · No hidden charges</p>
              </div>
              <div className="space-y-4 flex-grow mb-6">
                <div>
                  <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-1.5">Courses</p>
                  <div className="space-y-1">
                    {['Everything in Free plan', 'Deep Learning', 'NLP', 'GenAI'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-white/80 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-1.5">Projects</p>
                  <div className="space-y-1">
                    {['Everything in Free plan', 'Ecommerce Web - Full Stack'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-white/80 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest mb-1.5">Extras</p>
                  <div className="space-y-1">
                    {['Project Certificate', 'Priority Support'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-white/80 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/pricing');
                  } else {
                    navigate('/login', { state: { from: location } });
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-amber-400 text-slate-900 font-black hover:bg-amber-300 transition-all duration-300 text-sm shadow-lg shadow-amber-400/20"
              >
                Get Basic Access
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-8 flex flex-col hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-6 right-6">
                <span className="bg-yellow-400/20 text-yellow-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide border border-yellow-400/30">Best Value</span>
              </div>

              <div className="mb-8">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  <FiAward className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-1">Pro</h3>
                <p className="text-gray-500 text-sm mb-6">For professionals & teams</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-gray-500">₹</span>
                  <span className="text-5xl font-black text-white">799</span>
                  <span className="text-lg text-gray-600 line-through">₹4999</span>
                  <span className="text-xs font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full">Save 66%</span>
                </div>
                <p className="text-gray-500 text-xs mt-2 font-medium">One-time · No hidden charges</p>
              </div>
              <div className="space-y-4 flex-grow mb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Courses</p>
                  <div className="space-y-1">
                    {['Everything in Basic plan', 'RAG', 'AI Agents', 'MCP'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Projects</p>
                  <div className="space-y-1">
                    {['Everything in Basic plan', 'Retail - Single Agent', 'Retail - Multi Agent', 'Travel - MCP'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Extras</p>
                  <div className="space-y-1">
                    {['Mentor Support'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FiCheck className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/pricing');
                  } else {
                    navigate('/login', { state: { from: location } });
                  }
                }}
                className="w-full py-3.5 rounded-xl border-2 border-white/20 text-white font-black hover:bg-white hover:text-slate-900 transition-all duration-300 text-sm"
              >
                Get Pro Access
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-32 bg-primary relative overflow-hidden">
        {/* Gold accent diagonal */}
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 bg-amber-400/60" />
              <span className="text-amber-400/80 text-xs font-bold tracking-[0.25em] uppercase">Start Today</span>
              <div className="h-px w-12 bg-amber-400/60" />
            </div>

            <h2 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6 font-display">
              Your career<br />
              <span className="text-amber-400">starts here.</span>
            </h2>

            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join 1,200+ learners who are building their dream careers with GNANAM AI.
              Free to start, powerful when you're ready to accelerate.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black text-base px-8 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20"
                >
                  Access Dashboard
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="group inline-flex items-center gap-3 bg-amber-400 text-slate-900 font-black text-base px-8 py-4 rounded-xl hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/20"
                >
                  Start Learning — Free
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <button
                onClick={handleExploreCourses}
                className="inline-flex items-center gap-3 bg-white/5 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                Explore Platform
              </button>
            </div>

            {/* Trust note */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/30 text-sm">
              <span className="flex items-center gap-2"><FiShield className="w-4 h-4" /> No credit card required</span>
              <span className="flex items-center gap-2"><FiCheck className="w-4 h-4" /> Free plan forever</span>
              <span className="flex items-center gap-2"><FiStar className="w-4 h-4" /> Industry-recognised certificates</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage