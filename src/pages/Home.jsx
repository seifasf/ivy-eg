import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiArrowRight, HiMail } from 'react-icons/hi'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { BiLink } from 'react-icons/bi'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-container">
          <img src="/IMGs/IVY-03.png" alt="IVY" className="hero-logo" />
          <p className="hero-slogan">Your Everyday Wingman</p>
          <button className="hero-cta" onClick={() => navigate('/products')}>
            <span>Explore Collection</span>
            <HiArrowRight size={20} />
          </button>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked selections for the discerning individual</p>
          </div>

          <div className="no-products-container">
            <div className="no-products-icon">📦</div>
            <h3 className="no-products-title">No Products Available</h3>
            <p className="no-products-message">Coming Soon</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-section-container">
          <h2 className="contact-section-title">Get In Touch</h2>
          <p className="contact-section-subtitle">
            Have questions? We're here to help you find what you need.
          </p>
          
          <div className="contact-info-box">
            <div className="contact-email">
              <HiMail size={24} />
              <a href="mailto:ivyforhelp@gmail.com">ivyforhelp@gmail.com</a>
            </div>
            
            <div className="contact-social">
              <a 
                href="https://www.instagram.com/ivywear.eg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <FaInstagram size={22} />
              </a>
              <a 
                href="https://www.tiktok.com/@ivywear.eg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <FaTiktok size={22} />
              </a>
              <a 
                href="https://linktr.ee/ivyeg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon-link"
              >
                <BiLink size={22} />
              </a>
            </div>
          </div>
          
          <button className="contact-cta" onClick={() => navigate('/contact')}>
            <span>Send Us a Message</span>
            <HiArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
