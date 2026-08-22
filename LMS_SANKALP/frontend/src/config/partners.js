export const PARTNERS = {
  college: {
    key: 'college',
    name: 'Rishi Engineering College',
    shortName: 'Rishi Engineering College',
    role: 'Academic Partner',
    logo: '/partners/rishi-engineering-college-logo.png',
    alt: 'Rishi Engineering College logo',
    description:
      'Where students enroll and begin their learning journey with GNANAM AI.',
  },
  institution: {
    key: 'institution',
    name: 'DiGiNexes',
    shortName: 'DiGiNexes',
    role: 'Institution Partner',
    logo: '/partners/diginexes-logo.png',
    alt: 'DiGiNexes logo',
    description:
      'Institution partner powering structured digital learning programs.',
  },
}

/** Fixed order: Rishi left, DiGiNexes right */
export const PARTNER_LOGO_ORDER = ['college', 'institution']

export const getOrderedPartners = () =>
  PARTNER_LOGO_ORDER.map((key) => PARTNERS[key])
