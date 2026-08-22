/**
 * URL Analyzer utility for detecting different content types
 */

const URL_TYPES = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  GOOGLE_DRIVE: 'google_drive',
  DROPBOX: 'dropbox',
  ONEDRIVE: 'onedrive',
  EXTERNAL: 'external',
  UNKNOWN: 'unknown'
}

/**
 * Analyzes a URL to determine its type and extract relevant information
 * @param {string} url - The URL to analyze
 * @returns {Object} Analysis result with type, embedUrl, thumbnail, etc.
 */
const analyzeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      type: URL_TYPES.UNKNOWN,
      isValid: false,
      error: 'Invalid URL provided'
    }
  }

  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    const pathname = urlObj.pathname

    // YouTube detection
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return analyzeYouTubeUrl(url, urlObj)
    }

    // Vimeo detection
    if (hostname.includes('vimeo.com')) {
      return analyzeVimeoUrl(url, urlObj)
    }

    // Google Drive detection
    if (hostname.includes('drive.google.com')) {
      return analyzeGoogleDriveUrl(url, urlObj)
    }

    // Dropbox detection
    if (hostname.includes('dropbox.com')) {
      return analyzeDropboxUrl(url, urlObj)
    }

    // OneDrive detection
    if (hostname.includes('onedrive.live.com') || hostname.includes('1drv.ms')) {
      return analyzeOneDriveUrl(url, urlObj)
    }

    // Generic external URL - accept any valid URL
    return {
      type: URL_TYPES.EXTERNAL,
      isValid: true,
      originalUrl: url,
      embedUrl: url,
      thumbnail: null,
      title: null,
      description: 'External content',
      supportsEmbedding: false
    }

  } catch (error) {
    return {
      type: URL_TYPES.UNKNOWN,
      isValid: false,
      error: 'Invalid URL format'
    }
  }
}

/**
 * Analyzes YouTube URLs
 */
const analyzeYouTubeUrl = (url, urlObj) => {
  let videoId = null
  let embedUrl = null

  if (urlObj.hostname.includes('youtu.be')) {
    // Short YouTube URL format: https://youtu.be/VIDEO_ID
    videoId = urlObj.pathname.substring(1)
  } else if (urlObj.hostname.includes('youtube.com')) {
    // Long YouTube URL format: https://www.youtube.com/watch?v=VIDEO_ID
    videoId = urlObj.searchParams.get('v')
  }

  if (videoId) {
    embedUrl = `https://www.youtube.com/embed/${videoId}`
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    
    return {
      type: URL_TYPES.YOUTUBE,
      isValid: true,
      originalUrl: url,
      embedUrl,
      videoId,
      thumbnail,
      title: null, // Could be fetched from YouTube API if needed
      description: 'YouTube video content',
      supportsEmbedding: true
    }
  }

  return {
    type: URL_TYPES.UNKNOWN,
    isValid: false,
    error: 'Could not extract YouTube video ID'
  }
}

/**
 * Analyzes Vimeo URLs
 */
const analyzeVimeoUrl = (url, urlObj) => {
  const videoId = urlObj.pathname.substring(1)
  
  if (videoId && /^\d+$/.test(videoId)) {
    const embedUrl = `https://player.vimeo.com/video/${videoId}`
    
    return {
      type: URL_TYPES.VIMEO,
      isValid: true,
      originalUrl: url,
      embedUrl,
      videoId,
      thumbnail: null, // Could be fetched from Vimeo API if needed
      title: null,
      description: 'Vimeo video content',
      supportsEmbedding: true
    }
  }

  return {
    type: URL_TYPES.UNKNOWN,
    isValid: false,
    error: 'Could not extract Vimeo video ID'
  }
}

/**
 * Analyzes Google Drive URLs
 */
const analyzeGoogleDriveUrl = (url, urlObj) => {
  let fileId = urlObj.searchParams.get('id')
  
  // If no ID in query params, try to extract from path
  if (!fileId) {
    // Try multiple patterns for Google Drive URLs
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/FILE_ID/
      /\/file\/d\/([a-zA-Z0-9_-]+)\/view/,     // /file/d/FILE_ID/view
      /\/file\/d\/([a-zA-Z0-9_-]+)\/edit/,     // /file/d/FILE_ID/edit
      /\/open\?id=([a-zA-Z0-9_-]+)/,           // /open?id=FILE_ID
      /\/drive\/folders\/([a-zA-Z0-9_-]+)/,    // /drive/folders/FOLDER_ID
    ]
    
    for (const pattern of patterns) {
      const match = urlObj.pathname.match(pattern)
      if (match) {
        fileId = match[1]
        break
      }
    }
    
    // Also check the full URL for patterns that might not be in pathname
    if (!fileId) {
      const fullUrlPatterns = [
        /\/d\/([a-zA-Z0-9_-]+)\//,             // /d/FILE_ID/
        /id=([a-zA-Z0-9_-]+)/,                 // id=FILE_ID
      ]
      
      for (const pattern of fullUrlPatterns) {
        const match = url.match(pattern)
        if (match) {
          fileId = match[1]
          break
        }
      }
    }
  }
  
  if (fileId) {
    // For Google Drive files, use preview format for embedding (works with public sharing)
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
    
    return {
      type: URL_TYPES.GOOGLE_DRIVE,
      isValid: true,
      originalUrl: url,
      embedUrl,
      downloadUrl,
      viewUrl,
      fileId,
      thumbnail: null,
      title: null,
      description: 'Google Drive content',
      supportsEmbedding: true
    }
  }

  return {
    type: URL_TYPES.UNKNOWN,
    isValid: false,
    error: 'Could not extract Google Drive file ID'
  }
}

/**
 * Analyzes Dropbox URLs
 */
const analyzeDropboxUrl = (url, urlObj) => {
  // Dropbox URLs are typically for file sharing, not direct video embedding
  return {
    type: URL_TYPES.DROPBOX,
    isValid: true,
    originalUrl: url,
    embedUrl: url, // Dropbox doesn't support direct embedding for videos
    thumbnail: null,
    title: null,
    description: 'Dropbox content - may require download',
    supportsEmbedding: false
  }
}

/**
 * Analyzes OneDrive URLs
 */
const analyzeOneDriveUrl = (url, urlObj) => {
  // OneDrive URLs can be converted to embed format
  const embedUrl = url.replace('/view', '/embed')
  
  return {
    type: URL_TYPES.ONEDRIVE,
    isValid: true,
    originalUrl: url,
    embedUrl,
    thumbnail: null,
    title: null,
    description: 'OneDrive content',
    supportsEmbedding: true
  }
}

/**
 * Gets a user-friendly display name for URL types
 */
const getUrlTypeDisplayName = (type) => {
  const displayNames = {
    [URL_TYPES.YOUTUBE]: 'YouTube Video',
    [URL_TYPES.VIMEO]: 'Vimeo Video',
    [URL_TYPES.GOOGLE_DRIVE]: 'Google Drive',
    [URL_TYPES.DROPBOX]: 'Dropbox',
    [URL_TYPES.ONEDRIVE]: 'OneDrive',
    [URL_TYPES.EXTERNAL]: 'External Link',
    [URL_TYPES.UNKNOWN]: 'Unknown'
  }
  
  return displayNames[type] || 'Unknown'
}

/**
 * Checks if a URL type supports embedding
 */
const supportsEmbedding = (type) => {
  return [
    URL_TYPES.YOUTUBE,
    URL_TYPES.VIMEO,
    URL_TYPES.GOOGLE_DRIVE,
    URL_TYPES.ONEDRIVE
  ].includes(type)
}

module.exports = {
  URL_TYPES,
  analyzeUrl,
  getUrlTypeDisplayName,
  supportsEmbedding
}
