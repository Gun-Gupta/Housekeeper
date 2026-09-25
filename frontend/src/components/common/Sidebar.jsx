import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MdDashboard, MdAssignment, MdPayment, MdPerson,
  MdGroup, MdPeople, MdBarChart, MdAttachMoney,
  MdLogout, MdHome, MdSearch
} from 'react-icons/md'

const workerLinks = [
  { to: '/worker/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
  { to: '/worker/leads',     icon: <MdAssignment />, label: 'Lead Requests' },
  { to: '/worker/profile',   icon: <MdPerson />,     label: 'My Profile' },
]

const clientLinks = [
  { to: '/client/dashboard', icon: <MdDashboard />,  label: 'Dashboard' },
  { to: '/client/workers',   icon: <MdSearch />,     label: 'Find Workers' },
  { to: '/client/requests',  icon: <MdAssignment />, label: 'My Requests' },
  { to: '/client/profile',   icon: <MdPerson />,     label: 'My Profile' },
]

const adminLinks = [
  { to: '/admin/dashboard', icon: <MdDashboard />,     label: 'Dashboard' },
  { to: '/admin/workers',   icon: <MdGroup />,         label: 'Workers' },
  { to: '/admin/clients',   icon: <MdPeople />,        label: 'Clients' },
  { to: '/admin/leads',     icon: <MdBarChart />,      label: 'Leads' },
  { to: '/admin/revenue',   icon: <MdAttachMoney />,   label: 'Revenue' },
]

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = role === 'worker' ? workerLinks : role === 'client' ? clientLinks : adminLinks

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const roleColors = { worker: '#6C63FF', client: '#FF6584', admin: '#43D9A2' }
  const roleLabels = { worker: 'Worker Portal', client: 'Client Portal', admin: 'Admin Panel' }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ color: roleColors[role] || 'var(--primary)' }}>House</span>Keeper
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 400, marginTop: 2 }}>
          {roleLabels[role]}
        </div>
      </div>

      {user && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          {user.profile && user.profile !== 'default' ? (
            <img src={user.profile} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${roleColors[role] || 'var(--primary)'}, #FF6584)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1rem', color: '#fff'
            }}>
              {(user.fullname || user.fullName || user.name || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.fullname || user.fullName || user.name || 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{user.phone || user.email}</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
                <span className="nav-icon">{l.icon}</span>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius)', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 6 }}>
          <MdHome /> Home
        </NavLink>
        <button onClick={handleLogout} className="btn btn-secondary btn-full" style={{ justifyContent: 'flex-start', gap: 10 }}>
          <MdLogout /> Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
