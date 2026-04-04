import { motion } from 'framer-motion'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { certificateService } from '../services/certificateService'
import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const CertificatesPage = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [activeTab, setActiveTab] = useState('course') // 'course' or 'realtime_project'

  // Fetch student's certificates
  const { data: certificatesData, isLoading, error } = useQuery(
    'my-certificates',
    () => certificateService.getMyCertificates(),
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        console.error('Certificates API error:', error)
      }
    }
  )

  const certificates = certificatesData?.data?.certificates || []

  const handleViewCertificate = async (certificate) => {
    try {
      setSelectedCertificate(certificate)
      setShowCertificateModal(true)
    } catch (error) {
      console.error('Error viewing certificate:', error)
      toast.error('Failed to load certificate details')
    }
  }

  const handleDownloadCertificate = async (certificate) => {
    let downloadContainer = null
    try {
      const response = await certificateService.downloadCertificate(certificate.id)
      const certificateData = response.data.certificate

      const isProject = (certificateData.certificate_type || certificateData.certificateType) === 'realtime_project' || certificateData.metadata?.certificateType === 'realtime_project'
      const studentName = certificateData.metadata?.studentName || certificateData.studentName || 'Student'
      const certTitle = isProject ? 'CERTIFICATE OF ACHIEVEMENT' : 'CERTIFICATE OF COMPLETION'
      const certSubText = isProject
        ? 'has successfully built and delivered the realtime project'
        : 'has successfully completed the course'
      const mainName = isProject
        ? (certificateData.metadata?.projectName || 'Realtime Project')
        : (() => {
          const cn = certificateData.metadata?.courseName || certificateData.course?.title || 'Course'
          const dur = certificateData.metadata?.courseDuration || certificateData.course?.estimated_duration || null
          return dur ? `${cn} (${dur} Hrs)` : cn
        })()
      const score = !isProject ? certificateData.metadata?.score : null
      const difficulty = isProject ? certificateData.metadata?.difficulty : null
      const certificateNumber = certificateData.certificate_number
      const verificationCode = certificateData.verification_code
      const issuedDate = new Date(certificateData.issued_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const logoUrl = `${window.location.origin}/lms_logo.svg`

      downloadContainer = document.createElement('div')
      downloadContainer.style.position = 'fixed'
      downloadContainer.style.top = '0'
      downloadContainer.style.left = '0'
      downloadContainer.style.width = '1200px'
      downloadContainer.style.height = '850px'
      downloadContainer.style.pointerEvents = 'none'
      downloadContainer.style.opacity = '0'
      downloadContainer.style.zIndex = '-1'
      
      const themeColor = isProject ? '#1e3a8a' : '#0f172a' // Professional Deep Blue/Slate
      const accentColor = '#6366f1' // Modern Indigo

      downloadContainer.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700&family=Alex+Brush&display=swap');
          
          .certificate-container {
            width: 1200px;
            height: 850px;
            background: #fff;
            padding: 0;
            box-sizing: border-box;
            position: relative;
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            box-shadow: 0 0 50px rgba(0,0,0,0.1);
            border: 20px solid #f8fafc;
            overflow: hidden;
          }

          .accent-strip {
             position: absolute;
             top: 0;
             left: 0;
             width: 12px;
             height: 100%;
             background: linear-gradient(to bottom, ${themeColor}, ${accentColor});
          }

          .inner-content {
            padding: 80px 100px;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .header-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 60px;
          }

          .logo-box { text-align: left; }
          .logo { height: 50px; }
          
          .cert-status {
            text-align: right;
            font-size: 10px;
            letter-spacing: 3px;
            text-transform: uppercase;
            font-weight: 800;
            color: #94a3b8;
          }

          .main-title {
            font-size: 58px;
            font-weight: 900;
            color: ${themeColor};
            letter-spacing: -1.5px;
            margin-bottom: 10px;
            text-transform: uppercase;
            line-height: 1;
            text-align: center;
          }

          .sub-title {
            font-size: 18px;
            letter-spacing: 8px;
            color: ${accentColor};
            font-weight: 600;
            margin-bottom: 50px;
            text-transform: uppercase;
            text-align: center;
          }

          .recipient-section { margin: 20px 0 40px; text-align: center; }
          .certify-text { font-size: 16px; color: #64748b; margin-bottom: 15px; font-weight: 500; }
          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 68px;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
            line-height: 1.2;
          }
          
          .divider {
            width: 120px;
            height: 4px;
            background: ${accentColor};
            margin: 25px auto;
            border-radius: 2px;
          }

          .attainment-description {
            font-size: 18px;
            color: #475569;
            line-height: 1.6;
            max-width: 750px;
            margin: 0 auto 30px;
            text-align: center;
            font-weight: 400;
          }

          .course-title {
            font-size: 32px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 40px;
            text-align: center;
          }

          .stats-grid {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin-bottom: 60px;
            background: #f8fafc;
            padding: 20px 40px;
            border-radius: 12px;
          }

          .stat-box { display: flex; flex-direction: column; align-items: center; }
          .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 4px; font-weight: 700; }
          .stat-val { font-size: 18px; font-weight: 800; color: #0f172a; }

          .footer-section {
            margin-top: auto;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }

          .signature-area { display: flex; gap: 80px; }
          .signature-box { display: flex; flex-direction: column; align-items: center; min-width: 180px; }
          .sign-img { font-family: 'Alex Brush', cursive; font-size: 36px; margin-bottom: 0px; color: #0f172a; }
          .sign-line { width: 100%; height: 1.5px; background: #e2e8f0; margin-bottom: 8px; }
          .sign-role { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }

          .verified-badge {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          }

          .badge-icon {
            width: 36px;
            height: 36px;
            background: ${themeColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 18px;
          }

          .badge-text { text-align: left; }
          .badge-status { font-size: 10px; font-weight: 800; color: #10b981; margin-bottom: 1px; }
          .badge-number { font-size: 9px; font-weight: 600; color: #94a3b8; font-family: monospace; }

        </style>
        <div class="certificate-container">
          <div class="accent-strip"></div>
          <div class="inner-content">
            <div class="header-row">
              <div class="logo-box">
                <img src="${logoUrl}" class="logo" />
              </div>
              <div class="cert-status">
                OFFICIAL VERIFIED CERTIFICATION<br/>
                ISSUED BY GNANAM AI ACADEMY
              </div>
            </div>

            <h1 class="main-title">${certTitle.split(' ').slice(0, 2).join(' ')}</h1>
            <h2 class="sub-title">${certTitle.split(' ').slice(2).join(' ')}</h2>

            <div class="recipient-section">
              <p class="certify-text">This certificate confirms that</p>
              <h3 class="student-name">${studentName}</h3>
              <div class="divider"></div>
            </div>

            <p class="attainment-description">${certSubText}</p>
            <h4 class="course-title">${mainName}</h4>

            <div class="stats-grid">
              ${difficulty ? `
                <div class="stat-box">
                  <span class="stat-label">Project Difficulty</span>
                  <span class="stat-val">${difficulty}</span>
                </div>
              ` : ''}
              ${score ? `
                <div class="stat-box">
                  <span class="stat-label">Performance Score</span>
                  <span class="stat-val">${Math.round(score)}%</span>
                </div>
              ` : ''}
              <div class="stat-box">
                  <span class="stat-label">Completion Date</span>
                  <span class="stat-val">${issuedDate}</span>
              </div>
            </div>

            <div class="footer-section">
              <div class="verified-badge">
                <div class="badge-icon">✓</div>
                <div class="badge-text">
                  <div class="badge-status">VALIDATED CERTIFICATE</div>
                  <div class="badge-number">ID: ${certificateNumber}</div>
                </div>
              </div>

              <div class="signature-area">
                <div class="signature-box">
                  <span class="sign-img">Vijay Gunti</span>
                  <div class="sign-line"></div>
                  <span class="sign-role">Education Director</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `

      document.body.appendChild(downloadContainer)

      const templateElement = downloadContainer.querySelector('.certificate-container')
      if (!templateElement) {
        throw new Error('Certificate template not found')
      }

      await new Promise((resolve) => setTimeout(resolve, 500)) 

      const canvas = await html2canvas(templateElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'pt', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Calculate the correct aspect ratio to fit the page
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgY = (pdfHeight - imgHeight) / 2

      pdf.addImage(imgData, 'PNG', 0, imgY, imgWidth, imgHeight)

      const safeStudentName = studentName.replace(/\s+/g, '_')
      const safeMainName = mainName.replace(/\s+/g, '_').substring(0, 40)
      const prefix = isProject ? 'Project_Certificate' : 'Course_Certificate'
      const fileName = `${safeStudentName}_${prefix}_${safeMainName}.pdf`
      pdf.save(fileName)

      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate. Please try again.')
    } finally {
      if (downloadContainer && document.body.contains(downloadContainer)) {
        document.body.removeChild(downloadContainer)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Certificates</h1>
            <p className="text-gray-600 mb-6">
              {error.message?.includes('401')
                ? 'Authentication required. Please log in to view your certificates.'
                : 'Unable to load certificates. Please try again later.'
              }
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Certificates</h1>
              <p className="text-lg text-gray-600">
                Manage and view your earned certifications
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-white shadow-sm self-start">
              <button
                onClick={() => setActiveTab('course')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'course'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600'
                  }`}
              >
                Course Certs
              </button>
              <button
                onClick={() => setActiveTab('realtime_project')}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'realtime_project'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                  }`}
              >
                Project Certs
              </button>
            </div>
          </div>
        </motion.div>

        {(() => {
          const filteredCerts = certificates.filter(c => (c.certificate_type || c.certificateType) === activeTab)

          if (filteredCerts.length === 0) {
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/50"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${activeTab === 'course' ? 'bg-indigo-50 text-indigo-400' : 'bg-purple-50 text-purple-400'}`}>
                  {activeTab === 'course' ? (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No {activeTab === 'course' ? 'Course' : 'Project'} Certificates</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {activeTab === 'course'
                    ? "Complete courses and pass tests to earn certificates. Each certificate is unique and verifiable."
                    : "Deliver high-quality projects and get them approved to earn project certificates."
                  }
                </p>
                <button
                  onClick={() => window.location.href = activeTab === 'course' ? '/student' : '/realtime-projects'}
                  className={`px-8 py-3 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${activeTab === 'course' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                  {activeTab === 'course' ? 'Browse Courses' : 'Browse Projects'}
                </button>
              </motion.div>
            )
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCerts.map((certificate, index) => {
                const isProject = (certificate.certificate_type || certificate.certificateType) === 'realtime_project'
                const title = isProject
                  ? (certificate.metadata?.projectName || certificate.realtimeProjectSubmission?.project_name || 'Project Certificate')
                  : (certificate.metadata?.courseName || 'Course Certificate')
                return (
                  <motion.div
                    key={certificate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isProject ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                          {isProject ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${isProject ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {isProject ? '🚀 Project' : 'Course'}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {title}
                      </h3>

                      {isProject && certificate.metadata?.difficulty && (
                        <div className="flex gap-2 items-center mb-2">
                          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 capitalize border border-indigo-100">
                            {certificate.metadata.difficulty}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-purple-600">
                            ID: {certificate.id}
                          </span>
                        </div>
                      )}

                      <p className="text-gray-500 mb-4 text-sm">
                        Earned on {formatDate(certificate.issued_date)}
                      </p>

                      {!isProject && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Performance Record</span>
                            <span className="font-semibold text-indigo-600">{Math.round(certificate.metadata.score || 0)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${certificate.metadata.score || 0}%` }}
                              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                      )}

                      {isProject && certificate.metadata?.pointsAwarded > 0 && (
                        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                          <span className="text-lg">🏆</span>
                          <span className="text-sm font-bold text-purple-700">
                            {certificate.metadata.pointsAwarded} Credits Earned
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewCertificate(certificate)}
                          className={`w-full py-2.5 text-white rounded-lg transition-all duration-300 text-sm font-bold shadow-sm hover:shadow-md ${isProject ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                          View Preview
                        </button>
                        <button
                          onClick={() => handleDownloadCertificate(certificate)}
                          className="w-full py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-bold"
                        >
                          Download Official PDF
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCertificateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Certificate Preview</h3>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative bg-white shadow-2xl overflow-hidden text-center" style={{ minHeight: '750px', padding: '0' }}>
              <div className="absolute top-0 left-0 w-3 h-full" style={{ background: `linear-gradient(to bottom, ${(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project' ? '#1e3a8a' : '#0f172a'}, #6366f1)` }}></div>
              
              <div className="inner-content p-16 h-full w-full flex flex-col items-center">
                {/* Header Row */}
                <div className="w-full flex justify-between items-start mb-12">
                  <div className="text-left">
                    <img src="/lms_logo.svg" alt="GNANAM AI" className="h-10 w-auto" />
                  </div>
                  <div className="text-right text-[8px] tracking-[2px] font-extrabold text-slate-400 uppercase leading-relaxed">
                    OFFICIAL VERIFIED CERTIFICATION<br/>
                    ISSUED BY GNANAM AI ACADEMY
                  </div>
                </div>

                {/* Title */}
                <div className="mb-10">
                  <h1 className="text-5xl font-black tracking-tighter uppercase mb-1" style={{ fontFamily: "'Inter', sans-serif", color: (selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project' ? '#1e3a8a' : '#0f172a' }}>
                    {(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project' ? 'CERTIFICATE OF' : 'CERTIFICATE OF'}
                  </h1>
                  <h2 className="text-lg font-bold tracking-[6px] uppercase text-indigo-500">
                    {(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project' ? 'ACHIEVEMENT' : 'COMPLETION'}
                  </h2>
                </div>

                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">This certificate confirms that</p>
                
                <h3 className="text-6xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedCertificate.metadata?.studentName || selectedCertificate.studentName || 'Learner Name'}
                </h3>
                
                <div className="w-24 h-1 bg-indigo-500 mx-auto mb-8 rounded-full"></div>

                <p className="text-lg text-slate-600 mb-2 max-w-2xl">
                  {(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project'
                    ? 'has successfully built and delivered the high-impact realtime project'
                    : 'has successfully completed the comprehensive training course'
                  }
                </p>

                <h4 className="text-3xl font-extrabold text-slate-800 mb-10">
                  {(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project'
                    ? (selectedCertificate.metadata?.projectName || selectedCertificate.realtimeProjectSubmission?.project_name || 'Realtime Project')
                    : (() => {
                        const courseName = selectedCertificate.metadata?.courseName || 'Course'
                        const courseDuration = selectedCertificate.metadata?.courseDuration || selectedCertificate.course?.estimated_duration
                        return courseDuration ? `${courseName} (${courseDuration} Hrs)` : courseName
                      })()
                  }
                </h4>

                <div className="flex gap-12 mb-12 bg-slate-50 px-8 py-4 rounded-xl border border-slate-100">
                  {(selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project' && selectedCertificate.metadata?.difficulty && (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Project Level</span>
                      <span className="text-base font-black text-slate-700 uppercase">{selectedCertificate.metadata.difficulty}</span>
                    </div>
                  )}
                  {(selectedCertificate.certificate_type || selectedCertificate.certificateType) !== 'realtime_project' && selectedCertificate.metadata?.score && (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Performance Score</span>
                      <span className="text-base font-black text-slate-700">{Math.round(selectedCertificate.metadata.score)}%</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1">Completion Date</span>
                    <span className="text-base font-black text-slate-700">{formatDate(selectedCertificate.issued_date)}</span>
                  </div>
                </div>

                <div className="w-full flex justify-between items-end mt-4">
                  <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl">✓</div>
                    <div className="text-left">
                      <div className="text-[9px] font-black text-emerald-500 uppercase leading-none mb-1">VALIDATED CERTIFICATE</div>
                      <div className="text-[8px] font-bold text-slate-400 font-mono">ID: {selectedCertificate.certificate_number}</div>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className="flex flex-col items-center min-w-[200px]">
                      <span className="text-3xl mb-0 text-slate-900" style={{ fontFamily: "'Alex Brush', cursive" }}>Vijay Gunti</span>
                      <div className="w-full h-[1px] bg-slate-200 mb-2"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Education Director</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  )
}

export default CertificatesPage
