import { useState, useEffect } from 'react'
import { analyzeUrl, getUrlTypeDisplayName, supportsEmbedding, URL_TYPES } from '../../utils/urlAnalyzer'
import { FiPlay, FiAlertCircle } from 'react-icons/fi'

const VideoPlayer = ({ 
  url,
  embedUrl,
  title = 'Video Content', 
  className = '',
  autoplay = false
}) => {
  const [urlAnalysis, setUrlAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const playbackUrl = url || embedUrl

  useEffect(() => {
    if (!playbackUrl) {
      setError('No URL provided')
      setIsLoading(false)
      return
    }

    const analysis = analyzeUrl(playbackUrl)
    if (embedUrl) {
      analysis.isValid = true
      analysis.embedUrl = embedUrl
      if (!supportsEmbedding(analysis.type) && analysis.type === URL_TYPES.UNKNOWN) {
        analysis.type = URL_TYPES.YOUTUBE
      }
    }
    if (analysis.type === 'youtube' && analysis.embedUrl) {
      analysis.embedUrl = analysis.embedUrl.replace('www.youtube.com', 'www.youtube-nocookie.com')
      analysis.embedUrl += analysis.embedUrl.includes('?') ? '&rel=0&modestbranding=1' : '?rel=0&modestbranding=1'
    }
    setUrlAnalysis(analysis)
    setIsLoading(false)

    if (!analysis.isValid) {
      setError(analysis.error || 'Invalid URL')
    }
  }, [playbackUrl, embedUrl, url])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !urlAnalysis?.isValid) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Unable to load video</h3>
            <p className="text-sm text-red-600 mt-1">
              {error || urlAnalysis?.error || 'Invalid video URL'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderVideoContent = () => {
    const canEmbed = supportsEmbedding(urlAnalysis.type) || Boolean(embedUrl && urlAnalysis.embedUrl)

    if (canEmbed) {
      return (
        <div
          className="relative w-full bg-black rounded-lg overflow-hidden select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="aspect-video w-full">
            <iframe
              src={urlAnalysis.embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
        <div className="mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiPlay className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">
            {getUrlTypeDisplayName(urlAnalysis.type)} content — view in platform only
          </p>
        </div>
        <p className="text-sm text-gray-500">This video type cannot be embedded. Contact your instructor.</p>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {renderVideoContent()}
    </div>
  )
}

export default VideoPlayer
