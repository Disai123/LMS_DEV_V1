import { Link } from 'react-router-dom'

/**
 * Dual brand strip: GNANAM AI (left) + SANKALP LMS (right), matching partner-logo layout.
 */
const BrandLogos = ({
  className = '',
  logoClassName = 'h-10 sm:h-14 w-auto object-contain',
  layout = 'horizontal',
  brand = 'both',
  linkToHome = true,
}) => {
  const gnanam = (
    <img
      src="/gnanamai-logo.svg"
      alt="GNANAM AI"
      className={logoClassName}
      style={{ maxHeight: '100%' }}
    />
  )

  const sankalp = (
    <img
      src="/sankalp-logo.svg"
      alt="SANKALP LMS"
      className={logoClassName}
      style={{ maxHeight: '100%' }}
    />
  )

  const wrap = (child) =>
    linkToHome ? (
      <Link to="/" className="flex items-center overflow-visible shrink-0">
        {child}
      </Link>
    ) : (
      <div className="flex items-center shrink-0">{child}</div>
    )

  if (brand === 'gnanam') {
    return <div className={className}>{wrap(gnanam)}</div>
  }

  if (brand === 'sankalp') {
    return <div className={className}>{wrap(sankalp)}</div>
  }

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        {wrap(gnanam)}
        {wrap(sankalp)}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-3 sm:gap-5 ${className}`}>
      {wrap(gnanam)}
      <div className="hidden sm:block w-px h-8 sm:h-10 bg-gray-300/80 shrink-0" aria-hidden="true" />
      {wrap(sankalp)}
    </div>
  )
}

export default BrandLogos
