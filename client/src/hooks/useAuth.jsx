import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_STORAGE_KEY = 'ttl_registered_users'
const ACTIVE_USER_KEY = 'ttl_active_user'

// Pre-seeded default demo account
const DEFAULT_USERS = [
  {
    name: 'Demo Learner',
    email: 'demo@texttolearn.ai',
    password: 'password123',
    id: 'user_default_1',
  },
]

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS))
      return DEFAULT_USERS
    }
    return JSON.parse(raw)
  } catch {
    return DEFAULT_USERS
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users', e)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const active = localStorage.getItem(ACTIVE_USER_KEY)
      return active ? JSON.parse(active) : null
    } catch {
      return null
    }
  })

  // Sign in existing user with email & password check
  const signIn = (email, password) => {
    const users = getStoredUsers()
    const cleanEmail = email.trim().toLowerCase()
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (!found) {
      return { success: false, error: 'User does not exist. Please sign up first.' }
    }

    if (found.password && found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }

    const sessionUser = {
      name: found.name,
      email: found.email,
      id: found.id,
    }
    setUser(sessionUser)
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(sessionUser))
    return { success: true, user: sessionUser }
  }

  // Sign up new user
  const signUp = (name, email, password) => {
    const users = getStoredUsers()
    const cleanEmail = email.trim().toLowerCase()
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' }
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: password,
      id: 'user_' + Date.now(),
    }

    const updated = [...users, newUser]
    saveUsers(updated)

    const sessionUser = {
      name: newUser.name,
      email: newUser.email,
      id: newUser.id,
    }
    setUser(sessionUser)
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(sessionUser))
    return { success: true, user: sessionUser }
  }

  // 1-Click Demo Login
  const demoLogin = () => {
    return signIn('demo@texttolearn.ai', 'password123')
  }

  // Log out
  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem(ACTIVE_USER_KEY)
    } catch (e) {
      console.error(e)
    }
  }

  const loginWithRedirect = () => {
    window.location.href = '/login'
  }

  const getAccessTokenSilently = async () => {
    return 'session-token-' + (user?.id || 'guest')
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    configured: true,
    signIn,
    signUp,
    demoLogin,
    logout,
    loginWithRedirect,
    getAccessTokenSilently,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context) return context

  // Fallback if context not mounted yet
  const saved = (() => {
    try {
      const active = localStorage.getItem(ACTIVE_USER_KEY)
      return active ? JSON.parse(active) : null
    } catch {
      return null
    }
  })()

  return {
    user: saved,
    isAuthenticated: Boolean(saved),
    isLoading: false,
    configured: true,
    signIn: () => ({ success: false, error: 'Auth context not initialized' }),
    signUp: () => ({ success: false, error: 'Auth context not initialized' }),
    demoLogin: () => {},
    logout: () => {
      localStorage.removeItem(ACTIVE_USER_KEY)
      window.location.reload()
    },
    loginWithRedirect: () => {
      window.location.href = '/login'
    },
    getAccessTokenSilently: async () => 'session-token',
  }
}
