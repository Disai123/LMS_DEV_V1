import { Link } from 'react-router-dom'
import PartnerLogos from './PartnerLogos'

const AuthBrandHeader = ({ logoClassName = 'h-12 w-auto', dark = false }) => {
  return (
    <div className="text-center mb-6">
      <Link to="/" className="inline-flex items-center justify-center mb-4">
        <img src="/lms_logo.svg" alt="GNANAM AI" className={logoClassName} />
      </Link>
      <div className={`flex justify-center ${dark ? 'opacity-90' : ''}`}>
        <PartnerLogos variant="compact" className="justify-center" />
      </div>
    </div>
  )
}

export default AuthBrandHeader
