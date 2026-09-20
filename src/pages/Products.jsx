import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { publicProductsAPI, getImageUrl } from '../services/api'
import { ProductSkeleton } from '../components/LoadingSkeleton'
import { HiShoppingCart, HiArrowRight } from 'react-icons/hi'
import './Products.css'

function Products() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await publicProductsAPI.getAll()
      
      if (!data || !Array.isArray(data)) {
        setProducts([])
        return
      }
      
      // Filter only in-stock products for public view
      const inStockProducts = data.filter(p => p.inStock)
      setProducts(inStockProducts)
    } catch (error) {
      setProducts([])
      alert(`Failed to load products: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => 
    ['all', ...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  )
  
  const filteredProducts = useMemo(() => 
    selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory),
    [products, selectedCategory]
  )

  const handleAddToCart = (product) => {
    // Calculate the final price (use discount price if available and lower)
    const finalPrice = product.discountPrice && product.discountPrice < product.price 
      ? product.discountPrice 
      : product.price
    
    // Check if product has sizes
    if (product.sizes && product.sizes.length > 0) {
      // For now, add with first available size
      // In a full implementation, you'd show a size selector
      addToCart({
        id: product._id,
        name: product.title,
        price: finalPrice,
        image: getImageUrl(product.mainImage),
        selectedSize: product.sizes[0]
      })
    } else {
      addToCart({
        id: product._id,
        name: product.title,
        price: finalPrice,
        image: getImageUrl(product.mainImage)
      })
    }
  }

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">Our Collection</h1>
          <p className="products-hero-subtitle">Explore our range of premium products</p>
        </div>
      </section>

      <div className="products-main">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="products-grid">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
        <div className="coming-soon-container">
          <div className="coming-soon-icon">📦</div>
          <h2 className="coming-soon-title">No Products Available</h2>
            <p className="coming-soon-message">
              {selectedCategory !== 'all' ? 'No products in this category' : 'Coming Soon'}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card">
                <div className="product-image-wrapper">
                  <img 
                    src={getImageUrl(product.mainImage)} 
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.src = '/IMGs/IVY-03.png'
                    }}
                  />
                  {product.discountPrice < product.price && (
                    <div className="discount-badge">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-pricing">
                    {product.discountPrice < product.price ? (
                      <>
                        <span className="original-price">{product.price.toLocaleString()} EGP</span>
                        <span className="final-price">{product.discountPrice.toLocaleString()} EGP</span>
                      </>
                    ) : (
                      <span className="final-price">{product.price.toLocaleString()} EGP</span>
                    )}
                  </div>
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <HiShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
        )}
      </div>
    </div>
  )
}

export default Products
