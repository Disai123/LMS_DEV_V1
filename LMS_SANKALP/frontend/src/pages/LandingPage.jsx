import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiBookOpen, FiCheckCircle, FiAward, FiLayers,
  FiArrowRight, FiTrendingUp
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'

const FEATURES = [
  {
    title: 'Structured courses',
    text: 'Browse catalogues of video lessons and learning materials, organized chapter by chapter.',
    icon: FiBookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
  },
  {
    title: 'Assessments & tests',
    text: 'Validate your knowledge with course tests after completing the learning path.',
    icon: FiCheckCircle,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
  },
  {
    title: 'Certificates',
    text: 'Earn verifiable completion certificates when you pass your course assessments.',
    icon: FiAward,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
]

const STEPS = [
  { step: '01', title: 'Sign in', text: 'Create an account or log in to your dashboard.', color: 'from-indigo-500 to-violet-600' },
  { step: '02', title: 'Learn', text: 'Enroll in courses and progress through chapters at your pace.', color: 'from-violet-500 to-purple-600' },
  { step: '03', title: 'Certify', text: 'Pass assessments and download your course certificate.', color: 'from-amber-500 to-orange-500' },
]

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate(isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/student') : '/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-amber-50/80" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(251,191,36,0.12) 0%, transparent 45%)',
            }}
          />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute top-2/3 -left-40 w-80 h-80 rounded-full bg-indigo-400/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-300/30 mb-6">
                  <FiLayers className="w-3.5 h-3.5" />
                  Learning Management System
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-slate-900 leading-[1.12] mb-6">
                  Learn. Grow.{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                    Get certified.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl leading-relaxed">
                  A complete LMS for students and institutions — browse courses, track progress,
                  take assessments, and earn certificates—all in one place.
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-xl shadow-indigo-400/30 hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Login'}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-indigo-200 bg-white/90 text-indigo-700 font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
                  >
                    Browse Courses
                  </Link>
                </div>

                <div className="flex flex-wrap gap-6 sm:gap-10">
                  {[
                    { icon: FiBookOpen, label: 'Course catalog' },
                    { icon: FiTrendingUp, label: 'Progress tracking' },
                    { icon: FiAward, label: 'Certificates' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-slate-600">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="relative lg:pl-4"
              >
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-amber-400/30 blur-2xl" />

                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-400/25 ring-1 ring-white/80">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80"
                    alt="Students in a learning environment"
                    className="w-full h-72 sm:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 via-indigo-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-white/90 text-sm font-medium mb-1">Built for learners & educators</p>
                    <p className="text-white text-xl sm:text-2xl font-bold">Your digital campus, online.</p>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="absolute -bottom-5 -left-2 sm:-left-6 bg-white rounded-2xl shadow-2xl border border-indigo-100 px-5 py-4 hidden sm:flex items-center gap-3 max-w-[240px]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0">
                    <FiLayers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Online Courses</p>
                    <p className="text-xs text-indigo-600 font-medium">Chapters · Tests · Certificates</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                  className="absolute -top-3 -right-2 sm:-right-4 bg-white rounded-2xl shadow-xl border border-emerald-100 px-4 py-3 hidden sm:flex items-center gap-2"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FiAward className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Certified</p>
                    <p className="text-[10px] text-emerald-600">On course completion</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-16 sm:py-20 bg-white border-y border-indigo-100/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-2">How it works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Simple learning journey</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {STEPS.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white font-black text-lg items-center justify-center mb-5 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-indigo-300 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600 mb-2">Platform features</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Everything you need to learn well
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              From enrollment to certification — a full learning management experience for every course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-7 shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
