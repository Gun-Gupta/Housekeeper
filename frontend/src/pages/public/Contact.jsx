import { useState } from 'react'
import Navbar from '../../components/common/Navbar'
import toast from 'react-hot-toast'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('All fields are required')
      return
    }
    setSending(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll get back to you soon.')
    setForm({ name: '', email: '', message: '' })
    setSending(false)
  }

  return (
    <div style={{ paddingTop: 70 }}>
      <Navbar />
      <section style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1>Contact <span className="gradient-text">Us</span></h1>
          <p style={{ marginTop: 8 }}>Have questions? We'd love to hear from you.</p>
        </div>
        <div className="grid-2" style={{ gap: 32 }}>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: <MdEmail />, label: 'Email', value: 'support@housekeeperhq.com' },
              { icon: <MdPhone />, label: 'Phone', value: '+91 98765 43210' },
              { icon: <MdLocationOn />, label: 'Address', value: 'HouseKeeper HQ, Mumbai, India' },
            ].map((item, i) => (
              <div key={i} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,99,255,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontWeight: 600 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Form */}
          <div className="card">
            <h3 style={{ marginBottom: 20 }}>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-control" rows={5} placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
