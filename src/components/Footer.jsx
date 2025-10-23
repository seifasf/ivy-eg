import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">IVY</h3>
            <p className="footer-description">
              Premium products for the modern athletic gentleman. 
              Performance meets style.
            </p>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Navigation</h4>
            <nav className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/products" className="footer-link">Products</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </nav>
          </div>
          
          <div className="footer-links-group">
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            &copy; {currentYear} IVY. All rights reserved. Crafted with precision.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
