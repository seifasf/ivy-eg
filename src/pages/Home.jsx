import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiArrowRight, HiMail } from 'react-icons/hi'
import { IoWatch, IoHeadset, IoBag, IoGlasses } from 'react-icons/io5'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { BiLink } from 'react-icons/bi'
import './Home.css'

const products = [
  {
    id: 1,
    name: "Elegant Watch",
    description: "Timeless design meets modern technology",
    price: "2,999 EGP",
    icon: IoWatch,
    color: "linear-gradient(135deg, #2e5c8a 0%, #5b9fd8 100%)"
  },
  {
    id: 2,
    name: "Premium Headphones",
    description: "Immersive sound experience",
    price: "1,999 EGP",
    icon: IoHeadset,
    color: "linear-gradient(135deg, #1e4a6f 0%, #2e5c8a 100%)"
  },
  {
    id: 3,
    name: "Designer Bag",
    description: "Luxury crafted for everyday",
    price: "3,999 EGP",
    icon: IoBag,
    color: "linear-gradient(135deg, #5b9fd8 0%, #87c3f0 100%)"
  },
  {
    id: 4,
    name: "Smart Glasses",
    description: "Style meets innovation",
    price: "3,499 EGP",
    icon: IoGlasses,
    color: "linear-gradient(135deg, #0a2540 0%, #1e4a6f 100%)"
  }
]

function Home() {
  const [currentProduct, setCurrentProduct] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextProduct()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentProduct])

  const handleNextProduct = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length)
      setIsTransitioning(false)
    }, 400)
  }

  const handlePrevProduct = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentProduct((prev) => (prev - 1 + products.length) % products.length)
      setIsTransitioning(false)
    }, 400)
  }

  const handleDotClick = (index) => {
    if (index !== currentProduct) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentProduct(index)
        setIsTransitioning(false)
      }, 400)
    }
  }

  const handleAddToCart = () => {
    addToCart(products[currentProduct])
  }

  const ProductIcon = products[currentProduct].icon

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

          <div className="product-showcase">
            <button 
              className="showcase-arrow left" 
              onClick={handlePrevProduct}
              aria-label="Previous product"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className={`product-card-container ${isTransitioning ? 'transitioning' : ''}`}>
              <div 
                className="product-card-bg"
                style={{ background: products[currentProduct].color }}
              />
              
              <div className="product-card-main">
                <div className="product-icon-wrapper">
                  <ProductIcon size={80} className="product-icon" />
                </div>
                
                <div className="product-details">
                  <h3 className="product-name">{products[currentProduct].name}</h3>
                  <p className="product-description">{products[currentProduct].description}</p>
                  <div className="product-price">{products[currentProduct].price}</div>
                </div>

                <div className="product-actions">
                  <button className="btn-primary" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                  <button className="btn-secondary" onClick={() => navigate('/products')}>
                    View Details
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="showcase-arrow right" 
              onClick={handleNextProduct}
              aria-label="Next product"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="showcase-indicators">
            {products.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentProduct ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`View product ${index + 1}`}
              />
            ))}
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
