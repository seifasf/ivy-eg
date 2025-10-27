import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if admin is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const storedAdmin = localStorage.getItem('adminUser')
    
    if (token && storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin)
        setAdminUser(admin)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing admin data:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    
    try {
      const response = await authAPI.login({ email, password })
      
      // Backend returns: { token, user: { id, fullName, email, phone } }
      localStorage.setItem('adminToken', response.token)
      localStorage.setItem('adminUser', JSON.stringify(response.user))
      
      setAdminUser(response.user)
      setIsAuthenticated(true)
      setLoading(false)
      
      return { success: true }
    } catch (error) {
      setLoading(false)
      return { success: false, error: error.message || 'Login failed. Please check your credentials.' }
    }
  }

  const logout = () => {
    setAdminUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  }

  const value = {
    isAuthenticated,
    adminUser,
    loading,
    login,
    logout
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

