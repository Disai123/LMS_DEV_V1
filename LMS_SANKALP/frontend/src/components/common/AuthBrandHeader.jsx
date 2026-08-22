import { Link } from 'react-router-dom'
import BrandLogos from './BrandLogos'

const AuthBrandHeader = ({ logoClassName = 'h-12 w-auto' }) => {
  return (
    <div className="text-center mb-6">
      <BrandLogos
        layout="stacked"
        logoClassName={logoClassName}
        className="justify-center mb-2"
      />
    </div>
  )
}

export default AuthBrandHeader
