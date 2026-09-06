import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Configured = Boolean(auth0Domain && auth0ClientId)

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('text_to_learn_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    const defaultUser = {
      name: userData?.name || (userData?.email ? userData.email.split('@')[0] : 'Learner'),
      email: userData?.email || 'learner@texttolearn.ai',
      sub: 'local-user-' + Date.now(),
    }
    setUser(defaultUser)
    try {
      localStorage.setItem('text_to_learn_user', JSON.stringify(defaultUser))
    } catch (e) {
      console.error(e)
    }
    return defaultUser
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('text_to_learn_user')
    } catch (e) {
      console.error(e)
    }
  }

  const loginWithRedirect = (options) => {
    window.location.href = '/login'
  }

  const getAccessTokenSilently = async () => {
    return 'demo-session-token-' + (user?.email || 'guest')
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    configured: true,
    login,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth: Returns active user state and authentication methods.
 * Seamlessly works out-of-the-box in demo mode, or connects to Auth0 if configured.
 */
export function useAuth() {
  if (auth0Configured) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth0 = useAuth0()
    return { ...auth0, configured: true }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(AuthContext)
  if (context) return context

  // Fallback if not wrapped in provider
  const saved = (() => {
    try {
      const s = localStorage.getItem('text_to_learn_user')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })()

  return {
    user: saved,
    isAuthenticated: Boolean(saved),
    isLoading: false,
    configured: true,
    login: (u) => {
      localStorage.setItem('text_to_learn_user', JSON.stringify(u))
      window.location.reload()
    },
    logout: () => {
      localStorage.removeItem('text_to_learn_user')
      window.location.reload()
    },
    loginWithRedirect: () => {
      window.location.href = '/login'
    },
    getAccessTokenSilently: async () => 'demo-token',
  }
}
