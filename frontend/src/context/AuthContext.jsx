import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { fetchCurrentUser, login as apiLogin } from '../api/auth'
import { clearTokens, isAuthenticated, setTokens } from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const profile = await fetchCurrentUser()
      setUser(profile)
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = useCallback(async (username, password) => {
    const tokens = await apiLogin(username, password)
    setTokens(tokens)
    const profile = await fetchCurrentUser()
    setUser(profile)
    return profile
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
    }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
