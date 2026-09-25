import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllWorkers, createLead } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { MdSearch, MdStar, MdSend } from 'react-icons/md'

const categories = ['All', 'Cooking', 'Cleaning', 'Gardening', 'Babysitting', 'Driver', 'All Services']

const WorkerListing = () => {
  const { user } = useAuth()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [modal, setModal] = useState(null) // worker being requested
  const [reqForm, setReqForm] = useState({ address: '', description: '', budget: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getAllWorkers()
      .then(r => setWorkers(r.data.workers || r.data || []))
      .catch(() => toast.error('Failed to load workers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = workers.filter(w => {
    const matchSearch = w.fullname?.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'All' || w.serviceCategory === catFilter
    return matchSearch && matchCat && !w.isBlocked
  })

  const handleSendRequest = async () => {
    if (!reqForm.address) { toast.error('Address is required'); return }
    setSending(true)
    try {
      await createLead({
        clientName: user?.fullname,
        phone: user?.phone,
        serviceCategory: modal.serviceCategory,
        address: reqForm.address,
        description: reqForm.description,
        budget: Number(reqForm.budget) || 0,
        createdBy: user?.id,
      })
      toast.success('Request sent successfully!')
      setModal(null)
      setReqForm({ address: '', description: '', budget: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request')
    } finally {
      setSending(false)
    }
  }

  return (
    <DashboardLayout role="client">
      <div className="page-header">
        <h1>Find Workers</h1>
        <p>Browse verified domestic workers in your area</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ maxWidth: 320 }}>
          <MdSearch size={18} />
          <input placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`btn btn-sm ${catFilter === c ? 'btn-primary' : 'btn-secondary'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>👷</div>
          <h3 style={{ marginTop: 12 }}>No workers found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(w => (
            <div key={w._id} className="worker-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {w.profile && w.profile !== 'default' ? (
                  <img src={w.profile} alt="Profile" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div className="worker-avatar">
                    {(w.fullname || 'W')[0].toUpperCase()}
                  </div>
                )}
                <div className="worker-info">
                  <h4>{w.fullname}</h4>
                  <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{w.serviceCategory}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--muted)' }}>
                <MdStar style={{ color: '#FFB347' }} />
                <span>{w.rating > 0 ? w.rating.toFixed(1) : 'New'}</span>
                <span style={{ margin: '0 6px' }}>•</span>
                <span className={`badge ${w.availabilityStatus === 'available' ? 'badge-success' : 'badge-muted'}`} style={{ fontSize: '0.72rem' }}>
                  {w.availabilityStatus || 'available'}
                </span>
              </div>

              {w.address && (
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📍 {w.address}</div>
              )}

              <button
                className="btn btn-primary btn-sm btn-full"
                style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
                onClick={() => setModal(w)}
              >
                <MdSend /> Send Request
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 460, width: '100%' }}>
            <h3 style={{ marginBottom: 4 }}>Send Request to {modal.fullname}</h3>
            <p style={{ marginBottom: 20, fontSize: '0.88rem' }}>Category: <strong>{modal.serviceCategory}</strong></p>

            <div className="form-group">
              <label>Your Address *</label>
              <input className="form-control" placeholder="Where do you need the service?"
                value={reqForm.address} onChange={e => setReqForm({ ...reqForm, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" rows={3} placeholder="Describe what you need…"
                value={reqForm.description} onChange={e => setReqForm({ ...reqForm, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Budget (₹)</label>
              <input className="form-control" type="number" placeholder="Optional budget"
                value={reqForm.budget} onChange={e => setReqForm({ ...reqForm, budget: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-full" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-full" onClick={handleSendRequest} disabled={sending}>
                {sending ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default WorkerListing
