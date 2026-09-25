import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllLeads, acceptLead, rejectLead } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdLocationOn, MdPhone, MdCalendarToday, MdCategory } from 'react-icons/md'

const statusBadge = (s) => {
  const map = {
    new: 'badge-warning', assigned: 'badge-success',
    completed: 'badge-primary', cancelled: 'badge-danger', rejected: 'badge-danger', payment_pending: 'badge-muted'
  }
  return <span className={`badge ${map[s] || 'badge-muted'}`}>{s.replace('_', ' ')}</span>
}

const LeadRequests = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('new')
  const [acting, setActing] = useState(null)

  const fetchLeads = () => {
    setLoading(true)
    getAllLeads()
      .then(r => setLeads(r.data.leads || []))
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const filtered = leads.filter(l => {
    if (tab === 'new') return l.status === 'new'
    if (tab === 'accepted') return (l.assignedWorker?._id === user?.id || l.assignedWorker === user?.id) && l.status !== 'completed'
    if (tab === 'completed') return l.status === 'completed'
    return true
  })

  const handleAccept = async (lead) => {
    setActing(lead._id)
    try {
      await acceptLead(lead._id, { workerId: user?.id })
      toast.success('Lead accepted! Proceed to payment.')
      navigate(`/worker/payment/${lead._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept lead')
    } finally {
      setActing(null)
    }
  }

  const handleReject = async (leadId) => {
    setActing(leadId)
    try {
      await rejectLead(leadId)
      toast.success('Lead rejected')
      fetchLeads()
    } catch {
      toast.error('Failed to reject lead')
    } finally {
      setActing(null)
    }
  }

  return (
    <DashboardLayout role="worker">
      <div className="page-header">
        <h1>Lead Requests</h1>
        <p>Manage incoming job requests from clients</p>
      </div>

      <div className="tabs">
        {[['new','New Requests'], ['accepted','Accepted'], ['completed','Completed'], ['all','All']].map(([k, label]) => (
          <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h3 style={{ marginTop: 12 }}>No leads found</h3>
          <p>Check back later for new requests</p>
        </div>
      ) : (
        <div className="flex-col">
          {filtered.map(lead => (
            <div key={lead._id} className="lead-card">
              <div className="flex-between">
                <h3 style={{ fontSize: '1.05rem' }}>{lead.clientName}</h3>
                {statusBadge(lead.status)}
              </div>
              <div className="lead-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <MdCategory /> {lead.serviceCategory}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <MdPhone /> {lead.phone}
                </span>
                {lead.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                    <MdLocationOn /> {lead.address}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <MdCalendarToday /> {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
              {lead.description && (
                <p style={{ fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 8 }}>
                  {lead.description}
                </p>
              )}
              {lead.status === 'new' && (
                <div className="lead-actions">
                  <button className="btn btn-success btn-sm" disabled={acting === lead._id} onClick={() => handleAccept(lead)}>
                    {acting === lead._id ? 'Processing…' : '✓ Accept Lead'}
                  </button>
                  <button className="btn btn-danger btn-sm" disabled={acting === lead._id} onClick={() => handleReject(lead._id)}>
                    ✕ Reject
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

export default LeadRequests
