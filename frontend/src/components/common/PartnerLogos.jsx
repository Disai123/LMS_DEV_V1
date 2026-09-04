import { getOrderedPartners } from '../../config/partners'

const PartnerLogos = ({
  variant = 'compact',
  showLabels = false,
  className = '',
  logoClassName = '',
}) => {
  const partners = getOrderedPartners()
  const isCompact = variant === 'compact'

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      {!isCompact && (
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 w-full sm:w-auto">
          In collaboration with
        </span>
      )}
      {isCompact && (
        <span className="hidden lg:inline text-xs text-gray-500 whitespace-nowrap">
          In collaboration with
        </span>
      )}
      {partners.map((partner) => (
        <div
          key={partner.key}
          className="flex items-center gap-1.5"
          title={`${partner.name} — ${partner.role}`}
        >
          <div
            className={`flex items-center justify-center rounded-md bg-white/90 border border-gray-100 px-1.5 py-0.5 ${
              isCompact ? 'h-8 min-w-[2.5rem]' : 'h-12 min-w-[3.5rem]'
            }`}
          >
            <img
              src={partner.logo}
              alt={partner.alt}
              className={`object-contain w-auto max-w-[5rem] ${
                isCompact ? 'max-h-6' : 'max-h-10'
              } ${logoClassName}`}
            />
          </div>
          {showLabels && (
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-800 leading-tight">{partner.shortName}</p>
              <p className="text-[10px] text-gray-500 leading-tight">{partner.role}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PartnerLogos
