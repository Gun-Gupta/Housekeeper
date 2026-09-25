import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public Pages
import Home       from './pages/public/Home'
import About      from './pages/public/About'
import Contact    from './pages/public/Contact'

// Auth Pages
import WorkerRegister  from './pages/auth/WorkerRegister'
import WorkerLogin     from './pages/auth/WorkerLogin'
import ClientRegister  from './pages/auth/ClientRegister'
import ClientLogin     from './pages/auth/ClientLogin'
import AdminLogin      from './pages/auth/AdminLogin'
import AdminRegister   from './pages/auth/AdminRegister'
import OTPVerification from './pages/auth/OTPVerification'

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard'
import LeadRequests    from './pages/worker/LeadRequests'
import PaymentPage     from './pages/worker/PaymentPage'
import WorkerProfile   from './pages/worker/WorkerProfile'

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard'
import WorkerListing   from './pages/client/WorkerListing'
import RequestStatus   from './pages/client/RequestStatus'
import ClientProfile   from './pages/client/ClientProfile'

// Admin Pages
import AdminDashboard    from './pages/admin/AdminDashboard'
import WorkerManagement  from './pages/admin/WorkerManagement'
import ClientManagement  from './pages/admin/ClientManagement'
import LeadManagement    from './pages/admin/LeadManagement'
import RevenuePage       from './pages/admin/RevenuePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"       element={<Home />} />
        <Route path="/about"  element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ── Auth ── */}
        <Route path="/worker/register"  element={<WorkerRegister />} />
        <Route path="/worker/login"     element={<WorkerLogin />} />
        <Route path="/client/register"  element={<ClientRegister />} />
        <Route path="/client/login"     element={<ClientLogin />} />
        <Route path="/admin/login"      element={<AdminLogin />} />
        <Route path="/admin/register"   element={<AdminRegister />} />
        <Route path="/verify-otp"       element={<OTPVerification />} />

        {/* ── Worker (protected) ── */}
        <Route path="/worker/dashboard" element={
          <ProtectedRoute allowedRole="worker"><WorkerDashboard /></ProtectedRoute>
        } />
        <Route path="/worker/leads" element={
          <ProtectedRoute allowedRole="worker"><LeadRequests /></ProtectedRoute>
        } />
        <Route path="/worker/payment/:leadId" element={
          <ProtectedRoute allowedRole="worker"><PaymentPage /></ProtectedRoute>
        } />
        <Route path="/worker/profile" element={
          <ProtectedRoute allowedRole="worker"><WorkerProfile /></ProtectedRoute>
        } />

        {/* ── Client (protected) ── */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute allowedRole="client"><ClientDashboard /></ProtectedRoute>
        } />
        <Route path="/client/workers" element={
          <ProtectedRoute allowedRole="client"><WorkerListing /></ProtectedRoute>
        } />
        <Route path="/client/requests" element={
          <ProtectedRoute allowedRole="client"><RequestStatus /></ProtectedRoute>
        } />
        <Route path="/client/profile" element={
          <ProtectedRoute allowedRole="client"><ClientProfile /></ProtectedRoute>
        } />

        {/* ── Admin (protected) ── */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/workers" element={
          <ProtectedRoute allowedRole="admin"><WorkerManagement /></ProtectedRoute>
        } />
        <Route path="/admin/clients" element={
          <ProtectedRoute allowedRole="admin"><ClientManagement /></ProtectedRoute>
        } />
        <Route path="/admin/leads" element={
          <ProtectedRoute allowedRole="admin"><LeadManagement /></ProtectedRoute>
        } />
        <Route path="/admin/revenue" element={
          <ProtectedRoute allowedRole="admin"><RevenuePage /></ProtectedRoute>
        } />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
