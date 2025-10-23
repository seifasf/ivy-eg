import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiShoppingBag } from 'react-icons/hi'
import './Header.css'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { getCartCount, setIsCartOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-ivy">IVY</span>
        </Link>
        
        <nav className="nav-menu">
          <Link 
            to="/" 
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-item ${location.pathname === '/products' ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/contact" 
            className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
          
          <button 
            className="cart-icon-button" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping cart"
          >
            <HiShoppingBag size={22} />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
