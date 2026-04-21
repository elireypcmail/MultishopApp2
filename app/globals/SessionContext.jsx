import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { setCookie, removeCookie } from '@g/cookies'
import { authenticateWithCredentials } from '@g/authService'

const SESSION_STORAGE_KEY = 'multishop_session'

export const defaultSession = {
  tokenCode: null,
  identificacion: null,
  type_graph: null,
  type_comp: null,
  userId: null,
}

const SessionContext = createContext({
  session: defaultSession,
  isReady: false,
  login: () => { },
  logout: () => { },
  isAuthenticated: () => false,
  loginWithCredentials: async () => { },
})

function getStoredSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data && data.tokenCode) return data
    return null
  } catch {
    return null
  }
}

function saveSessionToStorage(session) {
  if (typeof window === 'undefined') return
  if (session && session.tokenCode) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(defaultSession)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = getStoredSession()
    if (stored) {
      setSession({
        tokenCode: stored.tokenCode ?? null,
        identificacion: stored.identificacion ?? null,
        type_graph: stored.type_graph ?? null,
        type_comp: stored.type_comp ?? null,
        userId: stored.userId ?? null,
      })
    }
    setIsReady(true)
  }, [])

  const login = useCallback((data) => {
    const newSession = {
      tokenCode: data.tokenCode ?? null,
      identificacion: data.identificacion ?? null,
      type_graph: data.type_graph ?? null,
      type_comp: data.type_comp ?? null,
      userId: data.userId ?? null,
    }
    setSession(newSession)
    saveSessionToStorage(newSession)
    if (newSession.identificacion) {
      setCookie('instancia', newSession.identificacion)
    }
    if (data.type_graph) localStorage.setItem('defaultGraphType', data.type_graph)
    if (data.type_comp) localStorage.setItem('typeCompanies', data.type_comp)
    if (data.userId) localStorage.setItem('idUser', String(data.userId))
  }, [])

  const loginWithCredentials = useCallback(
    async (cliente) => {
      const { res, tokenRes, baseSession, status } = await authenticateWithCredentials(cliente)

      if (status === 'active' || status === 'partial') {
        login(baseSession)
        const now = new Date()
        if (typeof window !== 'undefined') {
          localStorage.setItem('loginTime', now.toISOString())
        }
      }

      return { res, tokenRes, status }
    },
    [login]
  )

  const logout = useCallback(() => {
    setSession(defaultSession)
    saveSessionToStorage(null)
    removeCookie('instancia')
    localStorage.removeItem('defaultGraphType')
    localStorage.removeItem('typeCompanies')
    localStorage.removeItem('idUser')
    localStorage.removeItem('loginTime')
  }, [])

  const isAuthenticated = useCallback(() => {
    return !!(session && session.tokenCode)
  }, [session])

  return (
    <SessionContext.Provider
      value={{
        session,
        isReady,
        login,
        logout,
        isAuthenticated,
        loginWithCredentials,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de SessionProvider')
  }
  return ctx
}

export { SESSION_STORAGE_KEY, getStoredSession }
