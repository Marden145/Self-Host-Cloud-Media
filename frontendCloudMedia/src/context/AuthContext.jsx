import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { session } from '../utils/session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [TokenResponse, setTokenResponse] = useState(() => session.read()) 

  const login = useCallback((tokenResponse) => {
    session.save(tokenResponse)
    setTokenResponse(tokenResponse)
  }, [])

  const logout = useCallback(() => {
    session.clear()
    setTokenResponse(null)
  }, [])
   useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

  const value = useMemo(
    () => ({
      userEmail: TokenResponse?.correo ?? null,
      token: TokenResponse?.accessToken ?? null,
      isAuthenticated: Boolean(TokenResponse?.validacionExitosa),
      login,
      logout,
    }),
    [TokenResponse, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}