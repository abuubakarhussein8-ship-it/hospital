import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const normalizeRole = (role) => (role ? String(role).toUpperCase() : '')

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0) {
    const normalizedUserRole = normalizeRole(user.role)
    const allowed = allowedRoles.some((role) => normalizeRole(role) === normalizedUserRole)

    if (!allowed) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
