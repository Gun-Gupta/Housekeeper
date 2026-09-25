import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getAllLeads, getAllWorkers } from '../../api/api'
import { MdGroup, MdAssignment, MdCheckCircle, MdPending, MdArrowForward } from 'react-icons/md'

const ClientDashboard = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [workerCount, setWorkerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllLeads(), getAllWorkers()])
      .then(([lr, wr]) => {
        setLeads(lr.data.leads || [])
        setWorkerCount((wr.data.workers || wr.data || []).length)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const myLeads = leads.filter(l => l.createdBy?._id === user?.id || l.createdBy === user?.id)
  const pending  = myLeads.filter(l => l.status === 'new' || l.status === 'payment_pending').length
  const accepted = myLeads.filter(l => l.status === 'assigned').length
  const completed = myLeads.filter(l => l.status === 'completed').length

  const stats = [
    { icon: <MdGroup />,       label: 'Available Workers', value: workerCount, color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
    { icon: <MdPending />,     label: 'Pending Requests',  value: pending,     color: '#FFB347', bg: 'rgba(255,179,71,0.15)' },
    { icon: <MdAssignment />,  label: 'Accepted',          value: accepted,    color: '#43D9A2', bg: 'rgba(67,217,162,0.15)' },
    { icon: <MdCheckCircle />, label: 'Completed',         value: completed,   color: '#FF6584', bg: 'rgba(255,101,132,0.15)' },
  ]

  return (
    <DashboardLayout role="client">
      <div className="page-header">
        <h1>Welcome, <span className="gradient-text">{user?.fullname || 'Client'}</span> 🏠</h1>
        <p>Find trusted workers and manage your home service requests</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <Link to="/client/workers" className="card" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <h3>Find a Worker</h3>
          <p style={{ marginTop: 6 }}>Browse verified workers by category</p>
          <div className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Browse Workers <MdArrowForward />
          </div>
        </Link>
        <Link to="/client/requests" className="card" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
          <h3>My Requests</h3>
          <p style={{ marginTop: 6 }}>Track your pending and accepted requests</p>
          <div className="btn btn-outline" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            View Requests <MdArrowForward />
          </div>
        </Link>
      </div>

      {/* Recent requests */}
      {myLeads.length > 0 && (
        <div className="card">
          <div className="flex-between mb-4">
            <h3>Recent Requests</h3>
            <Link to="/client/requests" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Category</th><th>Address</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {myLeads.slice(0, 5).map(l => (
                  <tr key={l._id}>
                    <td><span className="badge badge-primary">{l.serviceCategory}</span></td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{l.address}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${l.status === 'assigned' ? 'badge-success' : l.status === 'completed' ? 'badge-primary' : 'badge-warning'}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ClientDashboard
