import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllWorkers, getAllClients, getAllLeads } from '../../api/api'
import { MdGroup, MdPeople, MdAssignment, MdAttachMoney, MdCheckCircle, MdCancel } from 'react-icons/md'

const AdminDashboard = () => {
  const [data, setData] = useState({ workers: [], clients: [], leads: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllWorkers(), getAllClients(), getAllLeads()])
      .then(([wr, cr, lr]) => setData({
        workers: wr.data.workers || wr.data || [],
        clients: cr.data.clients || cr.data || [],
        leads:   lr.data.leads   || [],
      }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const { workers, clients, leads } = data
  const revenue   = leads.filter(l => l.paymentStatus === 'paid').length * 99
  const accepted  = leads.filter(l => l.status === 'assigned' || l.status === 'completed').length
  const rejected  = leads.filter(l => l.status === 'cancelled' || l.status === 'rejected').length

  const stats = [
    { icon: <MdGroup />,       label: 'Total Workers',    value: workers.length, color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
    { icon: <MdPeople />,      label: 'Total Clients',    value: clients.length, color: '#FF6584', bg: 'rgba(255,101,132,0.15)' },
    { icon: <MdAssignment />,  label: 'Total Leads',      value: leads.length,   color: '#FFB347', bg: 'rgba(255,179,71,0.15)' },
    { icon: <MdAttachMoney />, label: 'Total Revenue',    value: `₹${revenue}`,  color: '#43D9A2', bg: 'rgba(67,217,162,0.15)' },
    { icon: <MdCheckCircle />, label: 'Accepted Requests',value: accepted,       color: '#43D9A2', bg: 'rgba(67,217,162,0.15)' },
    { icon: <MdCancel />,      label: 'Rejected Requests',value: rejected,       color: '#FF5C5C', bg: 'rgba(255,92,92,0.15)' },
  ]

  // Recent activity
  const recentLeads = [...leads].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5)

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1>Admin <span className="gradient-text">Dashboard</span></h1>
        <p>Platform overview and analytics</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        {/* Recent leads */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Recent Lead Activity</h3>
          {loading ? <div className="spinner-center"><div className="spinner" /></div> :
            recentLeads.length === 0 ? <p>No leads yet</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentLeads.map(l => (
                <div key={l._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.clientName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{l.serviceCategory} • {new Date(l.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`badge ${l.status==='assigned'||l.status==='completed'?'badge-success':l.status==='new'?'badge-warning':'badge-danger'}`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worker breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Worker Status</h3>
          {loading ? <div className="spinner-center"><div className="spinner" /></div> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Available',   value: workers.filter(w=>w.availabilityStatus==='available').length, color: '#43D9A2' },
                { label: 'Busy',        value: workers.filter(w=>w.availabilityStatus==='busy').length,      color: '#FFB347' },
                { label: 'Blocked',     value: workers.filter(w=>w.isBlocked).length,                       color: '#FF5C5C' },
              ].map((s,i) => (
                <div key={i}>
                  <div className="flex-between" style={{ marginBottom: 6, fontSize: '0.88rem' }}>
                    <span>{s.label}</span><strong>{s.value}</strong>
                  </div>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: workers.length ? `${(s.value/workers.length)*100}%` : '0%', height: '100%', background: s.color, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard
