import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllWorkers, blockWorker, deleteWorker } from '../../api/api'
import toast from 'react-hot-toast'
import { MdSearch, MdBlock, MdDelete, MdCheckCircle } from 'react-icons/md'

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [acting, setActing] = useState(null)

  const fetchWorkers = () => {
    setLoading(true)
    getAllWorkers()
      .then(r => setWorkers(r.data.workers || r.data || []))
      .catch(() => toast.error('Failed to load workers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchWorkers() }, [])

  const filtered = workers.filter(w =>
    w.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    w.phone?.includes(search) ||
    w.serviceCategory?.toLowerCase().includes(search.toLowerCase())
  )

  const handleBlock = async (id, isBlocked) => {
    setActing(id)
    try {
      await blockWorker(id)
      toast.success(isBlocked ? 'Worker unblocked' : 'Worker blocked')
      fetchWorkers()
    } catch {
      toast.error('Action failed')
    } finally {
      setActing(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this worker permanently?')) return
    setActing(id)
    try {
      await deleteWorker(id)
      toast.success('Worker deleted')
      fetchWorkers()
    } catch {
      toast.error('Delete failed')
    } finally {
      setActing(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1>Worker Management</h1>
        <p>View, block, and manage all registered workers</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <MdSearch size={18} />
          <input placeholder="Search by name, phone, category…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.88rem', alignSelf: 'center' }}>
          {filtered.length} worker{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>👷</div>
          <h3 style={{ marginTop: 12 }}>No workers found</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Worker</th><th>Phone</th><th>Category</th><th>Rating</th><th>Status</th><th>Blocked</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {w.profile && w.profile !== 'default' ? (
                        <img src={w.profile} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0
                        }}>
                          {(w.fullname||'W')[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{w.fullname}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{w.gender || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{w.phone}</td>
                  <td><span className="badge badge-primary">{w.serviceCategory}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{w.rating > 0 ? `⭐ ${w.rating}` : 'New'}</td>
                  <td>
                    <span className={`badge ${w.availabilityStatus === 'available' ? 'badge-success' : 'badge-muted'}`}>
                      {w.availabilityStatus || 'available'}
                    </span>
                  </td>
                  <td>
                    {w.isBlocked
                      ? <span className="badge badge-danger">Blocked</span>
                      : <span className="badge badge-success">Active</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn btn-sm ${w.isBlocked ? 'btn-success' : 'btn-secondary'}`}
                        disabled={acting === w._id}
                        onClick={() => handleBlock(w._id, w.isBlocked)}
                        title={w.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {w.isBlocked ? <MdCheckCircle /> : <MdBlock />}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={acting === w._id}
                        onClick={() => handleDelete(w._id)}
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}

export default WorkerManagement
