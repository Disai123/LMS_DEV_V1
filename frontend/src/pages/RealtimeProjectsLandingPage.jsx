import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import api from '../services/api'

const RealtimeProjectsLandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await api.get('/realtime-projects/public')

        if (response.data.success && response.data.data) {
          // Map backend data to frontend format
          const mappedProjects = response.data.data.map((project, index) => ({
            id: project.id || index + 1,
            title: project.name,
            description: project.description,
            shortDescription: project.description?.substring(0, 100) + '...',
            difficulty: project.difficulty || 'Intermediate',
            duration: `${project.estimatedHours || 40} hours`,
            phases: 5,
            icon: getProjectIcon(project.name),
            image: getProjectImage(project.name),
            gradient: getProjectGradient(index),
            glowColor: getProjectGlowColor(index),
            technologies: project.tags || [],
            category: project.category || 'Web Development',
            order: project.order !== undefined ? project.order : 999
          }))
            .sort((a, b) => a.order - b.order)

          setProjects(mappedProjects)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err.message)
        // Use fallback projects if API fails
        setProjects(getFallbackProjects())
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Helper function to get project icon based on name
  const getProjectIcon = (name) => {
    const nameLower = name.toLowerCase()
    if (nameLower.includes('mobile')) return '📱'
    if (nameLower.includes('ai') || nameLower.includes('agent')) return '🤖'
    if (nameLower.includes('multi')) return '🤖'
    if (nameLower.includes('ecommerce') || nameLower.includes('web')) return '🛒'
    return '💻'
  }

  // Helper function to get project image based on name
  const getProjectImage = (name) => {
    const nameLower = name.toLowerCase()
    if (nameLower.includes('mobile')) {
      return '/images/projects/ecommerce-mobile.png'
    }
    if (nameLower.includes('multi')) {
      return '/images/projects/ecommerce-multi-agent.png'
    }
    if (nameLower.includes('ai') || nameLower.includes('agent')) {
      return '/images/projects/ecommerce-ai-agent.png'
    }
    if (nameLower.includes('ecommerce') || nameLower.includes('web')) {
      return '/images/projects/ecommerce-web.png'
    }
    return '/images/projects/ecommerce-web.png'
  }

  // Helper function to get gradient based on index
  const getProjectGradient = (index) => {
    const gradients = [
      'from-emerald-400 via-teal-500 to-cyan-600',
      'from-violet-400 via-purple-500 to-fuchsia-600',
      'from-blue-400 via-indigo-500 to-purple-600',
      'from-pink-400 via-rose-500 to-red-600'
    ]
    return gradients[index % gradients.length]
  }

  // Helper function to get glow color based on index
  const getProjectGlowColor = (index) => {
    const colors = ['emerald', 'purple', 'blue', 'pink']
    return colors[index % colors.length]
  }

  // Fallback projects if API fails
  const getFallbackProjects = () => [
    {
      id: 1,
      title: 'E-Commerce Web Application',
      description: 'Build a complete, production-ready e-commerce platform from scratch. Learn full-stack development with React, Node.js, and PostgreSQL through hands-on experience.',
      shortDescription: 'Full-stack e-commerce platform with modern technologies',
      difficulty: 'Intermediate',
      duration: '40 hours',
      phases: 5,
      icon: '🛒',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      glowColor: 'emerald',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Tailwind CSS'],
      phasesList: [
        'Business Requirements Document (BRD)',
        'UI/UX Design & Prototyping',
        'Full-Stack Development',
        'Testing & Quality Assurance',
        'Deployment & Launch'
      ],
      highlights: [
        'User authentication & authorization',
        'Product catalog & search',
        'Shopping cart & checkout',
        'Payment integration',
        'Admin dashboard'
      ]
    },
    {
      id: 2,
      title: 'E-Commerce AI Agent',
      description: 'Extend your e-commerce platform with an intelligent AI shopping assistant. Learn to integrate AI/ML capabilities, natural language processing, and create conversational interfaces.',
      shortDescription: 'AI-powered shopping assistant extension',
      difficulty: 'Advanced',
      duration: '30 hours',
      phases: 5,
      icon: '🤖',
      gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
      glowColor: 'purple',
      technologies: ['Python', 'LangChain', 'OpenAI API', 'FastAPI', 'React'],
      phasesList: [
        'AI Agent Architecture Design',
        'Natural Language Processing Setup',
        'Agent Development & Training',
        'Frontend Integration',
        'Testing & Optimization'
      ],
      highlights: [
        'Conversational shopping assistant',
        'Product recommendations',
        'Natural language search',
        'Order tracking via chat',
        'Personalized suggestions'
      ],
      isExtension: true,
      extensionOf: 'E-Commerce Web Application'
    },
    {
      id: 3,
      title: 'E-Commerce Mobile Application',
      description: 'Transform your e-commerce platform into a native mobile experience. Learn React Native, mobile UI/UX patterns, and build a cross-platform mobile app with offline capabilities.',
      shortDescription: 'Native mobile app for iOS and Android',
      difficulty: 'Intermediate',
      duration: '35 hours',
      phases: 5,
      icon: '📱',
      gradient: 'from-blue-400 via-indigo-500 to-purple-600',
      glowColor: 'blue',
      technologies: ['React Native', 'Expo', 'AsyncStorage', 'Push Notifications', 'Mobile UI'],
      phasesList: [
        'Mobile App Architecture',
        'UI/UX Design for Mobile',
        'Core Features Development',
        'Offline Capabilities',
        'Testing & Deployment'
      ],
      highlights: [
        'Cross-platform mobile app',
        'Offline mode support',
        'Push notifications',
        'Mobile payment integration',
        'Biometric authentication'
      ],
      isExtension: true,
      extensionOf: 'E-Commerce Web Application'
    },
    {
      id: 4,
      title: 'E-Commerce Multi-Agent System',
      description: 'Build an advanced multi-agent AI system for e-commerce. Learn agent orchestration, task delegation, and create a sophisticated AI team that handles customer service, inventory, and analytics.',
      shortDescription: 'Advanced multi-agent AI orchestration system',
      difficulty: 'Advanced',
      duration: '45 hours',
      phases: 5,
      icon: '🤖',
      gradient: 'from-pink-400 via-rose-500 to-red-600',
      glowColor: 'pink',
      technologies: ['LangGraph', 'Python', 'Multi-Agent Systems', 'FastAPI', 'Redis'],
      phasesList: [
        'Multi-Agent Architecture Design',
        'Agent Development & Specialization',
        'Agent Orchestration & Communication',
        'Integration & Testing',
        'Deployment & Monitoring'
      ],
      highlights: [
        'Customer service agent',
        'Inventory management agent',
        'Analytics & insights agent',
        'Agent coordination system',
        'Real-time decision making'
      ],
      isExtension: true,
      extensionOf: 'E-Commerce AI Agent'
    }
  ]

  const handleProjectClick = (projectId) => {
    // Store intended destination
    localStorage.setItem('redirectAfterLogin', '/student/realtime-projects')
    navigate('/login')
  }

  const handleGetStarted = () => {
    localStorage.setItem('redirectAfterLogin', '/student/realtime-projects')
    navigate('/login')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Main Title */}
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Build Real{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Projects
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center justify-center space-x-4 mb-8"
              >
                <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                <span className="text-2xl">⚡</span>
                <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </motion.div>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Learn by Doing • Master Real-World Skills • Build Your Portfolio
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>Start Learning</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Featured{' '}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Start with our comprehensive e-commerce projects and learn full-stack development with AI integration
            </p>
          </motion.div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Gradient Border Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-3xl blur opacity-0 group-hover:opacity-75 transition duration-500`}></div>

                {/* Card Content */}
                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 transform group-hover:scale-[1.02] transition duration-500">
                  {/* Extension Badge */}
                  {project.isExtension && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Extension Project
                      </span>
                    </div>
                  )}

                  {/* Project Image */}
                  <div className="flex items-start gap-6 mb-6">
                    <div className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition duration-500">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-600">
                        {project.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className={`px-3 py-1 bg-gradient-to-r ${project.gradient} text-white rounded-full text-sm font-bold shadow-lg`}>
                      {project.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                      {project.duration}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
                      {project.phases} Phases
                    </span>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Technologies You'll Master
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-lg font-medium border border-gray-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      What You'll Build
                    </h4>
                    <div className="space-y-2">
                      {project.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center text-gray-700">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${project.gradient} rounded-full mr-3`}></div>
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProjectClick(project.id)}
                    className={`w-full py-4 bg-gradient-to-r ${project.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg`}
                  >
                    🚀 Start This Project
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* More Projects Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <div className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-indigo-100 overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99 102 241) 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>

              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">

                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">

                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">

                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">

                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-gray-700 font-bold text-sm shadow-lg">
                      +5
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  More Projects Available
                </h3>

                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Unlock access to <span className="font-bold text-indigo-600">5+ additional projects</span> including Mobile Apps, Blockchain, Social Media, IoT, and more
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <span> View All Projects</span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform"></span>
                  </span>
                </motion.button>

                <p className="text-sm text-gray-500 mt-4">
                  Sign in to access all projects
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Learn By Doing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Why{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Learn by Doing
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hands-on projects that teach you real-world skills through practical experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Real-World Projects',
                description: 'Build actual applications that you can showcase in your portfolio and use in job interviews.',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '⚡',
                title: 'Hands-On Learning',
                description: 'Stop watching tutorials. Start building. Learn by doing with step-by-step guidance.',
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: '🏆',
                title: 'Industry Standards',
                description: 'Follow best practices and industry standards used by top tech companies worldwide.',
                gradient: 'from-green-500 to-teal-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Animated gradient border */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500`}></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 shadow-xl transform group-hover:-translate-y-2 transition duration-500">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl mb-6"
                  >
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 overflow-hidden"
          >

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Start Building
                </span>
                ?
              </h2>

              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
                Join thousands of students learning by doing. Build real projects, master real skills.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl shadow-white/20 hover:shadow-white/40 transition-all duration-300"
              >
                <span className="flex items-center gap-3">
                  <span>🚀 Start Your Journey</span>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default RealtimeProjectsLandingPage
