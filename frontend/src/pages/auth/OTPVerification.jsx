import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { verifyOtp, sendOtp } from '../../api/api'

const OTPVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { phone, role, devOtp: initialDevOtp } = location.state || {}
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [devOtp, setDevOtp] = useState(initialDevOtp || null)
  const inputs = useRef([])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')
    if (otpCode.length < 6) { toast.error('Enter complete 6-digit OTP'); return }
    setLoading(true)
    try {
      await verifyOtp({ phone, otp: otpCode })
      toast.success('Phone verified successfully!')
      navigate(role === 'worker' ? '/worker/login' : '/client/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const res = await sendOtp({ phone })
      const newOtp = res.data?.otp
      if (newOtp) setDevOtp(newOtp)
      toast.success('OTP resent!')
    } catch {
      toast.error('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>📱</div>
        <h2>Verify Your Phone</h2>
        <p style={{ marginBottom: 4 }}>
          Enter the 6-digit OTP sent to
        </p>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>
          +91 {phone || 'XXXXXXXXXX'}
        </p>

        {/* Dev hint — shows the OTP returned by backend since Fast2SMS may not deliver */}
        {devOtp && (
          <div style={{
            background: 'rgba(67,217,162,0.12)', border: '1px solid rgba(67,217,162,0.3)',
            borderRadius: 10, padding: '12px 18px', marginBottom: 16, fontSize: '0.88rem'
          }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 4 }}>
              🛠️ DEV MODE — SMS not delivered, use this OTP:
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: 8, color: 'var(--success)' }}>
              {devOtp}
            </div>
          </div>
        )}

        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              className="otp-input"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              inputMode="numeric"
            />
          ))}
        </div>

        <button className="btn btn-primary btn-full" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>

        <div style={{ marginTop: 20, fontSize: '0.88rem', color: 'var(--muted)' }}>
          Didn't receive it?{' '}
          <button onClick={handleResend} disabled={resending}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 'inherit' }}>
            {resending ? 'Resending…' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
