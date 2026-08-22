import useCourseLogo from '../../hooks/useCourseLogo'

const CourseLogo = ({ course, className = "w-6 h-6 rounded object-cover" }) => {
  const { logoUrl, loading: logoLoading, error: logoError } = useCourseLogo(course.id, !!course.logo)

  if (!course.logo) return null

  if (logoLoading) {
    return (
      <div className={`${className} bg-gray-600 animate-pulse flex items-center justify-center`}>
        <span className="text-xs text-white">...</span>
      </div>
    )
  }

  if (logoError) {
    return (
      <div className={`${className} bg-gray-600 flex items-center justify-center`}>
        <span className="text-xs text-white" title={`Logo error: ${logoError}`}>!</span>
      </div>
    )
  }

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${course.title} logo`}
        className={className}
      />
    )
  }

  return null
}

export default CourseLogo
