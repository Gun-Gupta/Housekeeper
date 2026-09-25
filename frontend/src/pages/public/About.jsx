import Navbar from '../../components/common/Navbar'
import { MdVerified, MdSecurity, MdGroups } from 'react-icons/md'

const About = () => (
  <div style={{ paddingTop: 70 }}>
    <Navbar />
    <section style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1>About <span className="gradient-text">HouseKeeper</span></h1>
        <p style={{ marginTop: 12, fontSize: '1.05rem', maxWidth: 600, margin: '12px auto 0' }}>
          We connect households with verified, trusted domestic workers — making everyday life easier for everyone.
        </p>
      </div>
      <div className="grid-3" style={{ marginBottom: 48 }}>
        {[
          { icon: <MdVerified style={{ fontSize: '2rem', color: 'var(--primary)' }} />, title: 'Verified Workers', desc: 'Every worker goes through ID verification and background checks before joining our platform.' },
          { icon: <MdSecurity style={{ fontSize: '2rem', color: 'var(--success)' }} />, title: 'Secure Payments', desc: 'Payments are processed through Razorpay — fully secure and transparent with no hidden charges.' },
          { icon: <MdGroups style={{ fontSize: '2rem', color: 'var(--secondary)' }} />, title: 'Community Driven', desc: 'We empower domestic workers with fair opportunities while giving clients peace of mind.' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 14 }}>{item.icon}</div>
            <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
            <p style={{ fontSize: '0.88rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Our Mission</h2>
        <p>
          HouseKeeper was built with a simple mission — to dignify domestic work and create meaningful employment opportunities
          while solving a real pain point for busy households. We believe every home deserves reliable help, and every worker
          deserves fair pay and respect.
        </p>
        <p style={{ marginTop: 12 }}>
          Our platform makes it seamless to discover, hire, and manage domestic workers across categories like
          Cooking, Cleaning, Gardening, Babysitting, and Driving.
        </p>
      </div>
    </section>
  </div>
)

export default About
