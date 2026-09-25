import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#E2E8F0',
            border: '1px solid #2A2A45',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#43D9A2', secondary: '#0F0F1A' } },
          error: { iconTheme: { primary: '#FF5C5C', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  </StrictMode>,
)
