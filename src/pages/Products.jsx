import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { IoWatch, IoHeadset, IoBag, IoGlasses, IoPhonePortrait, IoWallet } from 'react-icons/io5'
import { HiX, HiShoppingCart } from 'react-icons/hi'
import AddToCartNotification from '../components/AddToCartNotification'
import './Products.css'

const allProducts = [
  {
    id: 1,
    name: "Elegant Watch",
    description: "Timeless design meets modern technology. Premium materials with exceptional craftsmanship. Water-resistant up to 50m with sapphire crystal glass.",
    price: "2,999 EGP",
    category: "Accessories",
    icon: IoWatch,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",
      "https://images.unsplash.com/photo-1495856458515-0637185db551?w=800"
    ]
  },
  {
    id: 2,
    name: "Premium Headphones",
    description: "Immersive sound experience with active noise cancellation and premium audio quality. 30-hour battery life with quick charge support.",
    price: "1,999 EGP",
    category: "Audio",
    icon: IoHeadset,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800"
    ]
  },
  {
    id: 3,
    name: "Designer Bag",
    description: "Luxury crafted for everyday use. Genuine leather with elegant finish. Multiple compartments for organized storage.",
    price: "3,999 EGP",
    category: "Fashion",
    icon: IoBag,
    images: [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"
    ]
  },
  {
    id: 4,
    name: "Smart Glasses",
    description: "Style meets innovation with cutting-edge technology integrated seamlessly. UV protection with built-in speakers.",
    price: "3,499 EGP",
    category: "Accessories",
    icon: IoGlasses,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800"
    ]
  },
  {
    id: 5,
    name: "Wireless Speaker",
    description: "Crystal clear sound with powerful bass. Portable and long-lasting battery life. Waterproof design for outdoor use.",
    price: "1,599 EGP",
    category: "Audio",
    icon: IoPhonePortrait,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800"
    ]
  },
  {
    id: 6,
    name: "Leather Wallet",
    description: "Crafted with premium leather. Slim design with RFID protection. Multiple card slots and bill compartment.",
    price: "899 EGP",
    category: "Fashion",
    icon: IoWallet,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800",
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800"
    ]
  },
  {
    id: 7,
    name: "Smart Watch Pro",
    description: "Your fitness companion with advanced health tracking and smart features. Heart rate monitor, GPS, and sleep tracking.",
    price: "4,499 EGP",
    category: "Accessories",
    icon: IoWatch,
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800",
      "https://images.unsplash.com/photo-1617625802912-cdf8f61b0679?w=800"
    ]
  },
  {
    id: 8,
    name: "Bluetooth Earbuds",
    description: "Compact and powerful. Superior sound quality in a truly wireless design. Touch controls and voice assistant support.",
    price: "1,299 EGP",
    category: "Audio",
    icon: IoHeadset,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800"
    ]
  }
]

const sizes = ['S', 'M', 'L', 'XL']

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sizeError, setSizeError] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [addedProductName, setAddedProductName] = useState('')
  const { addToCart } = useCart()

  const categories = ["All", "Accessories", "Audio", "Fashion"]

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory)

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setSelectedSize('')
    setCurrentImageIndex(0)
    setSizeError(false)
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setSelectedSize('')
    setCurrentImageIndex(0)
    setSizeError(false)
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      if (!selectedSize) {
        setSizeError(true)
        return
      }
      addToCart({ ...selectedProduct, selectedSize: selectedSize })
      setAddedProductName(selectedProduct.name)
      setShowNotification(true)
      closeProductModal()
    }
  }
  
  const handleSizeSelect = (size) => {
    setSelectedSize(size)
    setSizeError(false)
  }

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      )
    }
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
          {filteredProducts.map(product => {
            const ProductIcon = product.icon
            return (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => openProductModal(product)}
              >
                <div className="product-card-icon">
                  <ProductIcon size={48} />
                </div>

                <div className="product-card-body">
                  <h3 className="product-card-title">{product.name}</h3>
                  <span className="product-card-price">{product.price}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductModal}>
              <HiX size={28} />
            </button>

            <div className="modal-content-grid">
              <div className="modal-image-section">
                <div className="image-carousel">
                  <button className="carousel-btn prev" onClick={prevImage}>
                    ‹
                  </button>
                  <img 
                    src={selectedProduct.images[currentImageIndex]} 
                    alt={selectedProduct.name}
                    className="product-modal-image"
                  />
                  <button className="carousel-btn next" onClick={nextImage}>
                    ›
                  </button>
                </div>
                <div className="image-indicators">
                  {selectedProduct.images.map((_, index) => (
                    <button
                      key={index}
                      className={`image-indicator ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-details-section">
                <span className="modal-badge">{selectedProduct.category}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <p className="modal-price">{selectedProduct.price}</p>
                <p className="modal-description">{selectedProduct.description}</p>

                <div className="modal-size-selector">
                  <label className="modal-size-label">Select Size: <span className="required-star">*</span></label>
                  <div className="modal-size-options">
                    {sizes.map(size => (
                      <button
                        key={size}
                        className={`modal-size-btn ${selectedSize === size ? 'active' : ''} ${sizeError ? 'error-shake' : ''}`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && (
                    <p className="size-error-message">⚠️ Please select a size before adding to cart</p>
                  )}
                </div>

                <button className="modal-add-to-cart" onClick={handleAddToCart}>
                  <HiShoppingCart size={22} />
                  <span>Add to Cart - {selectedProduct.price}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddToCartNotification 
        show={showNotification}
        onClose={() => setShowNotification(false)}
        productName={addedProductName}
      />
    </div>
  )
}

export default Products
