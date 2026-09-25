import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="spinner-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!token) {
    const redirectMap = {
      worker: '/worker/login',
      client: '/client/login',
      admin:  '/admin/login',
    }
    return <Navigate to={redirectMap[allowedRole] || '/worker/login'} replace />
  }

  if (allowedRole && role !== allowedRole) {
    const dashMap = {
      worker: '/worker/dashboard',
      client: '/client/dashboard',
      admin:  '/admin/dashboard',
    }
    return <Navigate to={dashMap[role] || '/'} replace />
  }

  return children
}

export default ProtectedRoute
