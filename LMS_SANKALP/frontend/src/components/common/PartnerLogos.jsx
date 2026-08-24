import { getOrderedPartners } from '../../config/partners'

const VARIANT_STYLES = {
  compact: {
    container: 'gap-2 sm:gap-3',
    item: 'gap-1.5',
    box: 'h-8 min-w-[2.5rem] px-1.5 py-0.5 rounded-md',
    image: 'max-h-6 max-w-[5rem]',
    name: 'text-xs',
    role: 'text-[10px]',
    showInlineHeading: true,
  },
  featured: {
    container: 'gap-8 sm:gap-12 lg:gap-16',
    item: 'gap-4 sm:gap-5',
    box: 'h-20 sm:h-24 lg:h-28 min-w-[10rem] sm:min-w-[12rem] px-4 sm:px-6 py-3 rounded-xl shadow-md shadow-indigo-100 border-indigo-100',
    image: 'max-h-16 sm:max-h-20 lg:max-h-24 max-w-[14rem] sm:max-w-[16rem]',
    name: 'text-sm sm:text-base font-semibold text-indigo-900',
    role: 'text-xs sm:text-sm text-indigo-600/80',
    showInlineHeading: false,
  },
  default: {
    container: 'gap-4 sm:gap-6',
    item: 'gap-2 sm:gap-3',
    box: 'h-12 min-w-[3.5rem] px-2 py-1 rounded-lg',
    image: 'max-h-10 max-w-[8rem]',
    name: 'text-xs sm:text-sm font-medium',
    role: 'text-[10px] sm:text-xs',
    showInlineHeading: true,
  },
}

const PartnerLogos = ({
  variant = 'compact',
  showLabels = false,
  className = '',
  logoClassName = '',
}) => {
  const partners = getOrderedPartners()
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default
  const isFeatured = variant === 'featured'

  return (
    <div className={`flex flex-wrap items-center justify-center ${styles.container} ${className}`}>
      {styles.showInlineHeading && (
        <span
          className={`font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap ${
            variant === 'compact' ? 'hidden lg:inline text-xs' : 'text-xs w-full sm:w-auto text-center sm:text-left'
          }`}
        >
          In collaboration with
        </span>
      )}

      {partners.map((partner) => (
        <div
          key={partner.key}
          className={`flex flex-col sm:flex-row items-center ${styles.item}`}
          title={`${partner.name} — ${partner.role}`}
        >
          <div
            className={`flex items-center justify-center bg-white border ${styles.box}`}
          >
            <img
              src={partner.logo}
              alt={partner.alt}
              className={`object-contain w-auto ${styles.image} ${logoClassName}`}
            />
          </div>
          {showLabels && (
            <div className={`text-center sm:text-left ${isFeatured ? 'max-w-[14rem]' : ''}`}>
              <p className={`text-gray-900 leading-tight ${styles.name}`}>{partner.shortName}</p>
              <p className={`text-gray-500 leading-tight mt-0.5 ${styles.role}`}>{partner.role}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PartnerLogos
