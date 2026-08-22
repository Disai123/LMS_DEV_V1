import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiExternalLink, FiFile, FiAlertCircle, FiLoader } from 'react-icons/fi'

const DirectPDFViewer = ({ 
  pdfUrl, 
  title = 'PDF Document', 
  className = '',
  showControls = true 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    if (!pdfUrl) {
      setError('No PDF URL provided')
      setIsLoading(false)
      return
    }

    // Try to load the PDF directly
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = `${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`
    
    iframe.onload = () => {
      setIsLoading(false)
      setError(null)
      document.body.removeChild(iframe)
    }
    
    iframe.onerror = () => {
      document.body.removeChild(iframe)
      setIsLoading(false)
      setShowFallback(true)
    }
    
    document.body.appendChild(iframe)
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
        setIsLoading(false)
        setShowFallback(true)
      }
    }, 10000)
  }, [pdfUrl])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = title || 'document.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Unable to load PDF</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (showFallback) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      >
        {/* PDF Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiFile className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            </div>
            
            {showControls && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleOpenInNewTab}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <FiExternalLink className="w-3 h-3 mr-1" />
                  Open
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  <FiDownload className="w-3 h-3 mr-1" />
                  Download
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PDF Content - Try to embed anyway */}
        <div className="relative w-full" style={{ height: '600px' }}>
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            title={title}
            className="w-full h-full border-0"
            frameBorder="0"
            onError={() => {
              // If iframe fails, show the fallback content
              setShowFallback(true)
            }}
          />
          
          {/* Fallback overlay - only show if iframe completely fails */}
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFile className="w-10 h-10 text-blue-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Document</h4>
              <p className="text-sm text-gray-600 mb-6 max-w-md">
                This PDF cannot be embedded directly due to browser restrictions. 
                Use the buttons above to view or download the document.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleOpenInNewTab}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                >
                  <FiExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            PDF document • Use buttons above to access
          </p>
        </div>
      </motion.div>
    )
  }

  // If PDF loads successfully, show it directly
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {/* PDF Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FiFile className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Loaded Successfully
            </span>
          </div>
          
          {showControls && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenInNewTab}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                <FiExternalLink className="w-3 h-3 mr-1" />
                Open
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                <FiDownload className="w-3 h-3 mr-1" />
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PDF Embed */}
      <div className="relative w-full" style={{ height: '600px' }}>
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          title={title}
          className="w-full h-full border-0"
          frameBorder="0"
        />
      </div>

      {/* PDF Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          PDF document loaded successfully
        </p>
      </div>
    </motion.div>
  )
}

export default DirectPDFViewer
