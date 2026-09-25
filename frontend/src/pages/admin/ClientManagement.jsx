import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllClients, deleteClient, blockClient } from '../../api/api'
import toast from 'react-hot-toast'
import { MdSearch, MdDelete, MdBlock, MdCheckCircle } from 'react-icons/md'

const ClientManagement = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [acting, setActing] = useState(null)

  const fetchClients = () => {
    setLoading(true)
    getAllClients()
      .then(r => setClients(r.data.clients || r.data || []))
      .catch(() => toast.error('Failed to load clients'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchClients() }, [])

  const filtered = clients.filter(c =>
    c.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  const handleBlock = async (id, isBlocked) => {
    setActing(id)
    try {
      await blockClient(id)
      toast.success(isBlocked ? 'Client unblocked' : 'Client blocked')
      fetchClients()
    } catch {
      toast.error('Action failed')
    } finally {
      setActing(null)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this client permanently?')) return
    setActing(id)
    try {
      await deleteClient(id)
      toast.success('Client deleted')
      fetchClients()
    } catch {
      toast.error('Delete failed')
    } finally {
      setActing(null)
    }
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1>Client Management</h1>
        <p>View and manage all registered clients</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <MdSearch size={18} />
          <input placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color: 'var(--muted)', fontSize: '0.88rem', alignSelf: 'center' }}>
          {filtered.length} client{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>👤</div>
          <h3 style={{ marginTop: 12 }}>No clients found</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th><th>Phone</th><th>Category</th><th>Address</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.profile && c.profile !== 'default' ? (
                        <img src={c.profile} alt="Profile" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FF6584, #FFB347)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.9rem', color: '#fff', flexShrink: 0
                        }}>
                          {(c.fullname || 'C')[0].toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontWeight: 600 }}>{c.fullname}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{c.phone}</td>
                  <td><span className="badge badge-danger">{c.CategoryNeeded || '—'}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.address || '—'}</td>
                  <td>
                    {c.isBlocked
                      ? <span className="badge badge-danger">Blocked</span>
                      : <span className="badge badge-success">Active</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn btn-sm ${c.isBlocked ? 'btn-success' : 'btn-secondary'}`}
                        disabled={acting === c._id}
                        onClick={() => handleBlock(c._id, c.isBlocked)}
                        title={c.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {c.isBlocked ? <MdCheckCircle /> : <MdBlock />}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={acting === c._id}
                        onClick={() => handleDelete(c._id)}
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

export default ClientManagement
