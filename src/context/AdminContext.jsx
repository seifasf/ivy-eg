import React, { createContext, useContext, useState, useEffect } from 'react'

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
    const storedAdmin = localStorage.getItem('ivyAdmin')
    if (storedAdmin) {
      try {
        const admin = JSON.parse(storedAdmin)
        setAdminUser(admin)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing admin data:', error)
        localStorage.removeItem('ivyAdmin')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // TODO: Replace with actual API call
    // For now, using hardcoded credentials
    const ADMIN_EMAIL = 'admin@ivy.eg'
    const ADMIN_PASSWORD = 'IVY@2025'

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = {
        email: email,
        name: 'Admin',
        loginTime: new Date().toISOString()
      }
      setAdminUser(admin)
      setIsAuthenticated(true)
      localStorage.setItem('ivyAdmin', JSON.stringify(admin))
      return { success: true }
    } else {
      return { success: false, error: 'Invalid email or password' }
    }
  }

  const logout = () => {
    setAdminUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('ivyAdmin')
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

