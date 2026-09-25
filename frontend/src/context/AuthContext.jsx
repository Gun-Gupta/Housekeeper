import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('hk_token')
    const storedUser  = localStorage.getItem('hk_user')
    const storedRole  = localStorage.getItem('hk_role')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setRole(storedRole)
    }
    setLoading(false)
  }, [])

  const login = (userData, tokenData, userRole) => {
    setUser(userData)
    setToken(tokenData)
    setRole(userRole)
    localStorage.setItem('hk_token', tokenData)
    localStorage.setItem('hk_user', JSON.stringify(userData))
    localStorage.setItem('hk_role', userRole)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setRole(null)
    localStorage.removeItem('hk_token')
    localStorage.removeItem('hk_user')
    localStorage.removeItem('hk_role')
  }

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
