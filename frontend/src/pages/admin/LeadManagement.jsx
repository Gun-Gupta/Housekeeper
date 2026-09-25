import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAllLeads, completeLead, cancelLead } from '../../api/api'
import toast from 'react-hot-toast'
import { MdSearch } from 'react-icons/md'

const statusBadge = (s) => {
  const map = {
    new:'badge-warning', assigned:'badge-success', payment_pending:'badge-muted',
    completed:'badge-primary', cancelled:'badge-danger', rejected:'badge-danger'
  }
  return <span className={`badge ${map[s]||'badge-muted'}`}>{s.replace('_',' ')}</span>
}

const LeadManagement = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [acting, setActing] = useState(null)

  const fetchLeads = () => {
    setLoading(true)
    getAllLeads()
      .then(r => setLeads(r.data.leads || []))
      .catch(() => toast.error('Failed to load leads'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchLeads() }, [])

  const tabs = [
    ['all','All'],['new','Pending'],['assigned','Accepted'],['completed','Completed'],['cancelled','Cancelled']
  ]

  const filtered = leads.filter(l => {
    const matchTab = tab === 'all' || l.status === tab
    const matchSearch = l.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      l.serviceCategory?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search)
    return matchTab && matchSearch
  })

  const handleComplete = async (id) => {
    setActing(id)
    try {
      await completeLead(id)
      toast.success('Lead marked completed')
      fetchLeads()
    } catch { toast.error('Failed') } finally { setActing(null) }
  }

  const handleCancel = async (id) => {
    setActing(id)
    try {
      await cancelLead(id)
      toast.success('Lead cancelled')
      fetchLeads()
    } catch { toast.error('Failed') } finally { setActing(null) }
  }

  return (
    <DashboardLayout role="admin">
      <div className="page-header">
        <h1>Lead Management</h1>
        <p>Monitor and manage all service leads</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-bar" style={{ maxWidth: 300 }}>
          <MdSearch size={18} />
          <input placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="tabs">
        {tabs.map(([k,label]) => (
          <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div className="spinner-center"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <div style={{ fontSize: '3rem' }}>📋</div>
          <h3 style={{ marginTop: 12 }}>No leads found</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th><th>Phone</th><th>Category</th><th>Address</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l._id}>
                  <td style={{ fontWeight: 600 }}>{l.clientName}</td>
                  <td style={{ color: 'var(--muted)' }}>{l.phone}</td>
                  <td><span className="badge badge-primary">{l.serviceCategory}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{l.address}</td>
                  <td>
                    <span className={`badge ${l.paymentStatus==='paid'?'badge-success':'badge-muted'}`}>
                      {l.paymentStatus==='paid' ? `₹${l.paymentAmount}` : 'Pending'}
                    </span>
                  </td>
                  <td>{statusBadge(l.status)}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {l.status === 'assigned' && (
                        <button className="btn btn-success btn-sm" disabled={acting===l._id} onClick={() => handleComplete(l._id)}>
                          Complete
                        </button>
                      )}
                      {(l.status === 'new' || l.status === 'assigned') && (
                        <button className="btn btn-danger btn-sm" disabled={acting===l._id} onClick={() => handleCancel(l._id)}>
                          Cancel
                        </button>
                      )}
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

export default LeadManagement
