import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import {
  MdCleaningServices, MdOutdoorGrill, MdChildCare,
  MdDirectionsCar, MdLocalFlorist, MdVerified,
  MdStar, MdGroups, MdAssignment
} from 'react-icons/md'

const services = [
  { icon: <MdOutdoorGrill />,    label: 'Cooking',    color: '#FF007F', desc: 'Gourmet home cooking, meal preps, and daily meals sorted.' },
  { icon: <MdCleaningServices />,label: 'Cleaning',   color: '#00F0FF', desc: 'Spotless rooms, deep cleaning, and clutter-free zones.' },
  { icon: <MdLocalFlorist />,    label: 'Gardening',  color: '#39FF14', desc: 'Landscape glow-ups, weed control, and green fingers.' },
  { icon: <MdChildCare />,       label: 'Babysitting',color: '#FFD700', desc: 'Trustworthy, verified sitters to keep kids happy & safe.' },
  { icon: <MdDirectionsCar />,   label: 'Driver',     color: '#8F43FF', desc: 'Expert navigators for smooth rides and punctual drives.' },
]

const stats = [
  { icon: <MdGroups />,    value: '500+',  label: 'Verified Pros',   color: '#8F43FF' },
  { icon: <MdAssignment />,value: '1.2K+', label: 'Gigs Hooked',     color: '#00F0FF' },
  { icon: <MdStar />,      value: '4.9/5', label: 'Client Vibe Rating',color: '#FFD700' },
  { icon: <MdVerified />,  value: '100%',  label: 'Background Checked',color: '#FF007F' },
]

const Home = () => {
  return (
    <div style={{ paddingTop: 80, overflowX: 'hidden' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="sticker sticker-success">🔥 No Cap. Just Pure Help.</div>
          <h1>
            Your Chores.<br />
            <span className="gradient-text glow-cyan">Sorted Instantly.</span>
          </h1>
          <p>
            Skip the stress of finding trusted domestic workers. Connect with background-verified,
            premium professionals for all your home tasks with absolute transparency.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Link to="/client/register" className="btn btn-primary btn-lg">🚀 Get Help Now</Link>
            <Link to="/worker/register" className="btn btn-secondary btn-lg">👷 Join the Gig Grid</Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section style={{ padding: '80px 24px', background: 'rgba(13, 13, 25, 0.4)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div className="sticker" style={{ background: 'var(--primary)' }}>⚡ STACKED STATS</div>
            <h2>We mean business</h2>
          </div>
          <div className="grid-4">
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ border: '2px solid var(--border)' }}>
                <div className="stat-icon" style={{ color: s.color, background: 'rgba(255, 255, 255, 0.03)' }}>
                  {s.icon}
                </div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="sticker" style={{ background: 'var(--accent)' }}>💡 CHOOSE YOUR VIBE</div>
            <h2>Gigs We Offer</h2>
            <p style={{ marginTop: 12 }}>Pick what you need done, we've got top-tier experts for each.</p>
          </div>
          <div className="grid-3" style={{ gap: 24 }}>
            {services.map((s, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{
                    width: 60, height: 60, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-inner)', color: s.color, border: '2px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                    marginBottom: 20
                  }}>{s.icon}</div>
                  <h3 style={{ marginBottom: 12 }}>{s.label}</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>{s.desc}</p>
                </div>
                <Link to="/client/register" className="btn btn-secondary btn-sm btn-full">
                  Hire Professional →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Banner CTA */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(143, 67, 255, 0.15) 0%, rgba(255, 0, 127, 0.15) 100%)',
        borderTop: '2px solid var(--border)',
        borderBottom: '2px solid var(--border)'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="sticker sticker-success" style={{ marginBottom: 20 }}>🔥 UNBEATABLE OFFER</div>
          <h2 style={{ fontSize: '3rem', marginBottom: 16 }}>Ready to upgrade your household vibe?</h2>
          <p style={{ marginBottom: 36 }}>
            Pay a flat fee of just ₹99 to book any premium helper. Absolutely no lock-ins, direct coordination.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/client/register" className="btn btn-accent btn-lg">Hire a Worker</Link>
            <Link to="/worker/register" className="btn btn-outline btn-lg">Sign up as Worker</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#05050A', borderTop: '2px solid var(--border)', padding: '60px 24px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12, fontFamily: 'Space Grotesk' }}>
          <span style={{ color: 'var(--secondary)' }}>House</span>Keeper
        </div>
        <p style={{ fontSize: '0.9rem', marginBottom: 24 }}>Connecting verified domestic professionals with modern households.</p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 30 }}>
          <Link to="/about" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>About</Link>
          <Link to="/contact" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Contact</Link>
          <Link to="/worker/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Worker Login</Link>
          <Link to="/admin/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Admin Panel</Link>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.2)' }}>© 2026 HouseKeeper. Developed for elite modern households.</p>
      </footer>
    </div>
  )
}

export default Home
