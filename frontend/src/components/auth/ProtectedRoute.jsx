import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the user's appropriate dashboard based on their role
    const dashboardRoutes = {
      student: '/dashboard',
      hr: '/hr/dashboard',
      admin: '/admin'
    }
    const redirectTo = dashboardRoutes[user.role] || '/'
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default ProtectedRoute
