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
      
      const themeColor = '#29384d' // Navy Blue
      const goldColor = '#c5a059' // Gold

      const certHtmlContent = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700&family=Alex+Brush&display=swap');
          
          .certificate-container { /* keep class name for html2canvas query */
            width: 1200px;
            height: 850px;
            background: #fff;
            padding: 40px;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
            margin: 0;
            overflow: hidden;
          }
          
          .navy-border {
            border: 20px solid ${themeColor};
            height: 100%;
            padding: 8px;
            box-sizing: border-box;
            position: relative;
          }

          .gold-border {
            border: 2px solid ${goldColor};
            height: 100%;
            box-sizing: border-box;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 60px 30px 60px;
          }

          .corner-ornament {
            position: absolute;
            width: 40px;
            height: 40px;
            fill: ${goldColor};
          }
          .tl { top: -20px; left: -20px; }
          .tr { top: -20px; right: -20px; transform: rotate(90deg); }
          .bl { bottom: -20px; left: -20px; transform: rotate(-90deg); }
          .br { bottom: -20px; right: -20px; transform: rotate(180deg); }

          .logos-area {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          
          .logo { height: 45px; }

          .stars {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 20px;
          }
          
          .star { fill: ${goldColor}; }
          .star.small { width: 20px; height: 20px; }
          .star.med { width: 28px; height: 28px; margin-top: -10px; }
          .star.large { width: 38px; height: 38px; margin-top: -20px; }

          .main-title {
            font-size: 46px;
            font-weight: 900;
            color: ${themeColor};
            text-align: center;
            line-height: 1.2;
            margin: 0 0 15px 0;
            letter-spacing: 1px;
            text-transform: uppercase;
          }

          .certify-label {
            font-size: 16px;
            font-weight: 700;
            color: ${goldColor};
            letter-spacing: 4px;
            margin: 0 0 15px 0;
            text-transform: uppercase;
          }

          .student-name {
            font-family: 'Playfair Display', serif;
            font-size: 56px;
            font-weight: 700;
            color: ${themeColor};
            margin: 0 0 15px 0;
          }

          .gold-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            margin-bottom: 25px;
          }
          .gold-line {
            height: 2px;
            background: ${goldColor};
            width: 300px;
            margin: 0 15px;
          }
          .gold-diamond {
            width: 8px;
            height: 8px;
            background: #fff;
            border: 2px solid ${goldColor};
            transform: rotate(45deg);
          }

          .description {
            font-size: 18px;
            color: #475569;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 20px;
            max-width: 800px;
          }

          .cert-id {
            font-size: 18px;
            font-weight: 700;
            color: ${goldColor};
            margin-bottom: auto;
          }
          .cert-id span {
            color: ${themeColor};
          }

          .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            padding: 0 20px;
          }

          .footer-box {
            text-align: center;
            width: 220px;
          }

          .date-val {
            font-size: 20px;
            font-weight: 700;
            color: ${themeColor};
            margin-bottom: 5px;
            height: 38px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }
          
          .sign-val {
            font-family: 'Alex Brush', cursive;
            font-size: 38px;
            font-weight: 400;
            color: ${themeColor};
            margin-bottom: 0px;
            line-height: 1;
            height: 38px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .footer-line {
            width: 100%;
            height: 2px;
            background: ${goldColor};
            margin-bottom: 8px;
          }

          .footer-label {
            font-size: 14px;
            font-weight: 700;
            color: ${themeColor};
            line-height: 1.4;
          }

          .footer-label span.gold {
            color: ${goldColor};
          }
          
          .seal {
            width: 110px;
            height: 110px;
            margin: 0 20px;
          }

        </style>
        <div class="certificate-container">
          <div class="navy-border">
            <svg class="corner-ornament tl" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
            <svg class="corner-ornament tr" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
            <svg class="corner-ornament bl" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
            <svg class="corner-ornament br" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
            
            <div class="gold-border">
              <div class="logos-area">
                <img src="${logoUrl}" class="logo" />
              </div>
              
              <div class="stars">
                <svg class="star small" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg class="star med" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg class="star large" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg class="star med" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <svg class="star small" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>

              <h1 class="main-title">${isProject ? 'Project Completion Certificate' : 'Course Completion Certificate'}</h1>
              <h2 class="certify-label">THIS IS TO CERTIFY THAT</h2>
              <h3 class="student-name">${studentName}</h3>
              
              <div class="gold-divider">
                <div class="gold-diamond"></div>
                <div class="gold-line"></div>
                <div class="gold-diamond"></div>
              </div>

              <p class="description">
                has completed the ${isProject ? 'Realtime Project' : 'Course'} 
                <strong>${mainName}</strong>. 
                <br/>
                ${score ? `Completed with a performance score of <strong>${Math.round(score)}%</strong>.` : ''}
                ${difficulty ? `Project Difficulty Level: <strong>${difficulty}</strong>.` : ''}
                <br/>
                Throughout this program, the learner has successfully learned the concepts and demonstrated a high level of efficiency in applying them practically.
              </p>

              <div class="cert-id">Certificate ID: <span>${certificateNumber}</span></div>

              <div class="footer">
                <div class="footer-box">
                  <div class="date-val">${issuedDate}</div>
                  <div class="footer-line"></div>
                  <div class="footer-label">Date of Issue</div>
                </div>

                <svg class="seal" viewBox="0 0 100 100">
                  <path fill="${goldColor}" d="M50 0 L55 10 L66 6 L68 17 L79 17 L78 28 L88 32 L84 42 L94 50 L84 58 L88 68 L78 72 L79 83 L68 83 L66 94 L55 90 L50 100 L45 90 L34 94 L32 83 L21 83 L22 72 L12 68 L16 58 L6 50 L16 42 L12 32 L22 28 L21 17 L32 17 L34 6 L45 10 Z" />
                  <circle cx="50" cy="50" r="38" fill="#fff" stroke="${themeColor}" stroke-width="2"/>
                  <circle cx="50" cy="50" r="34" fill="none" stroke="${goldColor}" stroke-width="1" stroke-dasharray="2,2"/>
                  <path fill="${goldColor}" d="M50 25 L56 38 L70 40 L60 50 L63 65 L50 58 L37 65 L40 50 L30 40 L44 38 Z" />
                  <text x="50" y="24" font-size="6" font-family="Arial" fill="${themeColor}" font-weight="bold" text-anchor="middle" letter-spacing="1">GNANAM AI</text>
                  <text x="50" y="80" font-size="6" font-family="Arial" fill="${themeColor}" font-weight="bold" text-anchor="middle" letter-spacing="1">CERTIFIED</text>
                </svg>
                
                <div class="footer-box">
                  <div class="sign-val">Vijay Gunti</div>
                  <div class="footer-line"></div>
                  <div class="footer-label">Vijay Gunti<br/><span class="gold">Founder & CEO<br/>Gnanamai</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      `

      downloadContainer.innerHTML = certHtmlContent


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

            {/* Automatically scales the 1200x850 rigid HTML safely into the modal */}
            <div className="w-full flex justify-center bg-gray-100 p-2 md:p-6 rounded-xl overflow-x-auto">
              <div style={{ width: '780px', height: '552px', position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: '1200px',
                    height: '850px',
                    transform: 'scale(0.65)',
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                  }}
                  dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      .cert-preview-window .certificate-container { margin: 0; box-shadow: none; border: none; }
                    </style>
                    <div class="cert-preview-window">
                    ${(() => {
                        const isProject = (selectedCertificate.certificate_type || selectedCertificate.certificateType) === 'realtime_project'
                        const studentName = selectedCertificate.metadata?.studentName || selectedCertificate.studentName || 'Learner Name'
                        const certTitle = isProject ? 'Project Completion Certificate' : 'Course Completion Certificate'
                        const mainName = isProject
                          ? (selectedCertificate.metadata?.projectName || selectedCertificate.realtimeProjectSubmission?.project_name || 'Realtime Project')
                          : (() => {
                            const cn = selectedCertificate.metadata?.courseName || selectedCertificate.course?.title || 'Course'
                            const dur = selectedCertificate.metadata?.courseDuration || selectedCertificate.course?.estimated_duration || null
                            return dur ? `${cn} (${dur} Hrs)` : cn
                          })()
                        const score = !isProject ? selectedCertificate.metadata?.score : null
                        const difficulty = isProject ? selectedCertificate.metadata?.difficulty : null
                        const certificateNumber = selectedCertificate.certificate_number
                        const issuedDate = formatDate(selectedCertificate.issued_date)
                        const themeColor = '#29384d' // Navy Blue
                        const goldColor = '#c5a059' // Gold
                        const logoUrl = '/lms_logo.svg'

                        return `
                          <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700&family=Alex+Brush&display=swap');
                            .cert-inner { width: 1200px; height: 850px; background: #fff; padding: 40px; box-sizing: border-box; font-family: 'Inter', sans-serif; }
                            .cert-inner .navy-border { border: 20px solid ${themeColor}; height: 100%; padding: 8px; box-sizing: border-box; position: relative; }
                            .cert-inner .gold-border { border: 2px solid ${goldColor}; height: 100%; box-sizing: border-box; position: relative; display: flex; flex-direction: column; align-items: center; padding: 40px 60px 30px 60px; }
                            .cert-inner .corner-ornament { position: absolute; width: 40px; height: 40px; fill: ${goldColor}; }
                            .cert-inner .tl { top: -20px; left: -20px; } .cert-inner .tr { top: -20px; right: -20px; transform: rotate(90deg); } .cert-inner .bl { bottom: -20px; left: -20px; transform: rotate(-90deg); } .cert-inner .br { bottom: -20px; right: -20px; transform: rotate(180deg); }
                            .cert-inner .logos-area { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }
                            .cert-inner .logo { height: 45px; }
                            .cert-inner .stars { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
                            .cert-inner .star { fill: ${goldColor}; } .cert-inner .star.small { width: 20px; height: 20px; } .cert-inner .star.med { width: 28px; height: 28px; margin-top: -10px; } .cert-inner .star.large { width: 38px; height: 38px; margin-top: -20px; }
                            .cert-inner .main-title { font-size: 46px; font-weight: 900; color: ${themeColor}; text-align: center; line-height: 1.2; margin: 0 0 15px 0; letter-spacing: 1px; text-transform: uppercase; }
                            .cert-inner .certify-label { font-size: 16px; font-weight: 700; color: ${goldColor}; letter-spacing: 4px; margin: 0 0 15px 0; text-transform: uppercase; }
                            .cert-inner .student-name { font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 700; color: ${themeColor}; margin: 0 0 15px 0; }
                            .cert-inner .gold-divider { display: flex; align-items: center; justify-content: center; width: 100%; margin-bottom: 25px; }
                            .cert-inner .gold-line { height: 2px; background: ${goldColor}; width: 300px; margin: 0 15px; }
                            .cert-inner .gold-diamond { width: 8px; height: 8px; background: #fff; border: 2px solid ${goldColor}; transform: rotate(45deg); }
                            .cert-inner .description { font-size: 18px; color: #475569; text-align: center; line-height: 1.6; margin-bottom: 20px; max-width: 800px; }
                            .cert-inner .cert-id { font-size: 18px; font-weight: 700; color: ${goldColor}; margin-bottom: auto; }
                            .cert-inner .cert-id span { color: ${themeColor}; }
                            .cert-inner .footer { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding: 0 20px; }
                            .cert-inner .footer-box { text-align: center; width: 220px; }
                            .cert-inner .date-val { font-size: 20px; font-weight: 700; color: ${themeColor}; margin-bottom: 5px; height: 38px; display: flex; align-items: flex-end; justify-content: center; }
                            .cert-inner .sign-val { font-family: 'Alex Brush', cursive; font-size: 38px; font-weight: 400; color: ${themeColor}; margin-bottom: 0px; line-height: 1; height: 38px; display: flex; align-items: flex-end; justify-content: center; }
                            .cert-inner .footer-line { width: 100%; height: 2px; background: ${goldColor}; margin-bottom: 8px; }
                            .cert-inner .footer-label { font-size: 14px; font-weight: 700; color: ${themeColor}; line-height: 1.4; }
                            .cert-inner .footer-label span.gold { color: ${goldColor}; }
                            .cert-inner .seal { width: 110px; height: 110px; margin: 0 20px; }
                          </style>
                          <div class="cert-inner">
                            <div class="navy-border">
                              <svg class="corner-ornament tl" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
                              <svg class="corner-ornament tr" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
                              <svg class="corner-ornament bl" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
                              <svg class="corner-ornament br" viewBox="0 0 100 100"><path d="M0,0 L100,0 C100,55 55,100 0,100 Z" /></svg>
                              
                              <div class="gold-border">
                                <div class="logos-area"><img src="${logoUrl}" class="logo" /></div>
                                <div class="stars">
                                  <svg class="star small" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  <svg class="star med" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  <svg class="star large" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  <svg class="star med" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  <svg class="star small" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <h1 class="main-title">${certTitle}</h1>
                                <h2 class="certify-label">THIS IS TO CERTIFY THAT</h2>
                                <h3 class="student-name">${studentName}</h3>
                                <div class="gold-divider"><div class="gold-diamond"></div><div class="gold-line"></div><div class="gold-diamond"></div></div>
                                <p class="description">
                                  has completed the ${isProject ? 'Realtime Project' : 'Course'} <strong>${mainName}</strong>. <br/>
                                  ${score ? `Completed with a performance score of <strong>${Math.round(score)}%</strong>.` : ''}
                                  ${difficulty ? `Project Difficulty Level: <strong>${difficulty}</strong>.` : ''}
                                  <br/>Throughout this program, the learner has successfully learned the concepts and demonstrated a high level of efficiency in applying them practically.
                                </p>
                                <div class="cert-id">Certificate ID: <span>${certificateNumber}</span></div>
                                <div class="footer">
                                  <div class="footer-box"><div class="date-val">${issuedDate}</div><div class="footer-line"></div><div class="footer-label">Date of Issue</div></div>
                                  <svg class="seal" viewBox="0 0 100 100">
                                    <path fill="${goldColor}" d="M50 0 L55 10 L66 6 L68 17 L79 17 L78 28 L88 32 L84 42 L94 50 L84 58 L88 68 L78 72 L79 83 L68 83 L66 94 L55 90 L50 100 L45 90 L34 94 L32 83 L21 83 L22 72 L12 68 L16 58 L6 50 L16 42 L12 32 L22 28 L21 17 L32 17 L34 6 L45 10 Z" />
                                    <circle cx="50" cy="50" r="38" fill="#fff" stroke="${themeColor}" stroke-width="2"/>
                                    <circle cx="50" cy="50" r="34" fill="none" stroke="${goldColor}" stroke-width="1" stroke-dasharray="2,2"/>
                                    <path fill="${goldColor}" d="M50 25 L56 38 L70 40 L60 50 L63 65 L50 58 L37 65 L40 50 L30 40 L44 38 Z" />
                                    <text x="50" y="24" font-size="6" font-family="Arial" fill="${themeColor}" font-weight="bold" text-anchor="middle" letter-spacing="1">GNANAM AI</text>
                                    <text x="50" y="80" font-size="6" font-family="Arial" fill="${themeColor}" font-weight="bold" text-anchor="middle" letter-spacing="1">CERTIFIED</text>
                                  </svg>
                                  <div class="footer-box"><div class="sign-val">Vijay Gunti</div><div class="footer-line"></div><div class="footer-label">Vijay Gunti<br/><span class="gold">Founder & CEO<br/>Gnanamai</span></div></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        `
                    })()}
                    </div>
                  `
                }}
              ></div>
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
