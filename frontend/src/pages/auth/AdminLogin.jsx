import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminLogin } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Both fields are required'); return }
    setLoading(true)
    try {
      const res = await adminLogin(form)
      const { token, admin } = res.data
      login(admin, token, 'admin')
      toast.success(`Welcome, ${admin.fullName}!`)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🛡️</div>
          <h2>Admin Login</h2>
          <p>Secure access to the management panel</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" type="email" placeholder="admin@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input className="form-control" type={showPassword ? 'text' : 'password'} placeholder="Enter admin password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', paddingRight: '48px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  outline: 'none'
                }}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Authenticating…' : 'Login to Admin Panel'}
          </button>
        </form>
        <div className="auth-footer" style={{ marginTop: 16 }}>
          Don't have an admin account? <Link to="/admin/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
