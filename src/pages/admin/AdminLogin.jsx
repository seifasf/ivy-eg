import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import './AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAdmin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Attempt login
    const result = login(email, password)
    
    if (result.success) {
      navigate('/admin/dashboard')
    } else {
      setError(result.error || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-box">
          {/* Logo */}
          <div className="admin-logo-wrapper">
            <img src="/IMGs/IVY-03.png" alt="IVY Admin" className="admin-logo" />
          </div>

          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">Sign in to access the dashboard</p>

          {error && (
            <div className="admin-error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="email" className="admin-form-label">
                <HiMail size={18} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-form-input"
                placeholder="admin@ivy.eg"
                autoComplete="email"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">
                <HiLockClosed size={18} />
                <span>Password</span>
              </label>
              <div className="admin-password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-form-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p className="admin-login-note">
              🔒 Secure admin access only
            </p>
            <p className="admin-login-credentials">
              <strong>Default credentials:</strong><br />
              Email: admin@ivy.eg<br />
              Password: IVY@2025
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

