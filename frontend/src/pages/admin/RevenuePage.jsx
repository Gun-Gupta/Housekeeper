import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllLeads } from '../../api/api'
import { MdAttachMoney, MdTrendingUp, MdPayment } from 'react-icons/md'

const RevenuePage = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLeads()
      .then(r => setLeads(r.data.leads || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const paidLeads   = leads.filter(l => l.paymentStatus === 'paid')
  const totalRevenue = paidLeads.length * 99
  const pending     = leads.filter(l => l.paymentStatus === 'pending').length
  const failed      = leads.filter(l => l.paymentStatus === 'failed').length

  // Group by month
  const byMonth = {}
  paidLeads.forEach(l => {
    const m = new Date(l.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' })
    byMonth[m] = (byMonth[m] || 0) + 99
  })

  const monthlyData = Object.entries(byMonth).slice(-6)
  const maxVal = Math.max(...monthlyData.map(([,v]) => v), 1)

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1>Revenue Management</h1>
        <p>Track payments and earnings from lead acceptances</p>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {[
          { icon: <MdAttachMoney />, label: 'Total Revenue',   value: `₹${totalRevenue}`, color: '#43D9A2', bg: 'rgba(67,217,162,0.15)' },
          { icon: <MdPayment />,     label: 'Paid Payments',   value: paidLeads.length,   color: '#6C63FF', bg: 'rgba(108,99,255,0.15)' },
          { icon: <MdTrendingUp />,  label: 'Pending/Failed',  value: pending + failed,   color: '#FFB347', bg: 'rgba(255,179,71,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-value">{loading ? '—' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      {monthlyData.length > 0 && (
        <div className="card" style={{ marginBottom: 28 }}>
          <h3 style={{ marginBottom: 24 }}>Monthly Revenue</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 160 }}>
            {monthlyData.map(([month, val]) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>₹{val}</div>
                <div style={{
                  width: '100%', background: 'linear-gradient(180deg, #6C63FF, #5A52E0)',
                  borderRadius: '6px 6px 0 0', height: `${(val/maxVal)*120}px`,
                  transition: 'height 0.5s', minHeight: 8
                }} />
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textAlign: 'center' }}>{month}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Payment History</h3>
        {loading ? (
          <div className="spinner-center"><div className="spinner" /></div>
        ) : paidLeads.length === 0 ? (
          <div className="empty-state">
            <p>No payments recorded yet</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Client</th><th>Category</th><th>Worker</th><th>Amount</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {paidLeads.map(l => (
                  <tr key={l._id}>
                    <td style={{ fontWeight: 600 }}>{l.clientName}</td>
                    <td><span className="badge badge-primary">{l.serviceCategory}</span></td>
                    <td style={{ color: 'var(--muted)' }}>{l.assignedWorker?.fullname || '—'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{l.paymentAmount}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td><span className="badge badge-success">Paid</span></td>
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

export default RevenuePage
