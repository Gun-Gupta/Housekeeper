import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clientRegister } from '../../api/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const categories = ['Cooking', 'Cleaning', 'Gardening', 'Babysitting', 'Driver']

const ClientRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '', phone: '', password: '', confirmPassword: '',
    CategoryNeeded: 'Cooking', address: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.fullname.trim()) e.fullname = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone'
    if (!form.address.trim()) e.address = 'Address is required'
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
      await clientRegister(form)
      toast.success('Account created! Please login.')
      navigate('/client/login')
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
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏠</div>
          <h2>Client Registration</h2>
          <p>Find the perfect worker for your home</p>
        </div>

        <form onSubmit={handleSubmit}>
          {field('Full Name', 'fullname', 'text', 'Your full name')}
          {field('Phone Number', 'phone', 'tel', '10-digit mobile number')}
          {field('Address', 'address', 'text', 'Your home address')}

          <div className="form-group">
            <label>Category Needed</label>
            <select className="form-control" value={form.CategoryNeeded} onChange={e => set('CategoryNeeded', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {field('Password', 'password', 'password', 'Min 6 characters')}
          {field('Confirm Password', 'confirmPassword', 'password', 'Re-enter password')}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/client/login">Login here</Link>
        </div>
        <div className="auth-footer" style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default ClientRegister
