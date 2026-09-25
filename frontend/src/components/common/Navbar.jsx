import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { token, role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const dashboardLink = () => {
    if (role === 'worker') return '/worker/dashboard'
    if (role === 'client') return '/client/dashboard'
    if (role === 'admin')  return '/admin/dashboard'
    return '/'
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span>House</span>Keeper
      </Link>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="navbar-actions">
        {token ? (
          <>
            <Link to={dashboardLink()} className="btn btn-secondary btn-sm">Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-primary btn-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/worker/login" className="btn btn-secondary btn-sm">Worker Login</Link>
            <Link to="/client/login" className="btn btn-primary btn-sm">Client Login</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
