import { createContext, useCallback, useMemo, useState } from 'react'
import { loginUser } from '../services/api'

const AuthContext = createContext(null)

const readStoredSession = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedUser = localStorage.getItem('user')
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredSession())

  const login = async (credentials) => {
    const response = await loginUser(credentials)
    const sessionUser = {
      id: response.userId,
      name: response.name,
      email: response.email,
      role: response.role,
    }

    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(sessionUser))
    setUser(sessionUser)
    return sessionUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfileImage = useCallback((profileImage) => {
    const nextUser = { ...user, profileImage }
    localStorage.setItem('user', JSON.stringify(nextUser))
    setUser(nextUser)
  }, [user])

  const value = useMemo(() => ({ user, login, logout, updateProfileImage }), [user, updateProfileImage])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
