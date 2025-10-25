import React from 'react'
import './Products.css'

function Products() {
  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">Our Collection</h1>
          <p className="products-hero-subtitle">Explore our range of premium products</p>
        </div>
      </section>

      <div className="products-main">
        <div className="coming-soon-container">
          <div className="coming-soon-icon">📦</div>
          <h2 className="coming-soon-title">No Products Available</h2>
          <p className="coming-soon-message">Coming Soon</p>
        </div>
      </div>
    </div>
  )
}

export default Products
