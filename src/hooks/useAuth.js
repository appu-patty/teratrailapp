import { useState, useCallback, useEffect } from 'react'

const USERS_KEY = 'terratrail_users'
const SESSION_KEY = 'terratrail_session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {}
  } catch { return {} }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch { return null }
}

function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export default function useAuth() {
  const [user, setUser] = useState(() => getSession())

  const isAuthenticated = !!user

  const register = useCallback((username, password) => {
    const trimmed = username.trim().toLowerCase()
    if (!trimmed || !password) return { success: false, error: 'All fields are required' }
    if (trimmed.length < 3) return { success: false, error: 'Username must be at least 3 characters' }
    if (password.length < 4) return { success: false, error: 'Password must be at least 4 characters' }

    const users = getUsers()
    if (users[trimmed]) return { success: false, error: 'Username already exists' }

    const newUser = {
      username: trimmed,
      displayName: username.trim(),
      createdAt: Date.now(),
      stats: { totalDistance: 0, totalTime: 0, totalWalks: 0 },
    }
    users[trimmed] = { ...newUser, password }
    saveUsers(users)
    saveSession(newUser)
    setUser(newUser)
    return { success: true }
  }, [])

  const login = useCallback((username, password) => {
    const trimmed = username.trim().toLowerCase()
    const users = getUsers()
    const found = users[trimmed]

    if (!found || found.password !== password) {
      return { success: false, error: 'Invalid username or password' }
    }

    const { password: _, ...userData } = found
    saveSession(userData)
    setUser(userData)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    saveSession(null)
    setUser(null)
  }, [])

  const updateStats = useCallback((newDistance, newTime) => {
    if (!user) return
    const users = getUsers()
    const trimmed = user.username
    if (users[trimmed]) {
      users[trimmed].stats.totalDistance += newDistance
      users[trimmed].stats.totalTime += newTime
      users[trimmed].stats.totalWalks += 1
      saveUsers(users)
      const { password: _, ...userData } = users[trimmed]
      saveSession(userData)
      setUser(userData)
    }
  }, [user])

  return { user, isAuthenticated, login, register, logout, updateStats }
}
