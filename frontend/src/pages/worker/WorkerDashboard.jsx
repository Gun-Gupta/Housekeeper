import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { getAllLeads } from '../../api/api'
import { MdAssignment, MdCheckCircle, MdCancel, MdPending, MdArrowForward } from 'react-icons/md'

const WorkerDashboard = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLeads()
      .then(r => setLeads(r.data.leads || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const myLeads = leads.filter(l => l.assignedWorker?._id === user?.id || l.assignedWorker === user?.id)
  const pending  = leads.filter(l => l.status === 'new').length
  const accepted = myLeads.filter(l => l.status === 'assigned').length
  const completed = myLeads.filter(l => l.status === 'completed').length
  const rejected = leads.filter(l => l.status === 'rejected' || l.status === 'cancelled').length

  const stats = [
    { icon: <MdPending />,      label: 'New Leads',       value: pending,   color: '#FFB347', bg: 'rgba(255,179,71,0.15)' },
    { icon: <MdCheckCircle />,  label: 'Accepted',        value: accepted,  color: '#43D9A2', bg: 'rgba(67,217,162,0.15)' },
    { icon: <MdAssignment />,   label: 'Completed',       value: completed, color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
    { icon: <MdCancel />,       label: 'Rejected',        value: rejected,  color: '#FF5C5C', bg: 'rgba(255,92,92,0.15)' },
  ]

  return (
    <DashboardLayout role="worker">
      <div className="page-header">
        <h1>Welcome back, <span className="gradient-text">{user?.fullname || 'Worker'}</span> 👋</h1>
        <p>Here's an overview of your leads and activity</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent new leads */}
      <div className="card">
        <div className="flex-between mb-4">
          <h3>Recent Lead Requests</h3>
          <Link to="/worker/leads" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            View All <MdArrowForward />
          </Link>
        </div>
        {loading ? (
          <div className="spinner-center"><div className="spinner" /></div>
        ) : leads.filter(l => l.status === 'new').length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '2.5rem' }}>📋</div>
            <p style={{ marginTop: 8 }}>No new lead requests at the moment</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th><th>Category</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.filter(l => l.status === 'new').slice(0, 5).map(lead => (
                  <tr key={lead._id}>
                    <td style={{ fontWeight: 600 }}>{lead.clientName}</td>
                    <td><span className="badge badge-primary">{lead.serviceCategory}</span></td>
                    <td>{lead.phone}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td><span className="badge badge-warning">New</span></td>
                    <td>
                      <Link to="/worker/leads" className="btn btn-primary btn-sm">Respond</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkerDashboard
