import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { BiLink } from 'react-icons/bi'
import { HiMail } from 'react-icons/hi'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <img src="/IMGs/IVY-03.png" alt="IVY" className="footer-logo" />
        
        <p className="footer-slogan">Your Everyday Wingman</p>
        
        <div className="social-links">
          <a 
            href="https://www.instagram.com/ivywear.eg" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a 
            href="https://www.tiktok.com/@ivywear.eg" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok size={24} />
          </a>
          <a 
            href="https://linktr.ee/ivyeg" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Linktree"
          >
            <BiLink size={24} />
          </a>
        </div>
        
        <Link to="/contact" className="contact-btn">
          <HiMail size={20} />
          <span>Contact Us</span>
        </Link>
        
        <p className="copyright">&copy; {currentYear} IVY. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
