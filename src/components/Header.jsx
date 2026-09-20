import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiShoppingBag, HiMenu, HiX, HiUser } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import { GoogleLogin } from '@react-oauth/google'
import './Header.css'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { isAuthenticated, user, login, logout } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [location])

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleCartClick = () => {
    navigate('/cart')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Desktop Layout */}
          <div className="header-desktop">
            <nav className="nav-left">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
              <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
                Products
              </Link>
            </nav>

            <Link to="/" className="logo-center">
              <img src="/IMGs/IVY-03.png" alt="IVY" className="logo-img" />
            </Link>

            <nav className="nav-right">
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                Contact
              </Link>
              
              {isAuthenticated ? (
                <div className="user-menu-wrapper">
                  <button 
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user?.picture ? (
                      <img src={user.picture} alt={user.fullName} className="user-avatar" />
                    ) : (
                      <HiUser size={20} />
                    )}
                  </button>
                  {showUserMenu && (
                    <div className="user-menu">
                      <div className="user-menu-header">
                        <p className="user-name">{user?.fullName}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                      <Link 
                        to="/track-orders" 
                        className="user-menu-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button 
                        className="user-menu-item logout"
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="google-login-wrapper">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        // Decode JWT to get user info
                        const base64Url = credentialResponse.credential.split('.')[1]
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        }).join(''))
                        const userData = JSON.parse(jsonPayload)
                        
                        const result = await login(userData)
                        if (result.success) {
                          // Successfully logged in
                        }
                      } catch (error) {
                        alert('Failed to sign in. Please try again.')
                      }
                    }}
                    onError={() => {
                      // Google login failed
                    }}
                    useOneTap
                    theme="outline"
                    size="medium"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>
              )}
              
              <button className="cart-btn" onClick={handleCartClick}>
                <HiShoppingBag size={20} />
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </button>
            </nav>
          </div>

          {/* Mobile Layout */}
          <div className="header-mobile">
            <button 
              className="hamburger-btn" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            <Link to="/" className="logo-mobile">
              <img src="/IMGs/IVY-03.png" alt="IVY" className="logo-img" />
            </Link>

            <button className="cart-btn-mobile" onClick={handleCartClick}>
              <HiShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="cart-count">{getCartCount()}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            <span className="nav-number">01</span>
            <span className="nav-text">Home</span>
          </Link>
          <Link 
            to="/products" 
            className={location.pathname === '/products' ? 'active' : ''}
          >
            <span className="nav-number">02</span>
            <span className="nav-text">Products</span>
          </Link>
          <Link 
            to="/contact" 
            className={location.pathname === '/contact' ? 'active' : ''}
          >
            <span className="nav-number">03</span>
            <span className="nav-text">Contact</span>
          </Link>
          {isAuthenticated && (
            <Link 
              to="/track-orders" 
              className={location.pathname === '/track-orders' ? 'active' : ''}
            >
              <span className="nav-number">04</span>
              <span className="nav-text">My Orders</span>
            </Link>
          )}
        </nav>

        <div className="mobile-menu-footer">
          <p className="mobile-menu-slogan">Your Everyday Wingman</p>
        </div>
      </div>
    </>
  )
}

export default Header
