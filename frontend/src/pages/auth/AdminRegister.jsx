import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminRegister } from '../../api/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const AdminRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await adminRegister(form)
      toast.success('Admin registered successfully! Please login.')
      navigate('/admin/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (label, key, type = 'text', placeholder = '') => {
    const isPassword = key === 'password';
    const isConfirmPassword = key === 'confirmPassword';
    const isPasswordField = isPassword || isConfirmPassword;
    
    let renderType = type;
    if (isPassword) {
      renderType = showPassword ? 'text' : 'password';
    } else if (isConfirmPassword) {
      renderType = showConfirmPassword ? 'text' : 'password';
    }

    return (
      <div className="form-group">
        <label>{label}</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            className="form-control" 
            type={renderType} 
            placeholder={placeholder}
            value={form[key]} 
            onChange={e => set(key, e.target.value)} 
            style={{ width: '100%', paddingRight: isPasswordField ? '48px' : '18px' }}
          />
          {isPasswordField && (
            <button
              type="button"
              onClick={() => {
                if (isPassword) setShowPassword(!showPassword);
                if (isConfirmPassword) setShowConfirmPassword(!showConfirmPassword);
              }}
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
              {isPassword ? (
                showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />
              ) : (
                showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />
              )}
            </button>
          )}
        </div>
        {errors[key] && <div className="form-error">{errors[key]}</div>}
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🛡️</div>
          <h2>Admin Registration</h2>
          <p>Create secure access to the management panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          {field('Full Name', 'fullName', 'text', 'Your full name')}
          {field('Email Address', 'email', 'email', 'admin@example.com')}
          {field('Phone Number', 'phone', 'tel', '10-digit mobile number')}
          {field('Password', 'password', 'password', 'Min 6 characters')}
          {field('Confirm Password', 'confirmPassword', 'password', 'Re-enter password')}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating admin…' : 'Register Admin'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/admin/login">Login here</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
