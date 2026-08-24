import { Link } from 'react-router-dom'

/**
 * SANKALP LMS branding
 */
const BrandLogos = ({
  className = '',
  logoClassName = 'h-10 sm:h-14 w-auto object-contain',
  linkToHome = true,
}) => {
  const logo = (
    <img
      src="/sankalp-logo.svg"
      alt="SANKALP LMS"
      className={logoClassName}
      style={{ maxHeight: '100%' }}
    />
  )

  if (linkToHome) {
    return (
      <div className={className}>
        <Link to="/" className="flex items-center overflow-visible shrink-0">
          {logo}
        </Link>
      </div>
    )
  }

  return (
    <div className={`flex items-center shrink-0 ${className}`}>
      {logo}
    </div>
  )
}

export default BrandLogos
