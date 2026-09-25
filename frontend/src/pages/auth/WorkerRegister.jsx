import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { workerRegister, sendOtp } from '../../api/api'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const categories = ['Cooking', 'Cleaning', 'Gardening', 'Babysitting', 'Driver', 'All Services']

const WorkerRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '', phone: '', gender: '', age: '', dob: '',
    password: '', confirmPassword: '', serviceCategory: 'All Services', address: '', profile: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.fullname.trim()) e.fullname = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.gender) e.gender = 'Select gender'
    if (!form.age || form.age < 18 || form.age > 65) e.age = 'Age must be between 18–65'
    if (!form.dob) e.dob = 'Date of birth is required'
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
      const payload = { ...form, profile: form.profile || 'default' }
      await workerRegister(payload)
      const otpRes = await sendOtp({ phone: form.phone })
      const devOtp = otpRes.data?.otp // backend returns OTP for dev/testing
      toast.success('Registered! Please verify your OTP.')
      navigate('/verify-otp', { state: { phone: form.phone, role: 'worker', devOtp } })
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
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>👷</div>
          <h2>Worker Registration</h2>
          <p>Create your worker profile to start accepting jobs</p>
        </div>

        <form onSubmit={handleSubmit}>
          {field('Full Name', 'fullname', 'text', 'Enter your full name')}
          {field('Phone Number', 'phone', 'tel', '10-digit mobile number')}

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select className="form-control" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <div className="form-error">{errors.gender}</div>}
            </div>
            <div className="form-group">
              <label>Age</label>
              <input className="form-control" type="number" min={18} max={65} placeholder="18–65"
                value={form.age} onChange={e => set('age', e.target.value)} />
              {errors.age && <div className="form-error">{errors.age}</div>}
            </div>
          </div>

          {field('Date of Birth', 'dob', 'date')}

          <div className="form-group">
            <label>Service Category</label>
            <select className="form-control" value={form.serviceCategory} onChange={e => set('serviceCategory', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {field('Address', 'address', 'text', 'Your current address')}
          {field('Password', 'password', 'password', 'Min 6 characters')}
          {field('Confirm Password', 'confirmPassword', 'password', 'Re-enter password')}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Registering…' : 'Register & Get OTP'}
          </button>
        </form>

        <div className="auth-footer">
          Already registered? <Link to="/worker/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default WorkerRegister
