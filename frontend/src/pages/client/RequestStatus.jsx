import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllLeads, cancelLead } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdLocationOn, MdPhone, MdCalendarToday } from 'react-icons/md'

const statusBadge = (s) => {
  const map = {
    new: 'badge-warning', assigned: 'badge-success', payment_pending: 'badge-muted',
    completed: 'badge-primary', cancelled: 'badge-danger', rejected: 'badge-danger'
  }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s.replace('_', ' ')}</span>
}

const RequestStatus = () => {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [cancelling, setCancelling] = useState(null)

  const fetchLeads = () => {
    setLoading(true)
    getAllLeads()
      .then(r => setLeads(r.data.leads || []))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const myLeads = leads.filter(l => l.createdBy?._id === user?.id || l.createdBy === user?.id)

  const filtered = myLeads.filter(l => {
    if (tab === 'pending')   return l.status === 'new' || l.status === 'payment_pending'
    if (tab === 'accepted')  return l.status === 'assigned'
    if (tab === 'completed') return l.status === 'completed'
    if (tab === 'cancelled') return l.status === 'cancelled' || l.status === 'rejected'
    return true
  })

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      await cancelLead(id)
      toast.success('Request cancelled')
      fetchLeads()
    } catch {
      toast.error('Failed to cancel')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <DashboardLayout role="client">
      <div className="page-header">
        <h1>My Requests</h1>
        <p>Track the status of your service requests</p>
      </div>

      <div className="tabs">
        {[['pending','Pending'],['accepted','Accepted'],['completed','Completed'],['cancelled','Cancelled']].map(([k,label]) => (
          <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h3 style={{ marginTop: 12 }}>No {tab} requests</h3>
          <p>Send a request to a worker to see it here</p>
        </div>
      ) : (
        <div className="flex-col">
          {filtered.map(lead => (
            <div key={lead._id} className="lead-card">
              <div className="flex-between">
                <div>
                  <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{lead.serviceCategory}</h3>
                  {statusBadge(lead.status)}
                </div>
                {lead.assignedWorker && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Assigned Worker</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {lead.assignedWorker?.fullname || 'Worker'}
                    </div>
                  </div>
                )}
              </div>

              <div className="lead-meta">
                {lead.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <MdLocationOn /> {lead.address}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <MdCalendarToday /> {new Date(lead.createdAt).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <MdPhone /> {lead.phone}
                </span>
              </div>

              {lead.description && (
                <p style={{ fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 8 }}>
                  {lead.description}
                </p>
              )}

              {lead.paymentStatus === 'paid' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--success)' }}>
                  ✓ Payment of ₹{lead.paymentAmount} received
                </div>
              )}

              {(lead.status === 'new') && (
                <div className="lead-actions">
                  <button className="btn btn-danger btn-sm" disabled={cancelling === lead._id} onClick={() => handleCancel(lead._id)}>
                    {cancelling === lead._id ? 'Cancelling…' : 'Cancel Request'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default RequestStatus
