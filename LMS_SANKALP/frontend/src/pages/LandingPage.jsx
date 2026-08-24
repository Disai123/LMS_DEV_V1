import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBookOpen, FiCheckCircle, FiAward } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import PartnerLogos from '../components/common/PartnerLogos'

const FEATURES = [
  {
    title: 'Structured chapters',
    text: 'Video lessons and materials organized step by step.',
    icon: FiBookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-100',
  },
  {
    title: 'Course assessment',
    text: 'Complete the test after finishing all chapters.',
    icon: FiCheckCircle,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
  },
  {
    title: 'Certificate',
    text: 'Pass the test and download your completion certificate.',
    icon: FiAward,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-amber-50" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-72 h-72 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 mb-5">
                  SANKALP Learning Platform
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-tight mb-5">
                  Learn{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-amber-500 bg-clip-text text-transparent">
                    Python
                  </span>
                  . Earn your certificate.
                </h1>

                <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
                  A focused course experience — watch chapters, complete assessments, and receive
                  your certificate when you pass the test.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Login'}
                  </button>
                  <Link
                    to="/courses"
                    className="px-8 py-3.5 rounded-xl border-2 border-indigo-200 bg-white/80 text-indigo-700 font-semibold hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                  >
                    Browse Course
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="relative"
              >
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-indigo-400 via-violet-400 to-amber-400 opacity-20 blur-xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-300/30 ring-2 ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                    alt="Student learning online"
                    className="w-full h-64 sm:h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl border border-indigo-100 px-5 py-3.5 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      Py
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Python Course</p>
                      <p className="text-xs text-indigo-600 font-medium">Chapters · Tests · Certificate</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="relative bg-gradient-to-r from-slate-100 via-indigo-50/80 to-amber-50/60 border-y border-indigo-100/60 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm sm:text-base font-semibold text-indigo-700/80 mb-8 sm:mb-10">
              In collaboration with
            </p>
            <PartnerLogos variant="featured" showLabels />
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Everything you need to finish strong
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              One course, clear steps — from your first chapter to your certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-6 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-4 shadow-md`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16 sm:pb-20 px-4">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl shadow-indigo-300/25">
            <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-6 sm:px-12 py-12 sm:py-14 text-center">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to start?</h2>
                <p className="text-indigo-100 mb-8 max-w-md mx-auto">
                  Sign in to access the Python course and track your progress.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="px-10 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-amber-50 transition-colors shadow-lg"
                >
                  {isAuthenticated ? 'Continue Learning' : 'Login to SANKALP'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
