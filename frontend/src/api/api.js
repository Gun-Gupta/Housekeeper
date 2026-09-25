import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hk_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Auth ───────────────────────────────────────────────────
export const workerRegister = (data) => API.post('/workers/register', data)
export const workerLogin    = (data) => API.post('/workers/login', data)
export const clientRegister = (data) => API.post('/clients/register', data)
export const clientLogin    = (data) => API.post('/clients/login', data)
export const adminLogin     = (data) => API.post('/admin/login', data)
export const adminRegister  = (data) => API.post('/admin/register', data)

// ─── OTP ────────────────────────────────────────────────────
export const sendOtp   = (data) => API.post('/otp/send', data)
export const verifyOtp = (data) => API.post('/otp/verify', data)

// ─── Workers ────────────────────────────────────────────────
export const getAllWorkers    = ()       => API.get('/workers/all')
export const getWorkerById   = (id)     => API.get(`/workers/${id}`)
export const updateWorker    = (id, d)  => API.put(`/workers/${id}`, d)
export const blockWorker     = (id)     => API.put(`/workers/block/${id}`)
export const deleteWorker    = (id)     => API.delete(`/workers/${id}`)
export const getWorkerLeads  = (id)     => API.get(`/workers/${id}/leads`)

// ─── Clients ────────────────────────────────────────────────
export const getAllClients  = ()      => API.get('/clients/all')
export const getClientById = (id)    => API.get(`/clients/${id}`)
export const updateClient  = (id, d) => API.put(`/clients/${id}`, d)
export const deleteClient  = (id)    => API.delete(`/clients/${id}`)
export const blockClient   = (id)    => API.put(`/clients/block/${id}`)

// ─── Leads ──────────────────────────────────────────────────
export const createLead   = (data)   => API.post('/leads/create', data)
export const getAllLeads   = ()       => API.get('/leads/all')
export const assignWorker = (id, d)  => API.put(`/leads/assign/${id}`, d)
export const acceptLead   = (id, d)  => API.put(`/leads/assign/${id}`, d)
export const rejectLead   = (id)     => API.put(`/leads/cancel/${id}`)
export const completeLead = (id)     => API.put(`/leads/complete/${id}`)
export const cancelLead   = (id)     => API.put(`/leads/cancel/${id}`)

// ─── Payments ───────────────────────────────────────────────
export const createPaymentOrder = (data) => API.post('/payment/create-order', data)
export const verifyPayment      = (data) => API.post('/payment/verify-payment', data)

// ─── Admin ──────────────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats')

export default API
