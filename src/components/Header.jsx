import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiShoppingBag, HiMenu, HiX } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import './Header.css'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getCartCount } = useCart()

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
              <img src={`${process.env.PUBLIC_URL}/IMGs/IVY-03.png`} alt="IVY" className="logo-img" />
            </Link>

            <nav className="nav-right">
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                Contact
              </Link>
              
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
              <img src={`${process.env.PUBLIC_URL}/IMGs/IVY-03.png`} alt="IVY" className="logo-img" />
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
        </nav>

        <div className="mobile-menu-footer">
          <p className="mobile-menu-slogan">Your Everyday Wingman</p>
        </div>
      </div>
    </>
  )
}

export default Header
