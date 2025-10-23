import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { IoWatch, IoHeadset, IoBag, IoGlasses, IoPhonePortrait, IoWallet } from 'react-icons/io5'
import { HiX, HiShoppingCart } from 'react-icons/hi'
import './Products.css'

const allProducts = [
  {
    id: 1,
    name: "Elegant Watch",
    description: "Timeless design meets modern technology. Premium materials with exceptional craftsmanship.",
    price: "$299",
    category: "Accessories",
    icon: IoWatch
  },
  {
    id: 2,
    name: "Premium Headphones",
    description: "Immersive sound experience with active noise cancellation and premium audio quality.",
    price: "$199",
    category: "Audio",
    icon: IoHeadset
  },
  {
    id: 3,
    name: "Designer Bag",
    description: "Luxury crafted for everyday use. Genuine leather with elegant finish.",
    price: "$399",
    category: "Fashion",
    icon: IoBag
  },
  {
    id: 4,
    name: "Smart Glasses",
    description: "Style meets innovation with cutting-edge technology integrated seamlessly.",
    price: "$349",
    category: "Accessories",
    icon: IoGlasses
  },
  {
    id: 5,
    name: "Wireless Speaker",
    description: "Crystal clear sound with powerful bass. Portable and long-lasting battery life.",
    price: "$159",
    category: "Audio",
    icon: IoPhonePortrait
  },
  {
    id: 6,
    name: "Leather Wallet",
    description: "Crafted with premium leather. Slim design with RFID protection.",
    price: "$89",
    category: "Fashion",
    icon: IoWallet
  },
  {
    id: 7,
    name: "Smart Watch Pro",
    description: "Your fitness companion with advanced health tracking and smart features.",
    price: "$449",
    category: "Accessories",
    icon: IoWatch
  },
  {
    id: 8,
    name: "Bluetooth Earbuds",
    description: "Compact and powerful. Superior sound quality in a truly wireless design.",
    price: "$129",
    category: "Audio",
    icon: IoHeadset
  }
]

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { addToCart } = useCart()

  const categories = ["All", "Accessories", "Audio", "Fashion"]

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory)

  const handleAddToCart = (product) => {
    addToCart(product)
  }

  const handleQuickView = (product) => {
    setSelectedProduct(product)
  }

  const closeQuickView = () => {
    setSelectedProduct(null)
  }

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <h1 className="products-hero-title">Our Collection</h1>
          <p className="products-hero-subtitle">
            Discover products that define excellence and sophistication
          </p>
        </div>
      </section>

      <div className="products-main">
        <div className="filter-bar">
          <h3 className="filter-label">Categories</h3>
          <div className="filter-chips">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid-container">
          {filteredProducts.map((product, index) => {
            const ProductIcon = product.icon
            return (
              <div
                key={product.id}
                className="product-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="product-card-icon">
                  <ProductIcon size={56} />
                </div>
                
                <div className="product-card-body">
                  <span className="product-badge">{product.category}</span>
                  <h3 className="product-card-title">{product.name}</h3>
                  <p className="product-card-desc">{product.description}</p>
                </div>

                <div className="product-card-footer">
                  <span className="product-card-price">{product.price}</span>
                  <div className="product-card-actions">
                    <button 
                      className="btn-quick-view"
                      onClick={() => handleQuickView(product)}
                    >
                      Quick View
                    </button>
                    <button 
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <HiShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedProduct && (
        <>
          <div className="modal-overlay" onClick={closeQuickView} />
          <div className="quick-view-modal">
            <button className="modal-close-btn" onClick={closeQuickView}>
              <HiX size={24} />
            </button>
            
            <div className="modal-grid">
              <div className="modal-icon-section">
                {React.createElement(selectedProduct.icon, { size: 120, className: 'modal-product-icon' })}
              </div>
              
              <div className="modal-info-section">
                <span className="modal-badge">{selectedProduct.category}</span>
                <h2 className="modal-product-title">{selectedProduct.name}</h2>
                <p className="modal-product-description">{selectedProduct.description}</p>
                <div className="modal-product-price">{selectedProduct.price}</div>
                <button 
                  className="modal-add-to-cart-btn"
                  onClick={() => {
                    handleAddToCart(selectedProduct)
                    closeQuickView()
                  }}
                >
                  <HiShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Products
