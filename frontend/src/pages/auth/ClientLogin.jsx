import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clientLogin } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ClientLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.phone || !form.password) { setError('Both fields are required'); return }
    setLoading(true)
    try {
      const res = await clientLogin(form)
      const { token, user } = res.data
      login(user, token, 'client')
      toast.success(`Welcome, ${user.fullname}!`)
      navigate('/client/dashboard')
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
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏠</div>
          <h2>Client Login</h2>
          <p>Sign in to find and hire workers</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" type="tel" placeholder="10-digit mobile number"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input className="form-control" type={showPassword ? 'text' : 'password'} placeholder="Enter your password"
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
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          New client? <Link to="/client/register">Register here</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default ClientLogin
