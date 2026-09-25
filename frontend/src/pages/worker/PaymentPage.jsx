import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { createPaymentOrder, verifyPayment, getAllLeads } from '../../api/api'
import toast from 'react-hot-toast'
import { MdPayment, MdSecurity, MdCheckCircle } from 'react-icons/md'

const PaymentPage = () => {
  const { leadId } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    getAllLeads()
      .then(r => {
        const found = (r.data.leads || []).find(l => l._id === leadId)
        setLead(found)
      })
      .catch(() => toast.error('Failed to load lead'))
      .finally(() => setLoading(false))
  }, [leadId])

  const handlePayment = async () => {
    setPaying(true)
    try {
      const res = await createPaymentOrder({ leadId })
      const { order } = res.data

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_SqmIcouZcCvMmf',
        amount: order.amount,
        currency: order.currency,
        name: 'HouseKeeper',
        description: `Lead acceptance fee for ${lead?.serviceCategory}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              leadId,
            })
            setPaid(true)
            toast.success('Payment successful! Lead assigned to you.')
          } catch {
            toast.error('Payment verification failed')
          }
        },
        theme: { color: '#6C63FF' },
      }

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        toast.error('Razorpay SDK not loaded')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create payment order')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <DashboardLayout role="worker">
      <div className="spinner-center"><div className="spinner" /></div>
    </DashboardLayout>
  )

  if (paid) return (
    <DashboardLayout role="worker">
      <div className="payment-card" style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: '4rem', color: 'var(--success)' }}><MdCheckCircle /></div>
        <h2 style={{ marginTop: 16 }}>Payment Successful!</h2>
        <p style={{ marginTop: 8 }}>You have been assigned to this lead. Contact the client to get started.</p>
        <button className="btn btn-primary btn-full" style={{ marginTop: 24 }} onClick={() => navigate('/worker/leads')}>
          Back to Leads
        </button>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout role="worker">
      <div className="page-header">
        <h1>Payment Required</h1>
        <p>Pay the lead acceptance fee to confirm this job</p>
      </div>

      <div className="payment-card">
        {/* Lead Details */}
        {lead && (
          <div style={{ marginBottom: 20, padding: '16px', background: 'rgba(108,99,255,0.08)', borderRadius: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6 }}>LEAD DETAILS</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{lead.clientName}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: 4 }}>
              {lead.serviceCategory} • {lead.phone}
            </div>
            {lead.address && <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 2 }}>📍 {lead.address}</div>}
          </div>
        )}

        {/* Amount */}
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 20, marginBottom: 20 }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 4 }}>Lead Acceptance Fee</div>
          <div className="payment-amount">₹99</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>One-time payment per lead</div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
          {[
            { icon: <MdSecurity />, label: 'Secured by Razorpay' },
            { icon: <MdPayment />,  label: 'UPI / Cards / Wallets' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--success)' }}>{b.icon}</span> {b.label}
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={handlePayment} disabled={paying}>
          {paying ? 'Processing…' : '💳 Pay ₹99 & Accept Lead'}
        </button>

        <button className="btn btn-secondary btn-full" style={{ marginTop: 10 }} onClick={() => navigate('/worker/leads')}>
          Cancel
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: 16 }}>
          By paying, you confirm acceptance of the lead and agree to contact the client promptly.
        </p>
      </div>
    </DashboardLayout>
  )
}

export default PaymentPage
