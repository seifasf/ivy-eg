import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiShoppingBag, HiMenu, HiX, HiUser } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import './Header.css'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/size-guide', label: 'Size Guide' },
  { to: '/contact', label: 'Contact' }
]

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { isAuthenticated, user, logout } = useUser()
  const cartCount = getCartCount()

  const isActive = (to) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close menus when route changes
    setIsMobileMenuOpen(false)
    setShowUserMenu(false)
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
            <div className="header-top">
              <span aria-hidden="true" />

              <Link to="/" className="logo-center" aria-label="IVY home">
                <img src="/IMGs/IVY-03.png" alt="IVY" className="logo-img" />
              </Link>

              <div className="header-actions">
                {isAuthenticated && (
                  <div className="user-menu-wrapper">
                    <button
                      className="user-btn"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      aria-label="Account"
                      aria-expanded={showUserMenu}
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
                        <Link to="/track-orders" className="user-menu-item">
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
                )}

                <button className="cart-btn" onClick={handleCartClick} aria-label={`Bag, ${cartCount} items`}>
                  <HiShoppingBag size={20} />
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </button>
              </div>
            </div>

            <nav className="header-nav" aria-label="Main">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className={isActive(to) ? 'active' : ''}>
                  {label}
                </Link>
              ))}
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

            <button className="cart-btn-mobile" onClick={handleCartClick} aria-label={`Bag, ${cartCount} items`}>
              <HiShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
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
          {NAV_LINKS.map(({ to, label }, i) => (
            <Link key={to} to={to} className={isActive(to) ? 'active' : ''}>
              <span className="nav-number">{String(i + 1).padStart(2, '0')}</span>
              <span className="nav-text">{label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/track-orders"
              className={isActive('/track-orders') ? 'active' : ''}
            >
              <span className="nav-number">{String(NAV_LINKS.length + 1).padStart(2, '0')}</span>
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
