import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateWorker } from '../../api/api'
import toast from 'react-hot-toast'
import { MdEdit, MdSave, MdPerson } from 'react-icons/md'

const categories = ['Cooking', 'Cleaning', 'Gardening', 'Babysitting', 'Driver', 'All Services']

const WorkerProfile = () => {
  const { user, login, token, role } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    serviceCategory: user?.serviceCategory || 'All Services',
    address: user?.address || '',
    profile: user?.profile || '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [loading, setLoading] = useState(false)

  // Sync state if user context updates
  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || '',
        phone: user.phone || '',
        gender: user.gender || '',
        serviceCategory: user.serviceCategory || 'All Services',
        address: user.address || '',
        profile: user.profile || '',
        newPassword: '',
        confirmNewPassword: '',
      })
    }
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      set('profile', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      toast.error('Passwords do not match'); return
    }
    setLoading(true)
    try {
      const payload = {
        fullname: form.fullname,
        phone: form.phone,
        gender: form.gender,
        serviceCategory: form.serviceCategory,
        address: form.address,
        profile: form.profile,
        ...(form.newPassword ? { password: form.newPassword } : {}),
      }
      const res = await updateWorker(user.id, payload)
      const updated = { ...user, ...payload }
      login(updated, token, role)
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const avatarLetter = (user?.fullname || 'W')[0].toUpperCase()

  return (
    <DashboardLayout role="worker">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and settings</p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Avatar */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 20, padding: '36px' }}>
          {form.profile && form.profile !== 'default' ? (
            <img src={form.profile} alt="Profile" style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
              objectFit: 'cover', display: 'block'
            }} />
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 800, color: '#fff'
            }}>
              {avatarLetter}
            </div>
          )}
          <h2 style={{ marginBottom: 4 }}>{user?.fullname}</h2>
          <span className="badge badge-primary" style={{ display: 'inline-block', marginBottom: editing ? 12 : 0 }}>Worker</span>
          {user?.availabilityStatus && (
            <span className={`badge ${user.availabilityStatus === 'available' ? 'badge-success' : 'badge-muted'}`} style={{ marginLeft: 8, display: 'inline-block', marginBottom: editing ? 12 : 0 }}>
              {user.availabilityStatus}
            </span>
          )}

          {editing && (
            <div style={{ marginTop: 8 }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-block' }}>
                Change Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </label>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="card">
          <div className="flex-between mb-4">
            <h3>Personal Information</h3>
            {!editing ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MdEdit /> Edit
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MdSave /> {loading ? 'Saving…' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={form.fullname} disabled={!editing}
                onChange={e => set('fullname', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input className="form-control" value={form.phone} disabled={!editing}
                onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={form.gender} disabled={!editing}
                onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Service Category</label>
              <select className="form-control" value={form.serviceCategory} disabled={!editing}
                onChange={e => set('serviceCategory', e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input className="form-control" value={form.address} disabled={!editing}
              onChange={e => set('address', e.target.value)} />
          </div>

          {editing && (
            <>
              <div className="divider" />
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>Change Password <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></h4>
              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input className="form-control" type="password" placeholder="Min 6 characters"
                    value={form.newPassword} onChange={e => set('newPassword', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input className="form-control" type="password" placeholder="Re-enter password"
                    value={form.confirmNewPassword} onChange={e => set('confirmNewPassword', e.target.value)} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default WorkerProfile
