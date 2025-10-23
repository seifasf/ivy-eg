import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { HiArrowRight, HiSparkles, HiLightningBolt, HiStar } from 'react-icons/hi'
import { IoWatch, IoHeadset, IoBag, IoGlasses } from 'react-icons/io5'
import './Home.css'

const products = [
  {
    id: 1,
    name: "Elegant Watch",
    description: "Timeless design meets modern technology",
    price: "$299",
    icon: IoWatch,
    color: "linear-gradient(135deg, #2e5c8a 0%, #5b9fd8 100%)"
  },
  {
    id: 2,
    name: "Premium Headphones",
    description: "Immersive sound experience",
    price: "$199",
    icon: IoHeadset,
    color: "linear-gradient(135deg, #1e4a6f 0%, #2e5c8a 100%)"
  },
  {
    id: 3,
    name: "Designer Bag",
    description: "Luxury crafted for everyday",
    price: "$399",
    icon: IoBag,
    color: "linear-gradient(135deg, #5b9fd8 0%, #87c3f0 100%)"
  },
  {
    id: 4,
    name: "Smart Glasses",
    description: "Style meets innovation",
    price: "$349",
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
          <div className="hero-badge">
            <HiSparkles size={16} />
            <span>Welcome to IVY</span>
          </div>
          <h1 className="hero-heading">
            Discover Elegance
            <span className="hero-gradient-text">Redefined</span>
          </h1>
          <p className="hero-description">
            Experience luxury in every detail. Curated collections that define sophistication and timeless style.
          </p>
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

      <section className="features-section">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon-box">
                <HiStar size={28} />
              </div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-text">
                Every product is carefully crafted with meticulous attention to detail and excellence.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <HiLightningBolt size={28} />
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-text">
                Swift and reliable shipping to ensure your products arrive when you need them.
              </p>
            </div>

            <div className="feature-item">
              <div className="feature-icon-box">
                <HiSparkles size={28} />
              </div>
              <h3 className="feature-title">Exclusive Design</h3>
              <p className="feature-text">
                Unique collections you won't find anywhere else, designed for the modern aesthetic.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
